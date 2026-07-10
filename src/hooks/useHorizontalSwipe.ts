"use client";

import { useCallback, useRef, type PointerEventHandler } from "react";

type UseHorizontalSwipeOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enabled?: boolean;
  threshold?: number;
};

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("button, a, input, textarea, select, label, [role='tab']"));
}

/** Detect horizontal swipes without blocking vertical scroll (pan-y). */
export function useHorizontalSwipe({
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
  threshold = 50,
}: UseHorizontalSwipeOptions) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    startRef.current = null;
  }, []);

  const onPointerDown: PointerEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (!enabled || isInteractiveTarget(event.target)) return;
      startRef.current = { x: event.clientX, y: event.clientY };
    },
    [enabled],
  );

  const onPointerUp: PointerEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (!enabled || !startRef.current) return;

      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;
      reset();

      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    },
    [enabled, onSwipeLeft, onSwipeRight, reset, threshold],
  );

  return {
    onPointerDown,
    onPointerUp,
    onPointerCancel: reset,
    className: "touch-pan-y",
  };
}
