"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { MOBILE_NAV_WIDTH_PERCENT } from "@/lib/panel-path";

type MobileNavMenuProps = {
  children: ReactNode;
};

const panelVariants = {
  closed: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 34,
      mass: 0.85,
      delay: 0.06,
    },
  },
} as const;

const listVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.16,
    },
  },
} as const;

export function MobileNavMenu({ children }: MobileNavMenuProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative origin-top lg:hidden"
      style={{ width: `${MOBILE_NAV_WIDTH_PERCENT}%` }}
      variants={reduceMotion ? undefined : panelVariants}
      initial={reduceMotion ? undefined : "closed"}
      animate={reduceMotion ? undefined : "open"}
    >
      <motion.nav
        className="mobile-nav-menu flex flex-col gap-4 p-5"
        aria-label="Mobile"
        variants={reduceMotion ? undefined : listVariants}
        initial={reduceMotion ? undefined : "closed"}
        animate={reduceMotion ? undefined : "open"}
      >
        {children}
      </motion.nav>
    </motion.div>
  );
}

export const mobileNavItemVariants = {
  closed: { opacity: 0, y: -10 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 480,
      damping: 32,
    },
  },
} as const;
