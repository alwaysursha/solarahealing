"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { desktopNavStagger } from "@/lib/nav-motion";
import { DesktopNavLink } from "@/components/sections/nav/NavLink";

export function DesktopNav() {
  const reduceMotion = useReducedMotion();
  const { nav } = useSiteChrome();

  if (reduceMotion) {
    return (
      <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7" aria-label="Main">
        {nav.map((item) => (
          <DesktopNavLink key={item.id} item={item} animated={false} />
        ))}
      </nav>
    );
  }

  return (
    <motion.nav
      className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7"
      aria-label="Main"
      variants={desktopNavStagger}
      initial="hidden"
      animate="visible"
    >
      {nav.map((item) => (
        <DesktopNavLink key={item.id} item={item} />
      ))}
    </motion.nav>
  );
}
