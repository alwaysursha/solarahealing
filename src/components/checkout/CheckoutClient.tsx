"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutPaymentForm } from "@/components/checkout/CheckoutPaymentForm";
import {
  CheckoutWhatsAppField,
  type CheckoutWhatsAppFieldHandle,
} from "@/components/checkout/CheckoutWhatsAppField";
import { saveCheckoutWhatsAppAction } from "@/lib/account/actions";
import { cartTypeLabel, type CartItem } from "@/lib/cart/types";
import { formatCad } from "@/lib/site";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M10 2.5 16.25 5v4.75c0 3.85-2.55 6.45-6.25 7.75C6.3 16.2 3.75 13.6 3.75 9.75V5L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.5 10.1 9.1 11.7 12.6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QtyStepper({
  id,
  value,
  onChange,
  disabled = false,
}: {
  id: string;
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="checkout-qty" role="group" aria-label="Quantity">
      <button
        type="button"
        className="checkout-qty-btn"
        aria-label="Decrease quantity"
        disabled={disabled}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        −
      </button>
      <input
        id={id}
        type="number"
        min={1}
        max={20}
        value={value}
        disabled={disabled}
        className="checkout-qty-input"
        onChange={(event) => onChange(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
      />
      <button
        type="button"
        className="checkout-qty-btn"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(Math.min(20, value + 1))}
      >
        +
      </button>
    </div>
  );
}

function CheckoutLine({
  item,
  featured = false,
  locked = false,
  onRemove,
  onQty,
}: {
  item: CartItem;
  featured?: boolean;
  locked?: boolean;
  onRemove: () => void;
  onQty: (qty: number) => void;
}) {
  return (
    <li className={["checkout-line", featured ? "checkout-line-featured" : ""].join(" ")}>
      <div className="checkout-line-media">
        {item.image ? (
          <Image src={item.image} alt="" fill className="object-cover" sizes="140px" />
        ) : (
          <span className="checkout-line-media-fallback" />
        )}
        {featured ? <span className="checkout-line-live">Live</span> : null}
      </div>

      <div className="checkout-line-main">
        <div className="checkout-line-top">
          <div className="min-w-0">
            <p className="checkout-line-type">{cartTypeLabel(item.type)}</p>
            <h3 className="checkout-line-title">{item.title}</h3>
            <p className="checkout-line-unit">{formatCad(item.priceCad)} each</p>
          </div>
          <p className="checkout-line-total">{formatCad(item.priceCad * item.quantity)}</p>
        </div>

        <div className="checkout-line-controls">
          <QtyStepper
            id={`qty-${item.type}-${item.id}`}
            value={item.quantity}
            disabled={locked}
            onChange={onQty}
          />
          {!locked ? (
            <button type="button" className="checkout-remove" onClick={onRemove}>
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

type PaymentSession = {
  clientSecret: string;
  publishableKey: string;
  orderId: string;
  totalCad: number;
};

export function CheckoutClient({
  initialWhatsApp,
  customerName = "",
  customerEmail = "",
  isAuthenticated,
  canceled = false,
}: {
  initialWhatsApp: string;
  customerName?: string;
  customerEmail?: string;
  isAuthenticated: boolean;
  canceled?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const { items, totalCad, totalQuantity, removeItem, updateQuantity } = useCart();
  const workshops = items.filter((item) => item.type === "workshop");
  const privateSessions = items.filter((item) => item.type === "private_session");
  const courses = items.filter((item) => item.type === "course");
  const isEmpty = items.length === 0;
  const [whatsappValid, setWhatsappValid] = useState(isValidWhatsAppNumber(initialWhatsApp));
  const [whatsappValue, setWhatsappValue] = useState(initialWhatsApp);
  const [payMessage, setPayMessage] = useState<string | null>(
    canceled ? "Payment was canceled. You can try again when you’re ready." : null,
  );
  const [savingPay, setSavingPay] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const whatsappFieldRef = useRef<CheckoutWhatsAppFieldHandle>(null);

  const paymentLocked = Boolean(paymentSession);

  async function handleProceed() {
    if (!isAuthenticated) {
      setPayMessage("Sign in to continue to payment.");
      return;
    }
    if (!whatsappValid || !isValidWhatsAppNumber(whatsappValue)) {
      setPayMessage(null);
      whatsappFieldRef.current?.showRequiredError(
        whatsappValue.trim()
          ? "Enter a valid WhatsApp number with country code (8–15 digits)."
          : "WhatsApp number is required to continue.",
      );
      return;
    }
    if (items.length === 0) {
      setPayMessage("Your cart is empty.");
      return;
    }

    setSavingPay(true);
    setPayMessage(null);
    try {
      const whatsappResult = await saveCheckoutWhatsAppAction(whatsappValue);
      if (!whatsappResult.ok) {
        whatsappFieldRef.current?.showRequiredError(whatsappResult.error);
        return;
      }

      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: whatsappValue,
          items: items.map((item) => ({
            id: item.id,
            type: item.type,
            quantity: item.quantity,
          })),
        }),
      });

      let payload: {
        ok?: boolean;
        clientSecret?: string;
        publishableKey?: string;
        orderId?: string;
        totalCad?: number;
        error?: string;
      } = {};
      try {
        payload = (await response.json()) as typeof payload;
      } catch {
        setPayMessage(
          response.ok
            ? "Could not start checkout. Please try again."
            : "Checkout service returned an unexpected error. Please try again.",
        );
        return;
      }

      if (
        !response.ok ||
        !payload.ok ||
        !payload.clientSecret ||
        !payload.publishableKey ||
        typeof payload.totalCad !== "number"
      ) {
        setPayMessage(payload.error ?? "Could not start checkout. Please try again.");
        return;
      }

      setPaymentSession({
        clientSecret: payload.clientSecret,
        publishableKey: payload.publishableKey,
        orderId: payload.orderId ?? "",
        totalCad: payload.totalCad,
      });
    } catch {
      setPayMessage("Could not start checkout. Please try again.");
    } finally {
      setSavingPay(false);
    }
  }

  function handleBackFromPayment() {
    setPaymentSession(null);
    setPayMessage(null);
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page-aura" aria-hidden />
      <div className="checkout-page-inner">
        <motion.header
          className="checkout-hero"
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="checkout-hero-eyebrow">Soulara Healing Academy</p>
          <h1 className="checkout-hero-title">Complete your journey</h1>
          <p className="checkout-hero-copy">
            {paymentLocked
              ? "Enter your payment details below — you stay on Soulara the whole way."
              : "Review your workshops, private sessions, and courses, then pay securely on this page."}
          </p>
          {!isEmpty ? (
            <div className="checkout-hero-meta">
              <span>
                {totalQuantity} {totalQuantity === 1 ? "selection" : "selections"}
              </span>
              <span className="checkout-hero-meta-dot" aria-hidden />
              <span>{formatCad(totalCad)}</span>
            </div>
          ) : null}
        </motion.header>

        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              className="checkout-empty"
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="checkout-empty-orb" aria-hidden />
              <p className="checkout-empty-eyebrow">Your cart is quiet</p>
              <h2 className="checkout-empty-title">Nothing here yet</h2>
              <p className="checkout-empty-copy">
                Reserve a workshop seat, book a private session, or enroll in a course to begin checkout.
              </p>
              <div className="checkout-empty-actions">
                <Link href="/#sessions" className="checkout-cta-primary">
                  Browse sessions
                </Link>
                <Link href="/#courses" className="checkout-cta-ghost">
                  Browse courses
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              className="checkout-layout"
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <div className="checkout-main">
                {workshops.length > 0 ? (
                  <section className="checkout-section checkout-section-workshops">
                    <div className="checkout-section-header">
                      <p className="checkout-section-eyebrow">Live seats</p>
                      <h2 className="checkout-section-title">Workshops</h2>
                    </div>
                    <ul className="checkout-lines">
                      {workshops.map((item) => (
                        <CheckoutLine
                          key={`workshop-${item.id}`}
                          item={item}
                          featured
                          locked={paymentLocked}
                          onRemove={() => removeItem(item.id, item.type)}
                          onQty={(qty) => updateQuantity(item.id, item.type, qty)}
                        />
                      ))}
                    </ul>
                  </section>
                ) : null}

                {privateSessions.length > 0 ? (
                  <section className="checkout-section">
                    <div className="checkout-section-header">
                      <p className="checkout-section-eyebrow">One-to-one</p>
                      <h2 className="checkout-section-title">Private sessions</h2>
                    </div>
                    <ul className="checkout-lines">
                      {privateSessions.map((item) => (
                        <CheckoutLine
                          key={`private_session-${item.id}`}
                          item={item}
                          locked={paymentLocked}
                          onRemove={() => removeItem(item.id, item.type)}
                          onQty={(qty) => updateQuantity(item.id, item.type, qty)}
                        />
                      ))}
                    </ul>
                  </section>
                ) : null}

                {courses.length > 0 ? (
                  <section className="checkout-section">
                    <div className="checkout-section-header">
                      <p className="checkout-section-eyebrow">Self-paced</p>
                      <h2 className="checkout-section-title">Courses</h2>
                    </div>
                    <ul className="checkout-lines">
                      {courses.map((item) => (
                        <CheckoutLine
                          key={`course-${item.id}`}
                          item={item}
                          locked={paymentLocked}
                          onRemove={() => removeItem(item.id, item.type)}
                          onQty={(qty) => updateQuantity(item.id, item.type, qty)}
                        />
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>

              <section
                className={[
                  "checkout-summary",
                  paymentLocked ? "checkout-summary-paying" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={paymentLocked ? "Payment" : "Order summary"}
              >
                <div className="checkout-summary-glow" aria-hidden />

                <div className="checkout-summary-top">
                  <div>
                    <p className="checkout-summary-eyebrow">
                      {paymentLocked ? "Secure payment" : "Order summary"}
                    </p>
                    <h2 className="checkout-summary-title">
                      {paymentLocked ? "Complete your payment" : "Ready when you are"}
                    </h2>
                  </div>

                  <dl className="checkout-summary-totals">
                    {workshops.length > 0 ? (
                      <div className="checkout-summary-row">
                        <dt>Workshops</dt>
                        <dd>
                          {formatCad(
                            workshops.reduce((sum, item) => sum + item.priceCad * item.quantity, 0),
                          )}
                        </dd>
                      </div>
                    ) : null}
                    {courses.length > 0 ? (
                      <div className="checkout-summary-row">
                        <dt>Courses</dt>
                        <dd>
                          {formatCad(
                            courses.reduce((sum, item) => sum + item.priceCad * item.quantity, 0),
                          )}
                        </dd>
                      </div>
                    ) : null}
                    <div className="checkout-summary-row checkout-summary-total">
                      <dt>Total</dt>
                      <dd>{formatCad(paymentSession?.totalCad ?? totalCad)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="checkout-summary-body">
                  {!paymentLocked ? (
                    <div className="checkout-summary-prepare">
                      <CheckoutWhatsAppField
                        ref={whatsappFieldRef}
                        initialWhatsApp={initialWhatsApp}
                        isAuthenticated={isAuthenticated}
                        onValidityChange={(valid) => {
                          setWhatsappValid(valid);
                          setPayMessage(null);
                        }}
                        onValueChange={setWhatsappValue}
                      />

                      <button
                        type="button"
                        className="checkout-pay-button"
                        disabled={!isAuthenticated || savingPay}
                        onClick={handleProceed}
                      >
                        <span className="checkout-pay-shine" aria-hidden />
                        <span className="relative">
                          {savingPay ? "Preparing payment…" : "Continue to payment"}
                        </span>
                      </button>

                      {payMessage ? (
                        <p className="checkout-summary-pay-message" role="status">
                          {payMessage}
                        </p>
                      ) : null}
                    </div>
                  ) : paymentSession ? (
                    <CheckoutPaymentForm
                      clientSecret={paymentSession.clientSecret}
                      publishableKey={paymentSession.publishableKey}
                      totalCad={paymentSession.totalCad}
                      customer={{
                        name: customerName,
                        email: customerEmail,
                        whatsapp: whatsappValue,
                      }}
                      onBack={handleBackFromPayment}
                    />
                  ) : null}
                </div>

                <div className="checkout-summary-footer">
                  <p className="checkout-summary-secure">
                    <ShieldIcon />
                    Secure payment powered by Stripe · You never leave this site
                  </p>
                  <Link href="/" className="checkout-continue-browsing">
                    Continue Browsing
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
