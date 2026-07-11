"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type GlowButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "light";
  className?: string;
};

export function GlowButton({
  href,
  children,
  variant = "primary",
  className = "",
}: GlowButtonProps) {
  const reduceMotion = useReducedMotion();

  const base =
    "relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors md:px-8 md:py-3.5";
  const styles = {
    primary:
      "bg-gold text-cream shadow-lg shadow-gold/30 hover:bg-gold-light",
    outline:
      "border border-purple-deep/20 text-purple-deep hover:border-gold hover:text-gold",
    light:
      "border border-cream/30 bg-cream/10 text-cream backdrop-blur-sm hover:border-gold hover:bg-cream/20",
  }[variant];

  return (
    <motion.a
      href={href}
      className={`${base} ${styles} ${className}`}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      {variant === "primary" && !reduceMotion && (
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gold/30 blur-xl" />
      )}
      <span className="relative">{children}</span>
    </motion.a>
  );
}
