"use client";

import { useRef, useState, useTransition } from "react";
import { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES } from "@/lib/media-limits";

type AdminMediaUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: "hero" | "about" | "general";
  label?: string;
};

async function compressImage(file: File, maxWidth: number): Promise<File> {
  if (!file.type.startsWith("image/") || typeof createImageBitmap === "undefined") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.82),
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export function AdminMediaUploader({
  value,
  onChange,
  folder = "general",
  label = "Image",
}: AdminMediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);

    startTransition(async () => {
      try {
        if (!MEDIA_ALLOWED_TYPES.has(file.type)) {
          throw new Error("Only JPEG, PNG, and WebP images are allowed.");
        }

        const maxWidth = folder === "hero" ? 1920 : 1400;
        let prepared = await compressImage(file, maxWidth);
        if (prepared.size > MEDIA_MAX_BYTES) {
          prepared = await compressImage(file, Math.round(maxWidth * 0.75));
        }
        if (prepared.size > MEDIA_MAX_BYTES) {
          throw new Error("Image must be 2 MB or smaller after compression.");
        }

        const body = new FormData();
        body.set("file", prepared);
        body.set("folder", folder);
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const payload = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Upload failed");
        }
        onChange(payload.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--admin-text)]">{label}</p>
        <button
          type="button"
          className="rounded-full border border-[var(--admin-border)] px-3 py-1.5 text-xs font-medium text-[var(--admin-text)]"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? "Uploading…" : "Upload image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </div>

      <div
        className="rounded-2xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-input-bg)] px-4 py-6 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onFile(event.dataTransfer.files?.[0]);
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="mx-auto max-h-48 rounded-xl object-cover" />
        ) : (
          <p className="text-sm text-[var(--admin-text-muted)]">
            Drag & drop, or use Upload. Max 2 MB (free-tier safe).
          </p>
        )}
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Or paste an image URL"
        className="admin-field-input w-full rounded-xl px-3 py-2 text-sm"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
