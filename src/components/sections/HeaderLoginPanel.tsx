"use client";

import { useEffect, useId, useState } from "react";
import { signIn } from "next-auth/react";
import { GoogleSignInButton } from "@/components/auth/AuthForms";
import { registerUserAction } from "@/lib/admin/actions";
import { requestPasswordResetAction } from "@/lib/auth/password-reset";
import { getAuthCallbackUrl, getPostLoginRedirectUrl } from "@/lib/auth-utils";

type HeaderLoginPanelProps = {
  onClose: () => void;
};

type PanelMode = "signin" | "signup" | "forgot";

export function HeaderLoginPanel({ onClose }: HeaderLoginPanelProps) {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const [mode, setMode] = useState<PanelMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    setCallbackUrl(getAuthCallbackUrl("/"));
  }, []);

  function switchMode(next: PanelMode) {
    setMode(next);
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  }

  const eyebrow =
    mode === "signup" ? "Join Soulara" : mode === "forgot" ? "Account help" : "Member access";
  const title =
    mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back";
  const submitLabel =
    mode === "signup"
      ? submitting
        ? "Creating…"
        : "Create account"
      : mode === "forgot"
        ? submitting
          ? "Sending…"
          : "Send reset link"
        : submitting
          ? "Signing in…"
          : "Sign in";

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
              setSuccess(null);

              try {
                const returnUrl = getAuthCallbackUrl("/");
                const formData = new FormData(event.currentTarget);
                const email = formData.get("email")?.toString() ?? "";
                const password = formData.get("password")?.toString() ?? "";

                if (mode === "forgot") {
                  const result = await requestPasswordResetAction(email);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  setSuccess(result.message);
                  return;
                }

                if (mode === "signup") {
                  const result = await registerUserAction(formData);
                  if (!result.ok) {
                    setError(result.error ?? "Could not create account.");
                    return;
                  }
                }

                const result = await signIn("credentials", {
                  email,
                  password,
                  redirect: false,
                  callbackUrl: returnUrl,
                });

                if (result?.error) {
                  setError(
                    mode === "signup"
                      ? "Account created, but sign-in failed. Please try signing in."
                      : "Invalid email or password.",
                  );
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
                <p className="whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold/82 sm:text-[0.72rem]">
                  {eyebrow}
                </p>
                <h2 className="mt-1 font-serif text-[1.35rem] font-normal leading-none tracking-[-0.02em] text-cream sm:text-[1.5rem] lg:text-[1.65rem]">
                  {title}
                </h2>
              </div>

              <div
                className={
                  mode === "forgot"
                    ? "header-login-fields header-login-fields-single"
                    : "header-login-fields"
                }
              >
                {mode === "signup" ? (
                  <div className="header-login-field-span min-w-0">
                    <label htmlFor={nameId} className="header-login-label">
                      Full name
                    </label>
                    <input
                      id={nameId}
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      className="header-login-input header-login-input-compact mt-1.5"
                      disabled={submitting}
                      required
                    />
                  </div>
                ) : null}

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
                  <p className="mt-2 text-[0.82rem] leading-snug text-cream/52 sm:text-[0.88rem]">
                    {mode === "signin" ? (
                      <>
                        New here?{" "}
                        <button
                          type="button"
                          className="font-medium text-gold/88 transition-colors hover:text-gold-light"
                          onClick={() => switchMode("signup")}
                        >
                          Create account
                        </button>
                      </>
                    ) : mode === "signup" ? (
                      <>
                        Already a member?{" "}
                        <button
                          type="button"
                          className="font-medium text-gold/88 transition-colors hover:text-gold-light"
                          onClick={() => switchMode("signin")}
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="font-medium text-gold/88 transition-colors hover:text-gold-light"
                        onClick={() => switchMode("signin")}
                      >
                        Back to sign in
                      </button>
                    )}
                  </p>
                </div>

                {mode !== "forgot" ? (
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <label htmlFor={passwordId} className="header-login-label">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-cream/48 transition-colors hover:text-gold sm:text-[0.78rem]"
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
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      placeholder="Password"
                      minLength={mode === "signup" ? 8 : undefined}
                      className="header-login-input header-login-input-compact mt-1.5"
                      disabled={submitting}
                      required
                    />
                    <p className="mt-2 text-right text-[0.82rem] leading-snug sm:text-[0.88rem]">
                      {mode === "signin" ? (
                        <button
                          type="button"
                          className="font-medium text-gold/86 transition-colors hover:text-gold-light"
                          onClick={() => switchMode("forgot")}
                        >
                          Forgot your password?
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="font-medium text-gold/86 transition-colors hover:text-gold-light"
                          onClick={() => switchMode("signin")}
                        >
                          Back to sign in
                        </button>
                      )}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="header-login-actions">
                <button
                  type="submit"
                  className="header-login-submit header-login-submit-compact disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                >
                  <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
                  <span className="relative">{submitLabel}</span>
                </button>
                {mode !== "forgot" ? (
                  <>
                    <div className="header-login-divider header-login-divider-mobile" aria-hidden>
                      or
                    </div>
                    <GoogleSignInButton callbackUrl={callbackUrl} compact />
                  </>
                ) : null}
              </div>
            </div>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            {success ? <p className="text-sm text-cream/80">{success}</p> : null}
          </form>
        </div>
      </div>
    </div>
  );
}
