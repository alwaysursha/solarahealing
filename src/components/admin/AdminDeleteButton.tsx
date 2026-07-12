"use client";

import { useRef, useState, useTransition } from "react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M4.5 6.5h11M8 6.5V5.2c0-.66.54-1.2 1.2-1.2h1.6c.66 0 1.2.54 1.2 1.2V6.5M7.5 9.2v5.1M12.5 9.2v5.1M6.2 6.5l.5 9.3c0 .66.54 1.2 1.2 1.2h4.2c.66 0 1.2-.54 1.2-1.2l.5-9.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminDeleteButton({
  action,
  hiddenFields,
  itemName,
  title,
  description,
  label = "Delete",
  confirmLabel,
  variant = "button",
  className = "",
}: {
  action: (formData: FormData) => Promise<void>;
  hiddenFields: Record<string, string>;
  itemName: string;
  title?: string;
  description?: string;
  label?: string;
  confirmLabel?: string;
  variant?: "button" | "icon";
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const resolvedTitle = title ?? `Delete ${itemName}?`;
  const resolvedDescription =
    description ??
    `This will permanently remove “${itemName}”. This action cannot be undone.`;
  const resolvedConfirmLabel = confirmLabel ?? `Delete ${itemName}`;

  const handleConfirm = () => {
    startTransition(async () => {
      formRef.current?.requestSubmit();
      setOpen(false);
    });
  };

  return (
    <>
      <form ref={formRef} action={action} className="hidden" aria-hidden>
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      </form>

      {variant === "icon" ? (
        <button
          type="button"
          aria-label={`Delete ${itemName}`}
          onClick={() => setOpen(true)}
          className={[
            "admin-delete-icon inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
            className,
          ].join(" ")}
        >
          <TrashIcon />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={["admin-catalog-delete inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold", className].join(" ")}
        >
          <TrashIcon />
          {label}
        </button>
      )}

      <AdminConfirmDialog
        open={open}
        eyebrow="Confirm deletion"
        title={resolvedTitle}
        description={resolvedDescription}
        confirmLabel={resolvedConfirmLabel}
        pendingLabel="Deleting…"
        isPending={isPending}
        tone="danger"
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
