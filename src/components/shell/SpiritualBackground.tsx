"use client";

import { useReducedMotion } from "framer-motion";
import { FloatingChakras } from "@/components/shell/FloatingChakras";
import { MandalaPattern } from "@/components/shell/MandalaPattern";
import { usePageVisible } from "@/hooks/useAnimationsActive";

/**
 * Full-bleed spiritual atmosphere for the storefront shell.
 * Textures/chakras hide automatically for Option 8 via [data-brand-theme="8"] CSS.
 */
export function SpiritualBackground() {
  const reduceMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const animationsActive = Boolean(pageVisible && !reduceMotion);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden${animationsActive ? "" : " animations-paused"}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-spiritual-gradient" />
      <div className="spiritual-fx absolute inset-0 bg-spiritual-mesh" />
      <div className="spiritual-fx absolute inset-0 bg-spiritual-shimmer" />
      <div className="spiritual-fx absolute inset-0 bg-spiritual-shimmer-secondary" />
      <div className="spiritual-fx absolute inset-0">
        <MandalaPattern />
      </div>
      <div className="spiritual-fx absolute inset-0">
        <FloatingChakras animationsActive={animationsActive} />
      </div>
    </div>
  );
}
