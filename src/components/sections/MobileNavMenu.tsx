"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { MobileNavLink } from "@/components/sections/nav/NavLink";
import { BlogMobileNavMenu } from "@/components/sections/nav/BlogNavMenu";
import { CoursesMobileNavMenu } from "@/components/sections/nav/CoursesNavMenu";
import { ReikiMobileNavMenu } from "@/components/sections/nav/ReikiNavMenu";
import { SessionsMobileNavMenu } from "@/components/sections/nav/SessionsNavMenu";
import {
  mobileNavFooterVariants,
  mobileNavItemVariants,
  mobileNavListVariants,
  mobileNavPanelVariants,
} from "@/lib/nav-motion";
import { MOBILE_NAV_WIDTH_PERCENT } from "@/lib/panel-path";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { isBlogNavItem } from "@/lib/blog-nav";
import { isCoursesNavItem } from "@/lib/courses-nav";
import { isReikiNavItem } from "@/lib/reiki-nav";
import { isSessionsNavItem } from "@/lib/sessions-nav";
import type { SiteNavItem } from "@/lib/frontpage-content";

type MobileNavMenuProps = {
  items: readonly SiteNavItem[];
  onClose: () => void;
  onLogin: () => void;
};

function MobileNavShell({ children }: { children: ReactNode }) {
  return <div className="mobile-nav-shell relative overflow-hidden">{children}</div>;
}

function MobileNavHeader() {
  const { name, sanskrit } = useSiteChrome();
  return (
    <div className="mobile-nav-header px-5 pb-4 pt-5 sm:px-6">
      <p className="nav-link-desktop-label text-gold/78">Navigate</p>
      <p className="nav-link-desktop-label mt-3">{name}</p>
      <p className="mt-2 text-[0.62rem] font-semibold tracking-[0.18em] text-cream/38">{sanskrit}</p>
    </div>
  );
}

function MobileNavFooter({
  onLogin,
  onClose,
  animated,
}: {
  onLogin: () => void;
  onClose: () => void;
  animated: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const useMotion = animated && !reduceMotion;
  const { cta } = useSiteChrome();

  const content = (
    <>
      <div className="mobile-nav-divider mx-5 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent sm:mx-6" />
      <div className="mobile-nav-footer-actions flex items-center gap-3 px-5 py-4 sm:px-6">
        <button type="button" className="mobile-nav-utility-btn flex-1" onClick={onLogin}>
          Log in
        </button>
        <Link href="#sessions" className="mobile-nav-cta mobile-nav-cta-inline group flex-1" onClick={onClose}>
          <span className="mobile-nav-cta-shine pointer-events-none absolute inset-0" aria-hidden />
          <span className="relative">{cta}</span>
          <span className="relative transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </>
  );

  if (!useMotion) {
    return <div className="mobile-nav-footer">{content}</div>;
  }

  return (
    <motion.div className="mobile-nav-footer" variants={mobileNavFooterVariants}>
      {content}
    </motion.div>
  );
}

function MobileNavItem({
  item,
  index,
  animated,
  onClose,
  openSubmenuId,
  onToggleSubmenu,
}: {
  item: SiteNavItem;
  index: number;
  animated: boolean;
  onClose: () => void;
  openSubmenuId: string | null;
  onToggleSubmenu: (id: string) => void;
}) {
  const open = openSubmenuId === item.id;
  const onToggle = () => onToggleSubmenu(item.id);

  if (isReikiNavItem(item)) {
    return <ReikiMobileNavMenu item={item} onNavigate={onClose} open={open} onToggle={onToggle} />;
  }
  if (isCoursesNavItem(item)) {
    return <CoursesMobileNavMenu item={item} onNavigate={onClose} open={open} onToggle={onToggle} />;
  }
  if (isSessionsNavItem(item)) {
    return <SessionsMobileNavMenu item={item} onNavigate={onClose} open={open} onToggle={onToggle} />;
  }
  if (isBlogNavItem(item)) {
    return <BlogMobileNavMenu item={item} onNavigate={onClose} open={open} onToggle={onToggle} />;
  }
  return (
    <MobileNavLink item={item} index={index} onNavigate={onClose} animated={animated} />
  );
}

export function MobileNavMenu({ items, onClose, onLogin }: MobileNavMenuProps) {
  const reduceMotion = useReducedMotion();
  const staticMotion = reduceMotion;
  const shellRef = useRef<HTMLDivElement>(null);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

  const handleLogin = () => {
    onClose();
    onLogin();
  };

  const toggleSubmenu = (id: string) => {
    setOpenSubmenuId((current) => (current === id ? null : id));
  };

  const shellProps = {
    ref: shellRef,
    className: "relative origin-top lg:hidden",
    style: { width: `${MOBILE_NAV_WIDTH_PERCENT}%` },
  };

  const linkList = items.map((item, index) => (
    <MobileNavItem
      key={item.id}
      item={item}
      index={index}
      animated={!staticMotion}
      onClose={onClose}
      openSubmenuId={openSubmenuId}
      onToggleSubmenu={toggleSubmenu}
    />
  ));

  if (staticMotion) {
    return (
      <div {...shellProps}>
        <MobileNavShell>
          <MobileNavHeader />
          <nav className="mobile-nav-menu flex flex-col px-3 py-2 sm:px-4" aria-label="Mobile">
            {linkList}
          </nav>
          <MobileNavFooter onLogin={handleLogin} onClose={onClose} animated={false} />
        </MobileNavShell>
      </div>
    );
  }

  return (
    <motion.div
      {...shellProps}
      variants={mobileNavPanelVariants}
      initial="closed"
      animate="open"
    >
      <MobileNavShell>
        <MobileNavHeader />
        <motion.nav
          className="mobile-nav-menu flex flex-col px-3 py-2 sm:px-4"
          aria-label="Mobile"
          variants={mobileNavListVariants}
          initial="closed"
          animate="open"
        >
          {items.map((item, index) => (
            <motion.div key={item.id} variants={mobileNavItemVariants}>
              <MobileNavItem
                item={item}
                index={index}
                animated
                onClose={onClose}
                openSubmenuId={openSubmenuId}
                onToggleSubmenu={toggleSubmenu}
              />
            </motion.div>
          ))}
        </motion.nav>
        <MobileNavFooter onLogin={handleLogin} onClose={onClose} animated />
      </MobileNavShell>
    </motion.div>
  );
}

export { mobileNavItemVariants };
