"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { clampImageFocus } from "@/lib/image-focus";

function readPointFromEvent(element: HTMLElement, clientX: number, clientY: number) {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 50, y: 50 };
  }

  return {
    x: clampImageFocus(((clientX - rect.left) / rect.width) * 100),
    y: clampImageFocus(((clientY - rect.top) / rect.height) * 100),
  };
}

type AdminImageFocusFieldProps = {
  imageUrl: string;
  imageAlt?: string;
  defaultFocusX?: number;
  defaultFocusY?: number;
  /** Controlled focus (admin state editors). */
  focusX?: number;
  focusY?: number;
  onFocusChange?: (focusX: number, focusY: number) => void;
  /** Tailwind aspect class for the crop preview frame. */
  aspectClassName?: string;
  label?: string;
  helpText?: string;
  /** When false, skip hidden form inputs (for controlled React state saves). */
  includeFormInputs?: boolean;
};

export function AdminImageFocusField({
  imageUrl,
  imageAlt,
  defaultFocusX = 50,
  defaultFocusY = 50,
  focusX: controlledFocusX,
  focusY: controlledFocusY,
  onFocusChange,
  aspectClassName = "aspect-[16/10]",
  label = "Image focus point",
  helpText = "Click or drag on the preview to set the center for storefront display. Save to apply.",
  includeFormInputs = true,
}: AdminImageFocusFieldProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const isControlled = typeof onFocusChange === "function";
  const [internalFocusX, setInternalFocusX] = useState(clampImageFocus(defaultFocusX));
  const [internalFocusY, setInternalFocusY] = useState(clampImageFocus(defaultFocusY));

  const focusX = clampImageFocus(isControlled ? (controlledFocusX ?? defaultFocusX) : internalFocusX);
  const focusY = clampImageFocus(isControlled ? (controlledFocusY ?? defaultFocusY) : internalFocusY);

  useEffect(() => {
    if (isControlled) return;
    setInternalFocusX(clampImageFocus(defaultFocusX));
    setInternalFocusY(clampImageFocus(defaultFocusY));
  }, [defaultFocusX, defaultFocusY, isControlled, imageUrl]);

  const setFocus = useCallback(
    (nextX: number, nextY: number) => {
      const x = clampImageFocus(nextX);
      const y = clampImageFocus(nextY);
      if (isControlled) {
        onFocusChange?.(x, y);
        return;
      }
      setInternalFocusX(x);
      setInternalFocusY(y);
    },
    [isControlled, onFocusChange],
  );

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const frame = frameRef.current;
      if (!frame) return;
      const next = readPointFromEvent(frame, clientX, clientY);
      setFocus(next.x, next.y);
    },
    [setFocus],
  );

  return (
    <div className="admin-image-focus lg:col-span-2">
      {includeFormInputs ? (
        <>
          <input type="hidden" name="imageFocusX" value={focusX} />
          <input type="hidden" name="imageFocusY" value={focusY} />
        </>
      ) : null}

      <p className="admin-field-label text-sm font-medium">{label}</p>
      <p className="admin-catalog-card-copy mt-1 text-xs leading-relaxed">{helpText}</p>

      {imageUrl ? (
        <div
          ref={frameRef}
          className={[
            "admin-image-focus-frame relative mt-3 cursor-crosshair overflow-hidden rounded-[1rem] border select-none",
            aspectClassName,
          ].join(" ")}
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return;
            updateFromPointer(event.clientX, event.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt || "Image focus preview"}
            fill
            unoptimized
            sizes="960px"
            className="pointer-events-none object-cover"
            style={{ objectPosition: `${focusX}% ${focusY}%` }}
            draggable={false}
          />
          <div
            className="admin-image-focus-crosshair pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{ left: `${focusX}%`, top: `${focusY}%` }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-3 py-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/90">
              Drag to reframe · {focusX}% {focusY}%
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-image-focus-empty mt-3 rounded-[1rem] border border-dashed px-4 py-8 text-center text-sm">
          Add an image above to adjust the focus point.
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="admin-field block text-sm">
          <span className="admin-field-label font-medium">Horizontal ({focusX}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={focusX}
            onChange={(event) => setFocus(Number(event.target.value), focusY)}
            className="admin-image-focus-range mt-2 w-full"
          />
        </label>
        <label className="admin-field block text-sm">
          <span className="admin-field-label font-medium">Vertical ({focusY}%)</span>
          <input
            type="range"
            min={0}
            max={100}
            value={focusY}
            onChange={(event) => setFocus(focusX, Number(event.target.value))}
            className="admin-image-focus-range mt-2 w-full"
          />
        </label>
      </div>
    </div>
  );
}
