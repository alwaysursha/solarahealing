"use client";

import Link from "next/link";
import { useState } from "react";
import { resetPasswordAction } from "@/lib/auth/password-reset";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="auth-page-form-stack">
        <p className="auth-page-error">
          This reset link is missing or invalid. Request a new one from the sign-in panel in the
          header.
        </p>
        <p className="auth-page-switch">
          <Link href="/">Back to home</Link>
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="auth-page-form-stack">
        <p className="auth-page-copy" style={{ marginTop: 0, textAlign: "center" }}>
          Your password was updated. You can sign in whenever you are ready.
        </p>
        <Link href="/auth/sign-in" className="auth-page-submit">
          <span className="auth-page-submit-shine" aria-hidden />
          <span className="relative">Sign in</span>
        </Link>
      </div>
    );
  }

  return (
    <form
      className="auth-page-form"
      onSubmit={async (event) => {
        event.preventDefault();
        if (loading) return;
        setLoading(true);
        setError(null);

        try {
          const formData = new FormData(event.currentTarget);
          const result = await resetPasswordAction({
            token,
            password: formData.get("password")?.toString() ?? "",
            confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
          });

          if (!result.ok) {
            setError(result.error);
            return;
          }

          setDone(true);
        } catch {
          setError("Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <label className="auth-page-label">
        New password
        <input
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className="auth-page-input"
        />
      </label>
      <label className="auth-page-label">
        Confirm password
        <input
          name="confirmPassword"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className="auth-page-input"
        />
      </label>
      {error ? <p className="auth-page-error">{error}</p> : null}
      <button type="submit" disabled={loading} className="auth-page-submit">
        <span className="auth-page-submit-shine" aria-hidden />
        <span className="relative">{loading ? "Updating…" : "Update password"}</span>
      </button>
    </form>
  );
}
