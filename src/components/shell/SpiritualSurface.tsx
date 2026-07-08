import type { ReactNode } from "react";
import { MandalaPattern } from "./MandalaPattern";

type SpiritualSurfaceProps = {
  children: ReactNode;
  className?: string;
  animationsPaused?: boolean;
};

export function SpiritualSurface({
  children,
  className = "",
  animationsPaused = false,
}: SpiritualSurfaceProps) {
  return (
    <div
      className={`relative overflow-hidden bg-spiritual-gradient${animationsPaused ? " animations-paused" : ""} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-spiritual-mesh" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-spiritual-shimmer" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-spiritual-shimmer-secondary"
        aria-hidden
      />
      <MandalaPattern />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
