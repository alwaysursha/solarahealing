"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useEffect, useId, useRef, useState } from "react";
import { GoogleSignInButton } from "@/components/auth/AuthForms";
import { useEnrollmentGate } from "@/components/auth/EnrollmentGateProvider";
import { registerUserAction } from "@/lib/admin/actions";
import { getAuthCallbackUrl } from "@/lib/auth-utils";

export function SignUpModal() {
  const reduceMotion = useReducedMotion();
  const { signUpOpen, closeSignUp, handleSignUpSuccess, stashPendingForOAuth } = useEnrollmentGate();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const submitRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
    if (!signUpOpen) return;
    setMode("signup");
    setError(null);
    setCallbackUrl(getAuthCallbackUrl("/"));
  }, [signUpOpen]);

  useEffect(() => {
    if (!signUpOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSignUp();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeSignUp, signUpOpen]);

  return (
    <AnimatePresence>
      {signUpOpen ? (
        <motion.div
          key="signup-modal"
          className="auth-gate-modal-root"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            className="auth-gate-modal-backdrop"
            aria-label="Close sign up"
            onClick={closeSignUp}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-gate-title"
            className="auth-gate-modal"
            initial={reduceMotion ? undefined : { opacity: 0, y: 22, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
          >
            <div className="auth-gate-modal-glow" aria-hidden />
            <button type="button" className="auth-gate-modal-close" aria-label="Close" onClick={closeSignUp}>
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <p className="auth-gate-modal-eyebrow">
              {mode === "signup" ? "Join Soulara Healing Academy" : "Welcome back"}
            </p>
            <h2 id="auth-gate-title" className="auth-gate-modal-title">
              {mode === "signup" ? "Create your account" : "Sign in to continue"}
            </h2>
            <p className="auth-gate-modal-copy">
              {mode === "signup"
                ? "Sign up to enroll in courses and reserve workshop seats — your cart will be waiting."
                : "Sign in to finish adding this selection to your cart."}
            </p>

            <GoogleSignInButton
              callbackUrl={callbackUrl}
              onBeforeSignIn={stashPendingForOAuth}
            />

            <div className="auth-gate-divider">
              <span>or email</span>
            </div>

            <form
              className="auth-gate-form"
              onSubmit={async (event) => {
                event.preventDefault();
                if (loading) return;
                setLoading(true);
                setError(null);
                const form = event.currentTarget;
                const formData = new FormData(form);
                const email = formData.get("email")?.toString() ?? "";
                const password = formData.get("password")?.toString() ?? "";
                const name =
                  formData.get("name")?.toString().trim() ||
                  email.split("@")[0] ||
                  "Friend";

                try {
                  if (mode === "signup") {
                    const result = await registerUserAction(formData);
                    if (!result.ok) {
                      setError(result.error ?? "Could not create account.");
                      return;
                    }
                  }

                  const signInResult = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                    callbackUrl,
                  });

                  if (signInResult?.error || !signInResult?.ok) {
                    setError(
                      mode === "signup"
                        ? "Account created, but sign-in failed. Please try signing in."
                        : "Invalid email or password.",
                    );
                    return;
                  }

                  await handleSignUpSuccess(name, submitRef.current);
                } catch {
                  setError("Something went wrong. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {mode === "signup" ? (
                <label className="auth-gate-label" htmlFor={nameId}>
                  Full name
                  <input id={nameId} name="name" required className="auth-gate-input" autoComplete="name" />
                </label>
              ) : null}
              <label className="auth-gate-label" htmlFor={emailId}>
                Email
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  className="auth-gate-input"
                  autoComplete="email"
                />
              </label>
              <label className="auth-gate-label" htmlFor={passwordId}>
                Password
                <input
                  id={passwordId}
                  name="password"
                  type="password"
                  minLength={mode === "signup" ? 8 : undefined}
                  required
                  className="auth-gate-input"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </label>

              {error ? <p className="auth-gate-error">{error}</p> : null}

              <button
                ref={submitRef}
                type="submit"
                disabled={loading}
                className="auth-gate-submit"
              >
                <span className="auth-gate-submit-shine" aria-hidden />
                <span className="relative">
                  {loading
                    ? mode === "signup"
                      ? "Creating account…"
                      : "Signing in…"
                    : mode === "signup"
                      ? "Create account"
                      : "Sign in"}
                </span>
              </button>
            </form>

            <p className="auth-gate-switch">
              {mode === "signup" ? (
                <>
                  Already a member?{" "}
                  <button type="button" onClick={() => setMode("signin")}>
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New here?{" "}
                  <button type="button" onClick={() => setMode("signup")}>
                    Create account
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
