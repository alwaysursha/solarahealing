"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useId, useState } from "react";

type PanelBorderStarProps = {
  width: number;
  height: number;
  outlinePath: string;
  tracePath: string;
};

const STROKE = {
  linecap: "round" as const,
  linejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

const GOLD_BORDER = {
  ridge1: "#c9a85a",
  ridge2: "#b8922a",
  ridge3: "#8a6d14",
  shade1: "#8a6d14",
  shade2: "#6b5410",
  shade3: "#4a3a0a",
  edge: "rgba(180, 145, 50, 0.55)",
  shadowFlood: "#6b5410",
  highlightFlood: "#c9a85a",
  shimmer: "#ffffff",
} as const;

const PURPLE_BORDER = {
  ridge1: "#7a3d96",
  ridge2: "#5c1470",
  ridge3: "#3f0e52",
  shade1: "#4a1260",
  shade2: "#3a0f4e",
  shade3: "#2a0a3a",
  edge: "rgba(63, 14, 82, 0.55)",
  shadowFlood: "#3f0e52",
  highlightFlood: "#8a5aad",
  shimmer: "transparent",
} as const;

export function PanelBorderStar({
  width,
  height,
  outlinePath,
  tracePath,
}: PanelBorderStarProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ridgeId = `border-ridge-${uid}`;
  const shadowId = `border-shadow-${uid}`;
  const depthFilterId = `border-depth-${uid}`;
  const [purpleBorder, setPurpleBorder] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-brand-theme") === "10",
  );

  useEffect(() => {
    setPurpleBorder(document.documentElement.getAttribute("data-brand-theme") === "10");
  }, []);

  if (!outlinePath || width <= 0 || height <= 0) return null;

  const colors = purpleBorder ? PURPLE_BORDER : GOLD_BORDER;
  const showShimmer = !reduceMotion && Boolean(tracePath) && !purpleBorder;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={ridgeId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.ridge1} stopOpacity="0.95" />
          <stop offset="45%" stopColor={colors.ridge2} stopOpacity="0.92" />
          <stop offset="100%" stopColor={colors.ridge3} stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id={shadowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.shade1} stopOpacity="0.45" />
          <stop offset="50%" stopColor={colors.shade2} stopOpacity="0.38" />
          <stop offset="100%" stopColor={colors.shade3} stopOpacity="0.3" />
        </linearGradient>

        <filter
          id={depthFilterId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0.5"
            dy="1.25"
            stdDeviation={purpleBorder ? "1.8" : "1.4"}
            floodColor={colors.shadowFlood}
            floodOpacity={purpleBorder ? 0.5 : 0.42}
          />
          <feDropShadow
            dx="-0.35"
            dy="-0.3"
            stdDeviation="0"
            floodColor={colors.highlightFlood}
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      <path
        d={outlinePath}
        fill="none"
        stroke={`url(#${shadowId})`}
        strokeWidth="1.65"
        transform="translate(1, 1.25)"
        {...STROKE}
      />

      <path
        d={outlinePath}
        fill="none"
        stroke={colors.edge}
        strokeWidth="1.15"
        transform="translate(-0.35, -0.3)"
        {...STROKE}
      />

      <path
        d={outlinePath}
        fill="none"
        stroke={`url(#${ridgeId})`}
        strokeWidth="1.55"
        filter={`url(#${depthFilterId})`}
        {...STROKE}
      />

      {showShimmer && (
        <path
          d={tracePath}
          fill="none"
          stroke={colors.shimmer}
          strokeWidth="0.9"
          strokeOpacity="0.72"
          pathLength={100}
          className="panel-border-shimmer"
          {...STROKE}
        />
      )}
    </svg>
  );
}
