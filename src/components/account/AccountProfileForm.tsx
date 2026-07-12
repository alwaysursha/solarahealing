"use client";

import { useActionState, useEffect, useState } from "react";
import {
  updateAccountProfileAction,
  type AccountActionResult,
} from "@/lib/account/actions";
import { formatWhatsAppDisplay } from "@/lib/whatsapp";

const initialState: AccountActionResult | null = null;

export function AccountProfileForm({
  name,
  email,
  whatsapp,
}: {
  name: string;
  email: string;
  whatsapp: string;
}) {
  const [state, formAction, pending] = useActionState(updateAccountProfileAction, initialState);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      setSavedNotice(true);
      const timer = window.setTimeout(() => setSavedNotice(false), 2800);
      return () => window.clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={formAction} className="account-panel account-profile-form">
      <div className="account-panel-header">
        <p className="account-section-eyebrow">Details</p>
        <h2 className="account-section-title">Profile</h2>
        <p className="account-section-copy">
          WhatsApp is optional here — we only require it when you check out.
        </p>
      </div>

      <label className="account-field">
        <span className="account-field-label">Name</span>
        <input name="name" required defaultValue={name} className="account-field-input" />
      </label>

      <div className="account-field">
        <span className="account-field-label">Email</span>
        <p className="account-field-static">{email}</p>
      </div>

      <label className="account-field">
        <span className="account-field-label-row">
          <span className="account-field-label">WhatsApp number</span>
          <span className="account-field-optional">Optional</span>
        </span>
        <input
          name="whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+1 555 123 4567"
          defaultValue={whatsapp ? formatWhatsAppDisplay(whatsapp) : ""}
          className="account-field-input"
        />
        <span className="account-field-hint">Include country code for WhatsApp messages.</span>
      </label>

      {state && !state.ok ? (
        <p className="account-form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {savedNotice ? (
        <p className="account-form-status" role="status">
          Profile saved.
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="account-save-button">
        <span className="account-save-shine" aria-hidden />
        <span className="relative">{pending ? "Saving…" : "Save profile"}</span>
      </button>
    </form>
  );
}
