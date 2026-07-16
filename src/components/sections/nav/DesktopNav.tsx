"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { desktopNavStagger } from "@/lib/nav-motion";
import { DesktopNavLink } from "@/components/sections/nav/NavLink";
import { ReikiDesktopNavMenu } from "@/components/sections/nav/ReikiNavMenu";
import { isReikiNavItem } from "@/lib/reiki-nav";

export function DesktopNav() {
  const reduceMotion = useReducedMotion();
  const { nav } = useSiteChrome();

  const items = nav.map((item) =>
    isReikiNavItem(item) ? (
      <ReikiDesktopNavMenu key={item.id} item={item} animated={!reduceMotion} />
    ) : (
      <DesktopNavLink key={item.id} item={item} animated={!reduceMotion} />
    ),
  );

  if (reduceMotion) {
    return (
      <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7" aria-label="Main">
        {items}
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
      {items}
    </motion.nav>
  );
}
