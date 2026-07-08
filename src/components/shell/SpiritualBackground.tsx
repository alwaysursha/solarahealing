"use client";

import { useReducedMotion } from "framer-motion";
import { usePageVisible } from "@/hooks/useAnimationsActive";
import { MandalaPattern } from "./MandalaPattern";
import { FloatingChakras } from "./FloatingChakras";

export function SpiritualBackground() {
  const reduceMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const animationsActive = pageVisible && !reduceMotion;

  return (
    <div
      className={`absolute inset-0 bg-spiritual-gradient${animationsActive ? "" : " animations-paused"}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-spiritual-mesh" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-spiritual-shimmer" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-spiritual-shimmer-secondary" aria-hidden />
      <MandalaPattern />
      <FloatingChakras animationsActive={animationsActive} />
    </div>
  );
}
