"use client";

import { getPostLoginRedirectUrl, markPostLoginRedirectPending } from "@/lib/auth-utils";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-page-form-stack">
      <button
        type="button"
        className="auth-page-google"
        onClick={() => {
          markPostLoginRedirectPending();
          signIn("google", { callbackUrl });
        }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="auth-page-divider">
        <span>or email</span>
      </div>

      <form
        className="auth-page-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          try {
            const formData = new FormData(event.currentTarget);
            const result = await signIn("credentials", {
              email: formData.get("email")?.toString() ?? "",
              password: formData.get("password")?.toString() ?? "",
              redirect: false,
              callbackUrl,
            });
            if (result?.error) {
              setError("Invalid email or password.");
              return;
            }
            if (!result?.ok) {
              setError("Could not sign in. Please try again.");
              return;
            }
            router.push(await getPostLoginRedirectUrl(callbackUrl));
            router.refresh();
          } catch {
            setError("Something went wrong. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="auth-page-label">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="auth-page-input"
          />
        </label>
        <label className="auth-page-label">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="auth-page-input"
          />
        </label>
        {error ? <p className="auth-page-error">{error}</p> : null}
        <button type="submit" disabled={loading} className="auth-page-submit">
          <span className="auth-page-submit-shine" aria-hidden />
          <span className="relative">{loading ? "Signing in…" : "Sign in"}</span>
        </button>
      </form>

      <p className="auth-page-switch">
        New here?{" "}
        <Link href="/auth/sign-up">Create account</Link>
      </p>
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="auth-page-form-stack">
      <button
        type="button"
        className="auth-page-google"
        onClick={() => {
          markPostLoginRedirectPending();
          signIn("google", { callbackUrl });
        }}
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <div className="auth-page-divider">
        <span>or email</span>
      </div>

      <form
        className="auth-page-form"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          const formData = new FormData(event.currentTarget);
          const { registerUserAction } = await import("@/lib/admin/actions");
          const result = await registerUserAction(formData);
          if (!result.ok) {
            setLoading(false);
            setError(result.error ?? "Could not create account.");
            return;
          }
          const signInResult = await signIn("credentials", {
            email: formData.get("email")?.toString() ?? "",
            password: formData.get("password")?.toString() ?? "",
            redirect: false,
            callbackUrl,
          });
          setLoading(false);
          if (signInResult?.error) {
            setError("Account created, but sign-in failed. Please sign in manually.");
            return;
          }
          router.push(await getPostLoginRedirectUrl(callbackUrl));
          router.refresh();
        }}
      >
        <label className="auth-page-label">
          Full name
          <input name="name" required autoComplete="name" className="auth-page-input" />
        </label>
        <label className="auth-page-label">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="auth-page-input"
          />
        </label>
        <label className="auth-page-label">
          Password
          <input
            name="password"
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
          <span className="relative">
            {loading ? "Creating account…" : "Create account"}
          </span>
        </button>
      </form>

      <p className="auth-page-switch">
        Already a member? <Link href="/auth/sign-in">Sign in</Link>
      </p>
    </div>
  );
}

export function GoogleSignInButton({
  callbackUrl = "/account",
  compact = false,
  onBeforeSignIn,
}: {
  callbackUrl?: string;
  compact?: boolean;
  onBeforeSignIn?: () => void;
}) {
  return (
    <button
      type="button"
      className={
        compact
          ? "header-login-google header-login-google-compact"
          : "auth-gate-google flex w-full items-center justify-center gap-3 rounded-full border border-purple-deep/10 bg-white px-4 py-3 text-sm font-medium text-purple-deep transition hover:border-gold/40"
      }
      aria-label="Continue with Google"
      onClick={() => {
        onBeforeSignIn?.();
        markPostLoginRedirectPending();
        signIn("google", { callbackUrl });
      }}
    >
      <GoogleIcon />
      {!compact ? (
        <span>Continue with Google</span>
      ) : (
        <>
          <span className="header-login-google-label-full">Continue with Google</span>
          <span className="header-login-google-label-short">Google</span>
        </>
      )}
    </button>
  );
}
