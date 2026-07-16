"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { desktopNavStagger } from "@/lib/nav-motion";
import { BlogDesktopNavMenu } from "@/components/sections/nav/BlogNavMenu";
import { CoursesDesktopNavMenu } from "@/components/sections/nav/CoursesNavMenu";
import { DesktopNavLink } from "@/components/sections/nav/NavLink";
import { ReikiDesktopNavMenu } from "@/components/sections/nav/ReikiNavMenu";
import { SessionsDesktopNavMenu } from "@/components/sections/nav/SessionsNavMenu";
import { isBlogNavItem } from "@/lib/blog-nav";
import { isCoursesNavItem } from "@/lib/courses-nav";
import type { SiteNavItem } from "@/lib/frontpage-content";
import { isReikiNavItem } from "@/lib/reiki-nav";
import { isSessionsNavItem } from "@/lib/sessions-nav";

function DesktopNavItem({ item, animated }: { item: SiteNavItem; animated: boolean }) {
  if (isReikiNavItem(item)) {
    return <ReikiDesktopNavMenu item={item} animated={animated} />;
  }
  if (isCoursesNavItem(item)) {
    return <CoursesDesktopNavMenu item={item} animated={animated} />;
  }
  if (isSessionsNavItem(item)) {
    return <SessionsDesktopNavMenu item={item} animated={animated} />;
  }
  if (isBlogNavItem(item)) {
    return <BlogDesktopNavMenu item={item} animated={animated} />;
  }
  return <DesktopNavLink item={item} animated={animated} />;
}

export function DesktopNav() {
  const reduceMotion = useReducedMotion();
  const { nav } = useSiteChrome();

  const items = nav.map((item) => (
    <DesktopNavItem key={item.id} item={item} animated={!reduceMotion} />
  ));

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
