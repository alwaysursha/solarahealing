"use client";

import { useState } from "react";
import { AdminAdvancedImageEditor, type AdvancedEditorAspect } from "@/components/admin/AdminAdvancedImageEditor";
import { AdminMediaUploader } from "@/components/admin/AdminMediaUploader";

type AdminCatalogImageFieldProps = {
  imageName?: string;
  altName?: string;
  defaultImage?: string;
  defaultAlt?: string;
  folder?: "hero" | "about" | "general";
  aspect?: AdvancedEditorAspect;
  /** Controlled mode for React state forms (hero manager). */
  value?: string;
  altValue?: string;
  onChange?: (url: string) => void;
  onAltChange?: (alt: string) => void;
  showAltField?: boolean;
  includeFocusHiddenInputs?: boolean;
  label?: string;
};

async function uploadEditedBlob(blob: Blob, folder: "hero" | "about" | "general") {
  const file = new File([blob], `edited-${Date.now()}.jpg`, { type: "image/jpeg" });
  const body = new FormData();
  body.set("file", file);
  body.set("folder", folder);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !payload.url) {
    throw new Error(payload.error || "Upload failed");
  }
  return payload.url;
}

export function AdminCatalogImageField({
  imageName = "image",
  altName = "imageAlt",
  defaultImage = "",
  defaultAlt = "",
  folder = "general",
  aspect = "16:10",
  value,
  altValue,
  onChange,
  onAltChange,
  showAltField = true,
  includeFocusHiddenInputs = true,
  label = "Course image",
}: AdminCatalogImageFieldProps) {
  const controlled = typeof onChange === "function";
  const [internalImage, setInternalImage] = useState(defaultImage);
  const [internalAlt, setInternalAlt] = useState(defaultAlt);
  const [editorOpen, setEditorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const image = controlled ? (value ?? "") : internalImage;
  const alt = controlled ? (altValue ?? "") : internalAlt;

  const setImage = (next: string) => {
    if (controlled) onChange?.(next);
    else setInternalImage(next);
  };

  const setAlt = (next: string) => {
    if (controlled) onAltChange?.(next);
    else setInternalAlt(next);
  };

  return (
    <div className="admin-catalog-image-field space-y-3 lg:col-span-2">
      {!controlled ? <input type="hidden" name={imageName} value={image} /> : null}
      {includeFocusHiddenInputs ? (
        <>
          <input type="hidden" name="imageFocusX" value="50" />
          <input type="hidden" name="imageFocusY" value="50" />
        </>
      ) : null}

      <AdminMediaUploader label={label} folder={folder} value={image} onChange={setImage} />

      {image ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-panel)] px-3.5 py-1.5 text-xs font-semibold text-[var(--admin-text)] transition hover:border-[var(--admin-accent)]"
            onClick={() => {
              setError(null);
              setEditorOpen(true);
            }}
          >
            Open advanced editor
          </button>
          <p className="text-xs text-[var(--admin-text-muted)]">
            Crop, zoom, rotate, and adjust color before saving.
          </p>
        </div>
      ) : null}

      {showAltField ? (
        <label className="admin-field block text-sm">
          <span className="admin-field-label mb-1.5 block font-medium">Image alt</span>
          <input
            className="admin-field-input w-full rounded-xl px-3 py-2 text-sm"
            name={controlled ? undefined : altName}
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Describe the image for accessibility"
          />
        </label>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <AdminAdvancedImageEditor
        open={editorOpen}
        imageSrc={image}
        title={label}
        initialAspect={aspect}
        onClose={() => setEditorOpen(false)}
        onSave={async (blob) => {
          try {
            const url = await uploadEditedBlob(blob, folder);
            setImage(url);
            setError(null);
          } catch (err) {
            const message = err instanceof Error ? err.message : "Could not upload edited image";
            setError(message);
            throw err;
          }
        }}
      />
    </div>
  );
}
