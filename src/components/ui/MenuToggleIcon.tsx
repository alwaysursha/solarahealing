"use client";

import { motion, useReducedMotion } from "framer-motion";

type MenuToggleIconProps = {
  open: boolean;
};

const lineTransition = {
  type: "spring",
  stiffness: 480,
  damping: 32,
  mass: 0.72,
} as const;

export function MenuToggleIcon({ open }: MenuToggleIconProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : lineTransition;

  return (
    <span className="relative block h-6 w-6" aria-hidden>
      <motion.span
        className="absolute left-1/2 h-[1.5px] w-[1.15rem] -translate-x-1/2 rounded-full bg-current shadow-[0_0_8px_rgba(201,162,39,0.35)]"
        initial={false}
        animate={open ? { top: 11, rotate: 45 } : { top: 5, rotate: 0 }}
        transition={transition}
        style={{ originX: "50%", originY: "50%" }}
      />
      <motion.span
        className="absolute left-1/2 top-[11px] h-[1.5px] w-[1.15rem] -translate-x-1/2 rounded-full bg-current"
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0.15 } : { opacity: 1, scaleX: 1 }}
        transition={transition}
        style={{ originX: "50%", originY: "50%" }}
      />
      <motion.span
        className="absolute left-1/2 h-[1.5px] w-[1.15rem] -translate-x-1/2 rounded-full bg-current shadow-[0_0_8px_rgba(201,162,39,0.35)]"
        initial={false}
        animate={open ? { top: 11, rotate: -45 } : { top: 17, rotate: 0 }}
        transition={transition}
        style={{ originX: "50%", originY: "50%" }}
      />
    </span>
  );
}
