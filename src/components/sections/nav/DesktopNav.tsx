"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { desktopNavStagger } from "@/lib/nav-motion";
import { DesktopNavLink } from "@/components/sections/nav/NavLink";

export function DesktopNav() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-11" aria-label="Main">
        {site.nav.map((item) => (
          <DesktopNavLink key={item.href} item={item} animated={false} />
        ))}
      </nav>
    );
  }

  return (
    <motion.nav
      className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-11"
      aria-label="Main"
      variants={desktopNavStagger}
      initial="hidden"
      animate="visible"
    >
      {site.nav.map((item) => (
        <DesktopNavLink key={item.href} item={item} />
      ))}
    </motion.nav>
  );
}
