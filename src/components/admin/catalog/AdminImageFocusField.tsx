"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
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

export function AdminImageFocusField({
  imageUrl,
  imageAlt,
  defaultFocusX = 50,
  defaultFocusY = 50,
}: {
  imageUrl: string;
  imageAlt?: string;
  defaultFocusX?: number;
  defaultFocusY?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [focusX, setFocusX] = useState(clampImageFocus(defaultFocusX));
  const [focusY, setFocusY] = useState(clampImageFocus(defaultFocusY));

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const next = readPointFromEvent(frame, clientX, clientY);
    setFocusX(next.x);
    setFocusY(next.y);
  }, []);

  return (
    <div className="admin-image-focus lg:col-span-2">
      <input type="hidden" name="imageFocusX" value={focusX} />
      <input type="hidden" name="imageFocusY" value={focusY} />

      <p className="admin-field-label text-sm font-medium">Image focus point</p>
      <p className="admin-catalog-card-copy mt-1 text-xs leading-relaxed">
        Click or drag on the preview to set the center for storefront display. Save to apply.
      </p>

      {imageUrl ? (
        <div
          ref={frameRef}
          className="admin-image-focus-frame relative mt-3 aspect-[16/10] cursor-crosshair overflow-hidden rounded-[1rem] border select-none"
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
            sizes="640px"
            className="pointer-events-none object-cover"
            style={{ objectPosition: `${focusX}% ${focusY}%` }}
            draggable={false}
          />
          <div
            className="admin-image-focus-crosshair pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{ left: `${focusX}%`, top: `${focusY}%` }}
            aria-hidden
          />
        </div>
      ) : (
        <div className="admin-image-focus-empty mt-3 rounded-[1rem] border border-dashed px-4 py-8 text-center text-sm">
          Add an image URL above to adjust the focus point.
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
            onChange={(event) => setFocusX(Number(event.target.value))}
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
            onChange={(event) => setFocusY(Number(event.target.value))}
            className="admin-image-focus-range mt-2 w-full"
          />
        </label>
      </div>
    </div>
  );
}
