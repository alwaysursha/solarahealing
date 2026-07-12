"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { saveCheckoutWhatsAppAction } from "@/lib/account/actions";
import {
  formatWhatsAppDisplay,
  isValidWhatsAppNumber,
  normalizeWhatsAppNumber,
} from "@/lib/whatsapp";

type CheckoutWhatsAppFieldProps = {
  initialWhatsApp: string;
  isAuthenticated: boolean;
  onValidityChange: (valid: boolean) => void;
  onValueChange: (value: string) => void;
};

export function CheckoutWhatsAppField({
  initialWhatsApp,
  isAuthenticated,
  onValidityChange,
  onValueChange,
}: CheckoutWhatsAppFieldProps) {
  const [savedDigits, setSavedDigits] = useState(normalizeWhatsAppNumber(initialWhatsApp));
  const [value, setValue] = useState(savedDigits ? formatWhatsAppDisplay(savedDigits) : "");
  const [editing, setEditing] = useState(!savedDigits);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const digits = normalizeWhatsAppNumber(value);
  const isValid = isValidWhatsAppNumber(value);

  function updateValue(next: string) {
    setValue(next);
    onValueChange(normalizeWhatsAppNumber(next));
    onValidityChange(isValidWhatsAppNumber(next));
  }

  function startEditing() {
    setEditing(true);
    setStatus(null);
    setError(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function persistIfNeeded(nextValue: string) {
    if (!isAuthenticated) {
      onValidityChange(isValidWhatsAppNumber(nextValue));
      return;
    }

    if (!isValidWhatsAppNumber(nextValue)) {
      return;
    }

    const nextDigits = normalizeWhatsAppNumber(nextValue);
    if (nextDigits === savedDigits) {
      setValue(formatWhatsAppDisplay(nextDigits));
      setEditing(false);
      setError(null);
      onValueChange(nextDigits);
      onValidityChange(true);
      return;
    }

    startTransition(async () => {
      const result = await saveCheckoutWhatsAppAction(nextValue);
      if (!result.ok) {
        setError(result.error);
        setStatus(null);
        onValidityChange(false);
        return;
      }

      setSavedDigits(result.whatsapp);
      setValue(formatWhatsAppDisplay(result.whatsapp));
      setEditing(false);
      setError(null);
      setStatus("Saved to your profile");
      onValueChange(result.whatsapp);
      onValidityChange(true);
    });
  }

  function handleBlur() {
    if (!editing) {
      return;
    }

    if (!value.trim()) {
      setError("WhatsApp number is required to continue.");
      onValidityChange(false);
      return;
    }

    if (!isValid) {
      setError("Enter a valid WhatsApp number with country code (8–15 digits).");
      onValidityChange(false);
      return;
    }

    setError(null);
    persistIfNeeded(value);
  }

  return (
    <div className="checkout-whatsapp">
      <div className="checkout-whatsapp-header">
        <label htmlFor="checkout-whatsapp" className="checkout-whatsapp-label">
          WhatsApp number
          <span className="checkout-whatsapp-required">Required</span>
        </label>
        {!editing && isValid ? (
          <button type="button" className="checkout-whatsapp-edit" onClick={startEditing}>
            Edit
          </button>
        ) : null}
      </div>

      {editing ? (
        <input
          ref={inputRef}
          id="checkout-whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          name="whatsapp"
          required
          placeholder="+1 555 123 4567"
          value={value}
          disabled={pending}
          className="checkout-whatsapp-input"
          aria-invalid={Boolean(error)}
          aria-describedby="checkout-whatsapp-why-popup"
          onChange={(event) => {
            const next = event.target.value;
            setError(null);
            setStatus(null);
            updateValue(next);
          }}
          onBlur={handleBlur}
        />
      ) : (
        <p className="checkout-whatsapp-value">{formatWhatsAppDisplay(digits)}</p>
      )}

      <div className="checkout-whatsapp-why">
        <button
          type="button"
          className="checkout-whatsapp-why-trigger"
          aria-describedby="checkout-whatsapp-why-popup"
        >
          Why WhatsApp Number?
          <span className="checkout-whatsapp-why-icon" aria-hidden>
            ?
          </span>
        </button>
        <div
          id="checkout-whatsapp-why-popup"
          className="checkout-whatsapp-why-popup"
          role="tooltip"
        >
          <p>
            We use your WhatsApp number to keep you informed with course-related updates, valuable
            learning resources, and details about upcoming sessions. You&apos;ll also be invited to
            join our exclusive WhatsApp Community, where you can stay connected and receive ongoing
            guidance.
          </p>
          <p className="checkout-whatsapp-why-privacy-title">Privacy Disclaimer</p>
          <p>
            Your WhatsApp number will be used solely for Academy-related communication and will never
            be shared with anyone outside our team. If you join our private WhatsApp Community, your
            number will not be shared separately with other participants. We are committed to
            protecting your personal information and respecting your privacy.
          </p>
        </div>
      </div>

      {!isAuthenticated ? (
        <Link href="/auth/sign-in?callbackUrl=/checkout" className="checkout-whatsapp-signin">
          Sign in to continue
        </Link>
      ) : null}

      {error ? (
        <p className="checkout-whatsapp-error" role="alert">
          {error}
        </p>
      ) : null}
      {status && !pending ? (
        <p className="checkout-whatsapp-status" role="status">
          {status}
        </p>
      ) : null}
      {pending ? <p className="checkout-whatsapp-status">Saving…</p> : null}
    </div>
  );
}
