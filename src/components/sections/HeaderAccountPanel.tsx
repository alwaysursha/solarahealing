"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getFirstName } from "@/lib/auth-utils";
import { HeaderCartPanel } from "@/components/sections/HeaderCartPanel";

type HeaderAccountPanelProps = {
  onClose: () => void;
  onLoggedOut?: () => void;
};

function ProfileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M10 10.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M4.75 16.75c.95-2.45 3.05-3.75 5.25-3.75s4.3 1.3 5.25 3.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5.5 4.5h11l-1.2 9.5H6.7L5.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8 8.25h5.5M8 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CartNavIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5.25 5.5h11.5l-1.05 7.25H6.3L5.25 5.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8 4.25v1.25M12 4.25v1.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M5.5 7.25V5.75c0-.97.78-1.75 1.75-1.75h5.5c.97 0 1.75.78 1.75 1.75v1.5M4.75 8.25h11v7c0 .97-.78 1.75-1.75 1.75h-7.5A1.75 1.75 0 0 1 4.75 15.25v-7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
      <path
        d="M4 6.25 8 10.25 12 6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeaderUserGreeting({
  firstName,
  expanded = false,
}: {
  firstName: string;
  expanded?: boolean;
}) {
  return (
    <span className="header-user-greeting">
      <span className="header-user-greeting-row">
        <span className="header-user-greeting-text">
          <span className="header-user-greeting-hello">Hello,</span>
          <span className="header-user-greeting-name">{firstName}</span>
        </span>
        <span
          className={[
            "header-user-greeting-chevron",
            expanded ? "header-user-greeting-chevron-open" : "",
          ].join(" ")}
          aria-hidden
        >
          <ChevronDownIcon />
        </span>
      </span>
    </span>
  );
}

export function HeaderAccountPanel({ onClose, onLoggedOut }: HeaderAccountPanelProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { data: session, update } = useSession();
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    onClose();
    await signOut({ redirect: false });
    await update();
    router.refresh();
    onLoggedOut?.();
  }, [onClose, onLoggedOut, router, update]);

  if (!session?.user) {
    return null;
  }

  const firstName = getFirstName(session.user.name);
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="header-account-panel relative mt-2.5 w-full">
      <div className="header-account-panel-inner relative overflow-hidden rounded-[1.15rem] border border-gold/20 px-4 py-4 sm:rounded-[1.35rem] sm:px-5 sm:py-4">
        <div className="header-account-panel-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="header-account-panel-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="header-account-panel-layout relative z-[1]">
          <div className="header-account-identity">
            <div className="header-account-avatar" aria-hidden>
              {initial}
            </div>
            <div className="min-w-0">
              <p className="header-account-eyebrow">Your sanctuary</p>
              <h2 className="header-account-welcome">
                <span>Hello,</span> {firstName}
              </h2>
              <p className="header-account-email truncate">{session.user.email}</p>
            </div>
          </div>

          <div className="header-account-nav">
            <Link href="/account" className="header-account-nav-item" onClick={onClose}>
              <ProfileIcon />
              <span>Profile</span>
            </Link>
            <Link href="/account#orders" className="header-account-nav-item" onClick={onClose}>
              <OrdersIcon />
              <span>Past Orders</span>
            </Link>
            <button
              type="button"
              className={[
                "header-account-nav-item",
                cartOpen ? "header-account-nav-item-active" : "",
              ].join(" ")}
              aria-expanded={cartOpen}
              onClick={() => setCartOpen((open) => !open)}
            >
              <CartNavIcon />
              <span>Cart</span>
            </button>
          </div>

          <div className="header-account-actions">
            <Link href="/checkout" className="header-account-primary" onClick={onClose}>
              <CalendarIcon />
              <span>Book a Session</span>
            </Link>
            <button type="button" className="header-account-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>

          <AnimatePresence initial={false}>
            {cartOpen ? (
              <motion.div
                key="account-cart-embed"
                className="header-account-cart-wrap"
                initial={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                animate={reduceMotion ? undefined : { opacity: 1, height: "auto" }}
                exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
              >
                <HeaderCartPanel embedded onClose={onClose} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
