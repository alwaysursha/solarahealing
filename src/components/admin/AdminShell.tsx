"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSubmit } from "@/components/admin/AdminSubmit";
import { useAdminTheme } from "@/components/admin/AdminThemeProvider";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export { AdminSubmit };

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AdminShell({
  activePath,
  title,
  description,
  children,
}: {
  activePath: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { theme } = useAdminTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activePath]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="admin-root flex h-dvh min-h-0 overflow-hidden" data-admin-theme={theme}>
      <AdminSidebar
        activePath={activePath}
        mobileOpen={mobileNavOpen}
        onNavigate={() => setMobileNavOpen(false)}
      />

      <div className="admin-shell-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="admin-shell-header shrink-0 backdrop-blur-xl">
          <div className="admin-shell-header-inner flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <button
                type="button"
                className="admin-mobile-menu-button mt-0.5 lg:hidden"
                aria-label="Open navigation"
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen(true)}
              >
                <MenuIcon />
              </button>
              <div className="min-w-0">
                <p className="admin-shell-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
                  Soulara Healing Academy Admin
                </p>
                <h2 className="admin-shell-title mt-2 font-serif leading-tight tracking-[-0.02em]">{title}</h2>
                {description ? (
                  <p className="admin-shell-description mt-2 max-w-3xl text-sm leading-relaxed">{description}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-0.5 flex shrink-0 items-center gap-2">
              <AdminThemeToggle compact className="sm:hidden" />
              <div className="hidden sm:block">
                <AdminThemeToggle />
              </div>
            </div>
          </div>
        </header>
        <main className="admin-shell-main min-h-0 flex-1 overflow-y-auto overscroll-y-contain">{children}</main>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="admin-stat-card rounded-2xl p-5 shadow-sm">
      <p className="admin-stat-label text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="admin-stat-value mt-3 font-serif text-3xl">{value}</p>
    </div>
  );
}

export function AdminStatGrid({ stats }: { stats: Record<string, string | number> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(stats).map(([label, value]) => (
        <StatCard key={label} label={label} value={value} />
      ))}
    </div>
  );
}

export function AdminPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel rounded-2xl p-5 shadow-sm sm:p-6">
      <h3 className="admin-panel-title font-serif text-xl">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function AdminField({
  label,
  name,
  defaultValue,
  type = "text",
  rows,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  rows?: number;
  placeholder?: string;
}) {
  const className = "admin-field-input mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none";

  return (
    <label className="admin-field block text-sm">
      <span className="admin-field-label font-medium">{label}</span>
      {rows ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={rows}
          placeholder={placeholder}
          className={className}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

export function AdminSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="admin-field block text-sm">
      <span className="admin-field-label font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="admin-field-input mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
