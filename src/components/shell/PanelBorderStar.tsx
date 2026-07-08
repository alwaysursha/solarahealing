"use client";

import { useReducedMotion } from "framer-motion";
import { useId } from "react";

type PanelBorderStarProps = {
  width: number;
  height: number;
  outlinePath: string;
  tracePath: string;
};

const TRAVEL_DUR = "20s";

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
}: PanelBorderStarProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const shimmerId = `border-shimmer-${uid}`;
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
          <stop offset="0%" stopColor="#f5e6b8" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#dbb94a" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.55" />
        </linearGradient>

        <linearGradient id={shadowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e6b8" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#c9a227" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8a6d14" stopOpacity="0.18" />
        </linearGradient>

        <linearGradient id={shimmerId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff8e7" stopOpacity="0" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffe08a" stopOpacity="1" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff8e7" stopOpacity="0" />
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
            dx="0.75"
            dy="1.75"
            stdDeviation="1.2"
            floodColor="#c9a227"
            floodOpacity="0.32"
          />
          <feDropShadow
            dx="-0.4"
            dy="-0.35"
            stdDeviation="0"
            floodColor="#f5e6b8"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      {/* Cast shadow */}
      <path
        d={outlinePath}
        fill="none"
        stroke={`url(#${shadowId})`}
        strokeWidth="1.5"
        transform="translate(1, 1.5)"
        {...STROKE}
      />

      {/* Light catch on inner edge */}
      <path
        d={outlinePath}
        fill="none"
        stroke="rgba(245, 230, 184, 0.55)"
        strokeWidth="1"
        transform="translate(-0.4, -0.35)"
        {...STROKE}
      />

      {/* Main edge */}
      <path
        d={outlinePath}
        fill="none"
        stroke={`url(#${ridgeId})`}
        strokeWidth="1.25"
        filter={`url(#${depthFilterId})`}
        {...STROKE}
      />

      {!reduceMotion && tracePath && (
        <path
          d={tracePath}
          fill="none"
          stroke={`url(#${shimmerId})`}
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="3 97"
          opacity="0.9"
          {...STROKE}
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;-100;0"
            dur={TRAVEL_DUR}
            repeatCount="indefinite"
          />
        </path>
      )}
    </svg>
  );
}
