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
      <div className="space-y-4">
        <p className="text-sm text-red-700">
          This reset link is missing or invalid. Request a new one from the sign-in panel in the
          header.
        </p>
        <Link href="/" className="font-medium text-gold hover:text-gold-light">
          Back to home
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-purple-deep/75">
          Your password was updated. You can sign in from the header whenever you are ready.
        </p>
        <Link
          href="/"
          className="relative inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-wide text-purple-deep shadow-lg shadow-gold/30 transition hover:bg-gold-light"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
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
      <label className="block text-sm">
        <span className="font-medium text-purple-deep/75">New password</span>
        <input
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-purple-deep/75">Confirm password</span>
        <input
          name="confirmPassword"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="relative inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-wide text-purple-deep shadow-lg shadow-gold/30 transition hover:bg-gold-light disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
