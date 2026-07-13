import type { ReactNode } from "react";
import { MandalaPattern } from "@/components/shell/MandalaPattern";

type SpiritualSurfaceProps = {
  children: ReactNode;
  className?: string;
  animationsPaused?: boolean;
};

/**
 * Shared spiritual panel used by header and footer.
 * Textures hide automatically for Option 8 via [data-brand-theme="8"] CSS.
 */
export function SpiritualSurface({
  children,
  className = "",
  animationsPaused = false,
}: SpiritualSurfaceProps) {
  return (
    <div
      className={`relative overflow-hidden bg-spiritual-gradient text-white${animationsPaused ? " animations-paused" : ""} ${className}`}
    >
      <div className="spiritual-fx pointer-events-none absolute inset-0 bg-spiritual-mesh" aria-hidden />
      <div className="spiritual-fx pointer-events-none absolute inset-0 bg-spiritual-shimmer" aria-hidden />
      <div
        className="spiritual-fx pointer-events-none absolute inset-0 bg-spiritual-shimmer-secondary"
        aria-hidden
      />
      <div className="spiritual-fx absolute inset-0" aria-hidden>
        <MandalaPattern />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
