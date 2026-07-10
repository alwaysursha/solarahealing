"use client";

import { useReducedMotion } from "framer-motion";
import { useId } from "react";

type PanelBorderStarProps = {
  width: number;
  height: number;
  outlinePath: string;
  tracePath: string;
  /** Skip heavy SVG filters on Chrome mobile — shimmer stays enabled. */
  liteFilters?: boolean;
};

const STROKE = {
  linecap: "round" as const,
  linejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

export function PanelBorderStar({
  width,
  height,
  outlinePath,
  tracePath,
  liteFilters = false,
}: PanelBorderStarProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const ridgeId = `border-ridge-${uid}`;
  const shadowId = `border-shadow-${uid}`;
  const depthFilterId = `border-depth-${uid}`;

  if (!outlinePath || width <= 0 || height <= 0) return null;

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
          <stop offset="0%" stopColor="#c9a85a" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#b8922a" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#8a6d14" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id={shadowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6d14" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#6b5410" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#4a3a0a" stopOpacity="0.3" />
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
            stdDeviation="1.4"
            floodColor="#6b5410"
            floodOpacity="0.42"
          />
          <feDropShadow
            dx="-0.35"
            dy="-0.3"
            stdDeviation="0"
            floodColor="#c9a85a"
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
        stroke="rgba(180, 145, 50, 0.55)"
        strokeWidth="1.15"
        transform="translate(-0.35, -0.3)"
        {...STROKE}
      />

      <path
        d={outlinePath}
        fill="none"
        stroke={`url(#${ridgeId})`}
        strokeWidth="1.55"
        filter={liteFilters ? undefined : `url(#${depthFilterId})`}
        {...STROKE}
      />

      {!reduceMotion && tracePath && (
        <path
          d={tracePath}
          fill="none"
          stroke="#ffffff"
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
