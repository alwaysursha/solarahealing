"use client";

import Link from "next/link";
import { useId, useState } from "react";

type HeaderLoginPanelProps = {
  onClose: () => void;
};

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

export function HeaderLoginPanel({ onClose }: HeaderLoginPanelProps) {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="header-login-panel relative mt-2.5 w-full">
      <div className="header-login-panel-inner relative overflow-hidden rounded-[1.1rem] border border-gold/25 px-4 py-3.5 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.55)] sm:rounded-[1.25rem] sm:px-5 sm:py-4">
        <div className="header-login-panel-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="header-login-panel-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative z-[1]">
          <form
            className="flex flex-col gap-2.5"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="flex flex-wrap items-end gap-2 sm:gap-3 lg:flex-nowrap lg:gap-4">
              <div className="header-login-intro hidden shrink-0 md:block">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.3em] text-gold/82">
                  Member access
                </p>
                <h2 className="mt-1 font-serif text-[1.15rem] font-normal leading-none tracking-[-0.02em] text-cream lg:text-[1.25rem]">
                  Welcome back
                </h2>
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                  <label htmlFor={emailId} className="header-login-label">
                    Email or ID
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className="header-login-input header-login-input-compact mt-1.5"
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
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-end gap-2">
                <button type="submit" className="header-login-submit header-login-submit-compact shrink-0">
                  <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
                  <span className="relative">Sign in</span>
                </button>
                <button
                  type="button"
                  className="header-login-google header-login-google-compact"
                  aria-label="Continue with Google"
                >
                  <GoogleIcon />
                  <span className="hidden xl:inline">Google</span>
                </button>
              </div>
            </div>

            <div className="header-login-footer flex flex-wrap items-center justify-between gap-x-4 gap-y-1 md:pl-[8.5rem]">
              <Link
                href="/auth/sign-in"
                className="text-[0.68rem] font-medium text-gold/86 transition-colors hover:text-gold-light"
                onClick={onClose}
              >
                Forgot your password?
              </Link>
              <p className="text-[0.68rem] text-cream/52">
                New here?{" "}
                <Link
                  href="/auth/sign-up"
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
