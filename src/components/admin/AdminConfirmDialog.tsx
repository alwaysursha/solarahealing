"use client";

type AdminConfirmDialogProps = {
  open: boolean;
  eyebrow: string;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  pendingLabel?: string;
  isPending?: boolean;
  tone?: "default" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminConfirmDialog({
  open,
  eyebrow,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel,
  pendingLabel = "Working…",
  isPending = false,
  tone = "default",
  onCancel,
  onConfirm,
}: AdminConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="admin-confirm-root fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation"
        className="admin-confirm-backdrop absolute inset-0"
        onClick={onCancel}
      />
      <div
        className="admin-confirm-panel relative w-full max-w-md overflow-hidden rounded-[1.5rem] p-7 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-confirm-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-[1]">
          <p className="admin-confirm-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">{eyebrow}</p>
          <h3 className="admin-confirm-title mt-3 font-serif text-[1.75rem] leading-tight">{title}</h3>
          <p className="admin-confirm-copy mt-3 text-sm leading-relaxed">{description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={onCancel} className="admin-confirm-cancel rounded-full px-5 py-2.5 text-sm font-semibold">
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className={[
                "admin-confirm-action rounded-full px-5 py-2.5 text-sm font-semibold",
                tone === "danger" ? "admin-confirm-action-danger" : "",
              ].join(" ")}
            >
              {isPending ? pendingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
