"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getEditedImageBlob, type ImageAdjustments } from "@/lib/admin/crop-image";
import { resolveEditableImageSrc } from "@/lib/admin/editable-image";

export type AdvancedEditorAspect = "free" | "1:1" | "4:3" | "16:9" | "16:10" | "21:9";

const ASPECT_OPTIONS: { id: AdvancedEditorAspect; label: string; value: number | undefined }[] = [
  { id: "free", label: "Free", value: undefined },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "16:10", label: "16:10", value: 16 / 10 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "21:9", label: "21:9", value: 21 / 9 },
];

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
};

type AdminAdvancedImageEditorProps = {
  open: boolean;
  imageSrc: string;
  title?: string;
  initialAspect?: AdvancedEditorAspect;
  onClose: () => void;
  onSave: (blob: Blob) => Promise<void> | void;
};

export function AdminAdvancedImageEditor({
  open,
  imageSrc,
  title = "Edit image",
  initialAspect = "16:10",
  onClose,
  onSave,
}: AdminAdvancedImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectId, setAspectId] = useState<AdvancedEditorAspect>(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editableSrc, setEditableSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const aspect = ASPECT_OPTIONS.find((option) => option.id === aspectId)?.value;

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    setLoading(true);
    setError(null);
    setEditableSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspectId(initialAspect);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setCroppedAreaPixels(null);

    void (async () => {
      try {
        const resolved = await resolveEditableImageSrc(imageSrc);
        if (cancelled) {
          if (resolved.startsWith("blob:")) URL.revokeObjectURL(resolved);
          return;
        }
        objectUrl = resolved.startsWith("blob:") ? resolved : null;
        setEditableSrc(resolved);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load image for editing.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [open, imageSrc, initialAspect]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleClose = () => {
    if (editableSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(editableSrc);
    }
    setEditableSrc(null);
    onClose();
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !editableSrc) return;
    setSaving(true);
    setError(null);
    try {
      const blob = await getEditedImageBlob({
        imageSrc: editableSrc,
        pixelCrop: croppedAreaPixels,
        rotation,
        adjustments,
      });
      await onSave(blob);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save edits. Try uploading the image first, then edit.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="admin-image-editor-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-image-editor-panel">
        <div className="admin-image-editor-header">
          <div>
            <p className="admin-image-editor-eyebrow">Advanced photo editor</p>
            <h3 className="admin-image-editor-title">{title}</h3>
          </div>
          <button type="button" className="admin-image-editor-ghost" onClick={handleClose} disabled={saving}>
            Close
          </button>
        </div>

        <div className="admin-image-editor-stage">
          {loading ? (
            <div className="admin-image-editor-status">Preparing image for editing…</div>
          ) : editableSrc ? (
            <div
              className="admin-image-editor-crop"
              style={{
                filter: [
                  `brightness(${adjustments.brightness}%)`,
                  `contrast(${adjustments.contrast}%)`,
                  `saturate(${adjustments.saturate}%)`,
                ].join(" "),
              }}
            >
              <Cropper
                image={editableSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                objectFit="contain"
                showGrid
              />
            </div>
          ) : (
            <div className="admin-image-editor-status">
              {error || "Could not load image for editing."}
            </div>
          )}
        </div>

        <div className="admin-image-editor-controls">
          <div className="admin-image-editor-aspects" role="group" aria-label="Aspect ratio">
            {ASPECT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={[
                  "admin-image-editor-chip",
                  aspectId === option.id ? "admin-image-editor-chip-active" : "",
                ].join(" ")}
                onClick={() => setAspectId(option.id)}
                disabled={!editableSrc || saving}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="admin-image-editor-slider">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              disabled={!editableSrc || saving}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </label>

          <label className="admin-image-editor-slider">
            <span>Rotate</span>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              disabled={!editableSrc || saving}
              onChange={(event) => setRotation(Number(event.target.value))}
            />
          </label>

          <label className="admin-image-editor-slider">
            <span>Brightness</span>
            <input
              type="range"
              min={60}
              max={140}
              step={1}
              value={adjustments.brightness}
              disabled={!editableSrc || saving}
              onChange={(event) =>
                setAdjustments((prev) => ({ ...prev, brightness: Number(event.target.value) }))
              }
            />
          </label>

          <label className="admin-image-editor-slider">
            <span>Contrast</span>
            <input
              type="range"
              min={60}
              max={140}
              step={1}
              value={adjustments.contrast}
              disabled={!editableSrc || saving}
              onChange={(event) =>
                setAdjustments((prev) => ({ ...prev, contrast: Number(event.target.value) }))
              }
            />
          </label>

          <label className="admin-image-editor-slider">
            <span>Saturation</span>
            <input
              type="range"
              min={0}
              max={180}
              step={1}
              value={adjustments.saturate}
              disabled={!editableSrc || saving}
              onChange={(event) =>
                setAdjustments((prev) => ({ ...prev, saturate: Number(event.target.value) }))
              }
            />
          </label>

          <div className="admin-image-editor-flip-row">
            <button
              type="button"
              className="admin-image-editor-chip"
              disabled={!editableSrc || saving}
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setAdjustments(DEFAULT_ADJUSTMENTS);
                setCrop({ x: 0, y: 0 });
              }}
            >
              Reset
            </button>
          </div>

          {error ? <p className="admin-image-editor-error">{error}</p> : null}

          <div className="admin-image-editor-actions">
            <button type="button" className="admin-image-editor-ghost" onClick={handleClose} disabled={saving}>
              Cancel
            </button>
            <button
              type="button"
              className="admin-image-editor-primary"
              onClick={() => void handleSave()}
              disabled={saving || loading || !editableSrc || !croppedAreaPixels}
            >
              {saving ? "Saving…" : "Apply & upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
