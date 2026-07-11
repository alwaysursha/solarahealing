"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
    <div className="space-y-5">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-purple-deep/10 bg-white px-4 py-3 text-sm font-medium text-purple-deep transition hover:border-gold/40"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-purple-deep/40">
        <span className="h-px flex-1 bg-purple-deep/10" />
        or email
        <span className="h-px flex-1 bg-purple-deep/10" />
      </div>

      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          const formData = new FormData(event.currentTarget);
          const result = await signIn("credentials", {
            email: formData.get("email")?.toString() ?? "",
            password: formData.get("password")?.toString() ?? "",
            redirect: false,
            callbackUrl,
          });
          setLoading(false);
          if (result?.error) {
            setError("Invalid email or password.");
            return;
          }
          router.push(callbackUrl);
          router.refresh();
        }}
      >
        <label className="block text-sm">
          <span className="font-medium text-purple-deep/75">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-purple-deep/75">Password</span>
          <input
            name="password"
            type="password"
            required
            className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="relative inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-wide text-purple-deep shadow-lg shadow-gold/30 transition hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-purple-deep/60">
        New here?{" "}
        <Link href="/auth/sign-up" className="font-medium text-gold hover:text-gold-light">
          Create account
        </Link>
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
    <div className="space-y-5">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-full border border-purple-deep/10 bg-white px-4 py-3 text-sm font-medium text-purple-deep transition hover:border-gold/40"
        onClick={() => signIn("google", { callbackUrl })}
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-purple-deep/40">
        <span className="h-px flex-1 bg-purple-deep/10" />
        or email
        <span className="h-px flex-1 bg-purple-deep/10" />
      </div>

      <form
        className="space-y-4"
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
          router.push(callbackUrl);
          router.refresh();
        }}
      >
        <label className="block text-sm">
          <span className="font-medium text-purple-deep/75">Full name</span>
          <input name="name" required className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-purple-deep/75">Email</span>
          <input name="email" type="email" required className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-purple-deep/75">Password</span>
          <input
            name="password"
            type="password"
            minLength={8}
            required
            className="mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/40 px-3 py-2.5"
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="relative inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium tracking-wide text-purple-deep shadow-lg shadow-gold/30 transition hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

export function GoogleSignInButton({
  callbackUrl = "/account",
  compact = false,
}: {
  callbackUrl?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={compact ? "header-login-google header-login-google-compact" : "flex w-full items-center justify-center gap-3 rounded-full border border-purple-deep/10 bg-white px-4 py-3 text-sm"}
      aria-label="Continue with Google"
      onClick={() => signIn("google", { callbackUrl })}
    >
      <GoogleIcon />
      {!compact ? <span>Continue with Google</span> : <span className="hidden xl:inline">Google</span>}
    </button>
  );
}
