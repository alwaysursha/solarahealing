"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { desktopNavItem } from "@/lib/nav-motion";
import { NavIcon, type NavIconId } from "@/components/sections/nav/NavIcon";

type NavItem = {
  label: string;
  href: string;
  icon: NavIconId;
};

type DesktopNavLinkProps = {
  item: NavItem;
  animated?: boolean;
};

type MobileNavLinkProps = {
  item: NavItem;
  index: number;
  onNavigate?: () => void;
  animated?: boolean;
};

function isNavActive(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavLink({ item, animated = true }: DesktopNavLinkProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const useMotion = animated && !reduceMotion;
  const className = [
    "nav-link-desktop group relative inline-flex items-center gap-2 px-1 py-2",
    active ? "nav-link-desktop-active" : "",
  ].join(" ");

  const content = (
    <>
      <NavIcon id={item.icon} className="nav-link-icon h-[0.95rem] w-[0.95rem] shrink-0" />
      <span className="nav-link-desktop-label">{item.label}</span>
      <span className="nav-link-desktop-glow pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold/90 to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100" />
      <span className="nav-link-desktop-dot pointer-events-none absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
    </>
  );

  if (!useMotion) {
    return (
      <a href={item.href} className={className} aria-current={active ? "page" : undefined}>
        {content}
      </a>
    );
  }

  return (
    <motion.a
      href={item.href}
      className={className}
      variants={desktopNavItem}
      aria-current={active ? "page" : undefined}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
    >
      {content}
    </motion.a>
  );
}

export function MobileNavLink({ item, onNavigate, animated = true }: Omit<MobileNavLinkProps, "index"> & { index?: number }) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const useMotion = animated && !reduceMotion;
  const className = [
    "mobile-nav-link group relative flex w-full items-center gap-4 py-3.5 text-left",
    active ? "mobile-nav-link-active" : "",
  ].join(" ");

  const content = (
    <>
      <span className="mobile-nav-link-icon-wrap" aria-hidden>
        <NavIcon id={item.icon} className="mobile-nav-link-icon h-[1.05rem] w-[1.05rem]" />
      </span>
      <span className="mobile-nav-link-copy min-w-0 flex-1">
        <span className="mobile-nav-link-label nav-link-desktop-label">{item.label}</span>
        <span className="nav-link-desktop-glow pointer-events-none mt-2 block h-px w-0 max-w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold/90 to-transparent opacity-0 transition-[transform,width,opacity] duration-500 ease-out group-hover:w-full group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:w-full group-focus-visible:scale-x-100 group-focus-visible:opacity-100" />
      </span>
      <span className="mobile-nav-link-arrow text-gold/0 transition-[transform,color,opacity] duration-500 ease-out group-hover:translate-x-0.5 group-hover:text-gold/75 group-focus-visible:translate-x-0.5 group-focus-visible:text-gold/75">
        →
      </span>
    </>
  );

  if (!useMotion) {
    return (
      <a href={item.href} className={className} onClick={onNavigate} aria-current={active ? "page" : undefined}>
        {content}
      </a>
    );
  }

  return (
    <motion.a
      href={item.href}
      className={className}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      whileTap={{ scale: 0.985 }}
    >
      {content}
    </motion.a>
  );
}
