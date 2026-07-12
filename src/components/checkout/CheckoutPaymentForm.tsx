"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useMemo, useState, type FormEvent } from "react";
import { formatCad } from "@/lib/site";

const stripeAppearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: "#D4AD35",
    colorBackground: "rgba(250, 247, 242, 0.06)",
    colorText: "#faf7f2",
    colorTextSecondary: "rgba(250, 247, 242, 0.72)",
    colorDanger: "#f3b4b4",
    colorTextPlaceholder: "rgba(250, 247, 242, 0.4)",
    borderRadius: "12px",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      backgroundColor: "rgba(250, 247, 242, 0.06)",
      border: "1px solid rgba(238, 207, 120, 0.28)",
      boxShadow: "none",
      color: "#faf7f2",
    },
    ".Input:focus": {
      border: "1px solid rgba(238, 207, 120, 0.55)",
      boxShadow: "0 0 0 1px rgba(238, 207, 120, 0.25)",
    },
    ".Label": {
      color: "rgba(250, 247, 242, 0.78)",
      fontWeight: "600",
      letterSpacing: "0.04em",
    },
    ".Tab": {
      backgroundColor: "rgba(250, 247, 242, 0.04)",
      border: "1px solid rgba(250, 247, 242, 0.12)",
      color: "rgba(250, 247, 242, 0.72)",
    },
    ".Tab--selected": {
      backgroundColor: "rgba(212, 173, 53, 0.16)",
      border: "1px solid rgba(238, 207, 120, 0.45)",
      color: "#f7ecd0",
    },
    ".TabIcon--selected": {
      fill: "#D4AD35",
    },
    ".Block": {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  },
};

function PaymentFormInner({
  totalCad,
  onBack,
}: {
  totalCad: number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePay(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message ?? "Check your payment details and try again.");
      setSubmitting(false);
      return;
    }

    const returnUrl = `${window.location.origin}/checkout/success`;
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "Payment could not be completed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      window.location.assign(
        `/checkout/success?payment_intent=${encodeURIComponent(paymentIntent.id)}`,
      );
      return;
    }

    setMessage("Payment is still processing. You will receive confirmation shortly.");
    setSubmitting(false);
  }

  return (
    <form className="checkout-payment" onSubmit={handlePay}>
      <div className="checkout-payment-header">
        <div>
          <p className="checkout-payment-eyebrow">Secure payment</p>
          <h3 className="checkout-payment-title">Pay on this page</h3>
        </div>
        <button type="button" className="checkout-payment-back" onClick={onBack} disabled={submitting}>
          Edit order
        </button>
      </div>

      <div className="checkout-payment-element">
        <PaymentElement
          options={{
            layout: "tabs",
            business: { name: "Soulara Healing Academy" },
          }}
        />
      </div>

      <button type="submit" className="checkout-pay-button" disabled={!stripe || !elements || submitting}>
        <span className="checkout-pay-shine" aria-hidden />
        <span className="relative">{submitting ? "Processing…" : `Pay ${formatCad(totalCad)}`}</span>
      </button>

      {message ? (
        <p className="checkout-summary-pay-message" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function CheckoutPaymentForm({
  clientSecret,
  publishableKey,
  totalCad,
  onBack,
}: {
  clientSecret: string;
  publishableKey: string;
  totalCad: number;
  onBack: () => void;
}) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: stripeAppearance,
    }),
    [clientSecret],
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormInner totalCad={totalCad} onBack={onBack} />
    </Elements>
  );
}
