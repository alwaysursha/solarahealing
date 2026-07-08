"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const CHAKRAS = [
  { name: "Root", color: "#E53935", x: "3%", y: "12%", size: 36, delay: 0 },
  { name: "Sacral", color: "#FB8C00", x: "12%", y: "55%", size: 32, delay: 0.6 },
  { name: "Solar", color: "#FDD835", x: "6%", y: "78%", size: 30, delay: 1.2 },
  { name: "Heart", color: "#43A047", x: "28%", y: "8%", size: 34, delay: 0.3 },
  { name: "Throat", color: "#1E88E5", x: "55%", y: "6%", size: 32, delay: 0.9 },
  { name: "Third Eye", color: "#5E35B1", x: "78%", y: "10%", size: 36, delay: 1.5 },
  { name: "Crown", color: "#CE93D8", x: "92%", y: "18%", size: 40, delay: 2.1 },
] as const;

const SPOKE_ANGLES = [0, 60, 120, 180, 240, 300] as const;

/** Fixed-precision endpoints — avoids SSR/client float hydration mismatches */
const CHAKRA_SPOKES = SPOKE_ANGLES.map((angle) => {
  const rad = (angle * Math.PI) / 180;
  return {
    angle,
    x2: (24 + 18 * Math.cos(rad)).toFixed(2),
    y2: (24 + 18 * Math.sin(rad)).toFixed(2),
  };
});

function ChakraSymbol({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="20" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="24" cy="24" r="12" fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <circle cx="24" cy="24" r="5" fill={color} fillOpacity="0.65" />
      {CHAKRA_SPOKES.map((spoke) => (
        <line
          key={spoke.angle}
          x1="24"
          y1="24"
          x2={spoke.x2}
          y2={spoke.y2}
          stroke={color}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
      ))}
    </svg>
  );
}

export function FloatingChakras({ animationsActive }: { animationsActive: boolean }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const motionEnabled = animationsActive && mounted && !reduceMotion;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {CHAKRAS.map((chakra) => (
        <motion.div
          key={chakra.name}
          className="absolute"
          style={{ left: chakra.x, top: chakra.y }}
          animate={
            motionEnabled
              ? {
                  y: [0, -12, 0, 8, 0],
                  x: [0, 5, 0, -3, 0],
                  opacity: [0.3, 0.5, 0.35, 0.45, 0.3],
                }
              : undefined
          }
          transition={{
            duration: 9 + chakra.delay,
            delay: chakra.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChakraSymbol color={chakra.color} size={chakra.size} />
        </motion.div>
      ))}
    </div>
  );
}
