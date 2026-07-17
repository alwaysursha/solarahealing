"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { useAdminTheme } from "@/components/admin/AdminThemeProvider";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/course-material", label: "Course Material" },
  { href: "/admin/sessions", label: "Private Sessions" },
  { href: "/admin/workshops", label: "Workshops" },
  { href: "/admin/web", label: "Web Development" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/profile", label: "Profile" },
];

export function AdminSidebar({
  activePath,
  mobileOpen = false,
  onNavigate,
}: {
  activePath: string;
  mobileOpen?: boolean;
  onNavigate?: () => void;
}) {
  const { adminName } = useAdminTheme();

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={["admin-sidebar-backdrop", mobileOpen ? "admin-sidebar-backdrop-open" : ""].join(" ")}
        onClick={onNavigate}
      />

      <aside
        className={[
          "admin-sidebar flex h-dvh w-64 shrink-0 flex-col overflow-y-auto overscroll-y-contain border-r",
          mobileOpen ? "admin-sidebar-open" : "",
        ].join(" ")}
      >
        <div className="admin-sidebar-divider flex items-start justify-between gap-3 border-b px-5 py-6">
          <div>
            <p className="admin-sidebar-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
              Soulara Healing Academy Admin
            </p>
            <p className="admin-sidebar-welcome mt-2">Welcome back, {adminName}.</p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="admin-sidebar-close lg:hidden"
            onClick={onNavigate}
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const active = activePath === link.href || (link.href !== "/admin" && activePath.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className={[
                  "admin-sidebar-link block rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "admin-sidebar-link-active" : "",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-divider space-y-2 border-t px-3 py-4">
          <Link href="/" onClick={onNavigate} className="admin-sidebar-footer-link block rounded-xl px-3 py-2 text-sm">
            View website
          </Link>
          <SignOutButton className="admin-sidebar-footer-button w-full rounded-xl px-3 py-2 text-left text-sm" />
        </div>
      </aside>
    </>
  );
}
