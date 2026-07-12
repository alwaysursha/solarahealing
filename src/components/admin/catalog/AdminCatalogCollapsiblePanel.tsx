"use client";

import { useState, type ReactNode } from "react";

export function AdminCatalogCollapsiblePanel({
  label,
  openLabel,
  summary,
  children,
  className = "",
  summaryClassName = "",
}: {
  label?: string;
  openLabel?: string;
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={["admin-catalog-details mt-5", open ? "admin-catalog-details-open" : "", className].join(" ")}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={[
          summary
            ? "admin-catalog-create-summary flex w-full cursor-pointer items-center justify-between gap-4 text-left"
            : "admin-catalog-details-summary flex w-full items-center justify-between gap-3 text-left text-[0.72rem] font-semibold uppercase tracking-[0.16em]",
          summaryClassName,
        ].join(" ")}
      >
        {summary ? (
          <>
            <div className="min-w-0 flex-1">{summary}</div>
            <span className="admin-catalog-create-toggle" aria-hidden />
          </>
        ) : (
          <>
            <span>{open ? (openLabel ?? label) : label}</span>
            <span className="admin-catalog-details-chevron shrink-0" aria-hidden />
          </>
        )}
      </button>
      {open ? <div className="admin-catalog-details-body">{children}</div> : null}
    </div>
  );
}
