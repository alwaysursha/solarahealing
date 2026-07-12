"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function getPendingLabel(label: string) {
  if (label.startsWith("Create")) return "Creating…";
  if (label.startsWith("Update")) return "Updating…";
  if (label.startsWith("Save")) return "Saving…";
  return "Saving…";
}

export function AdminSubmit({
  label = "Save changes",
  pendingLabel,
  savedLabel = "Saved",
}: {
  label?: string;
  pendingLabel?: string;
  savedLabel?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);
  const [saved, setSaved] = useState(false);
  const resolvedPendingLabel = pendingLabel ?? getPendingLabel(label);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      setSaved(false);
      return;
    }

    if (wasPending.current) {
      wasPending.current = false;
      setSaved(true);
      const timer = window.setTimeout(() => setSaved(false), 2600);
      return () => window.clearTimeout(timer);
    }
  }, [pending]);

  let text = label;
  if (pending) text = resolvedPendingLabel;
  else if (saved) text = savedLabel;

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "admin-submit rounded-full px-5 py-2.5 text-sm font-semibold transition",
        pending ? "admin-submit-pending" : "",
        saved ? "admin-submit-saved" : "",
      ].join(" ")}
    >
      {text}
    </button>
  );
}
