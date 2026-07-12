"use client";

import { useAdminTheme } from "@/components/admin/AdminThemeProvider";

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.5v2M10 15.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M5.4 14.6l1.4-1.4M13.2 6.8l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M15.2 12.4a5.8 5.8 0 0 1-7.6-7.6 6.2 6.2 0 1 0 7.6 7.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminThemeToggle({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        "admin-theme-toggle inline-flex items-center justify-center gap-2 rounded-full border transition-colors",
        compact
          ? "h-10 w-10"
          : "border-purple-deep/12 bg-white/70 px-3.5 py-2 text-purple-deep/70 hover:border-gold/35 hover:text-purple-deep",
        className,
      ].join(" ")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {!compact ? (
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
          {isDark ? "Light" : "Dark"}
        </span>
      ) : null}
    </button>
  );
}
