"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";
import { getFirstName } from "@/lib/auth-utils";

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

function DashboardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M4.5 4.5h4.25v4.25H4.5V4.5ZM11.25 4.5H15.5v4.25h-4.25V4.5ZM4.5 11.25h4.25V15.5H4.5v-4.25ZM11.25 11.25H15.5V15.5h-4.25v-4.25Z"
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
  const { data: session, update } = useSession();

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
  const isAdmin = session.user.role === Role.ADMIN;

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

          {isAdmin ? null : (
            <div className="header-account-nav">
              <Link href="/account" className="header-account-nav-item" onClick={onClose}>
                <ProfileIcon />
                <span>Profile</span>
              </Link>
              <Link href="/account#orders" className="header-account-nav-item" onClick={onClose}>
                <OrdersIcon />
                <span>Past Orders</span>
              </Link>
            </div>
          )}

          <div className="header-account-actions">
            {isAdmin ? (
              <Link href="/admin" className="header-account-primary" onClick={onClose}>
                <DashboardIcon />
                <span>View Dashboard</span>
              </Link>
            ) : (
              <Link href="/courses" className="header-account-primary" onClick={onClose}>
                <CalendarIcon />
                <span>Browse Courses</span>
              </Link>
            )}
            <button type="button" className="header-account-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
