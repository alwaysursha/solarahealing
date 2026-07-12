"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleSignInButton } from "@/components/auth/AuthForms";
import { getAuthCallbackUrl, getPostLoginRedirectUrl } from "@/lib/auth-utils";

type HeaderLoginPanelProps = {
  onClose: () => void;
};

export function HeaderLoginPanel({ onClose }: HeaderLoginPanelProps) {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    setCallbackUrl(getAuthCallbackUrl("/"));
  }, []);

  return (
    <div className="header-login-panel relative mt-2.5 w-full">
      <div className="header-login-panel-inner relative overflow-hidden rounded-[1.1rem] border border-gold/25 px-4 py-3.5 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.55)] sm:rounded-[1.25rem] sm:px-5 sm:py-4">
        <div className="header-login-panel-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="header-login-panel-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative z-[1]">
          <form
            className="header-login-form flex flex-col gap-2.5"
            onSubmit={async (event) => {
              event.preventDefault();
              if (submitting) {
                return;
              }

              setSubmitting(true);
              setError(null);

              try {
                const returnUrl = getAuthCallbackUrl("/");
                const formData = new FormData(event.currentTarget);
                const result = await signIn("credentials", {
                  email: formData.get("email")?.toString() ?? "",
                  password: formData.get("password")?.toString() ?? "",
                  redirect: false,
                  callbackUrl: returnUrl,
                });

                if (result?.error) {
                  setError("Invalid email or password.");
                  return;
                }

                if (!result?.ok) {
                  setError("Could not sign in. Please try again.");
                  return;
                }

                onClose();
                window.location.assign(await getPostLoginRedirectUrl(returnUrl));
              } catch {
                setError("Something went wrong. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="header-login-form-layout">
              <div className="header-login-intro">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.3em] text-gold/82">
                  Member access
                </p>
                <h2 className="mt-1 font-serif text-[1.15rem] font-normal leading-none tracking-[-0.02em] text-cream lg:text-[1.25rem]">
                  Welcome back
                </h2>
              </div>

              <div className="header-login-fields">
                <div className="min-w-0">
                  <label htmlFor={emailId} className="header-login-label">
                    Email ID
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className="header-login-input header-login-input-compact mt-1.5"
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor={passwordId} className="header-login-label">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-cream/48 transition-colors hover:text-gold"
                      onClick={() => setShowPassword((value) => !value)}
                      disabled={submitting}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    className="header-login-input header-login-input-compact mt-1.5"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="header-login-actions">
                <button
                  type="submit"
                  className="header-login-submit header-login-submit-compact disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                >
                  <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
                  <span className="relative">{submitting ? "Signing in…" : "Sign in"}</span>
                </button>
                <div className="header-login-divider header-login-divider-mobile" aria-hidden>
                  or
                </div>
                <GoogleSignInButton callbackUrl={callbackUrl} compact />
              </div>
            </div>

            {error ? <p className="text-xs text-red-300">{error}</p> : null}

            <div className="header-login-footer flex flex-wrap items-center justify-between gap-x-4 gap-y-1 md:pl-[8.5rem]">
              <Link
                href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="text-[0.68rem] font-medium text-gold/86 transition-colors hover:text-gold-light"
                onClick={onClose}
              >
                Forgot your password?
              </Link>
              <p className="text-[0.68rem] text-cream/52">
                New here?{" "}
                <Link
                  href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="font-medium text-gold/88 transition-colors hover:text-gold-light"
                  onClick={onClose}
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
