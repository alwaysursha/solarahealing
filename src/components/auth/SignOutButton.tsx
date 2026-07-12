"use client";

import { signOut } from "next-auth/react";
import { useState, type ReactNode } from "react";

type SignOutButtonProps = {
  className?: string;
  children?: ReactNode;
  callbackUrl?: string;
};

/** Clears the Auth.js session cookie via the client sign-out endpoint, then redirects. */
export function SignOutButton({
  className,
  children = "Sign out",
  callbackUrl = "/",
}: SignOutButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signOut({ callbackUrl });
      }}
    >
      {pending ? "Signing out…" : children}
    </button>
  );
}
