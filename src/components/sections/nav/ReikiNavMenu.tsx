"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/sections/nav/NavIcon";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { desktopNavItem } from "@/lib/nav-motion";
import { isReikiNavItem, reikiNavLinks, type ReikiMenuCourse } from "@/lib/reiki-nav";
import type { SiteNavItem } from "@/lib/frontpage-content";

type ReikiNavMenuProps = {
  item: SiteNavItem;
  animated?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  const path = href.split("#")[0] || href;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function CoursePromoCard({
  course,
  onNavigate,
}: {
  course: ReikiMenuCourse;
  onNavigate?: () => void;
}) {
  return (
    <Link href={course.href} className="reiki-mega-course" onClick={onNavigate}>
      <span className="reiki-mega-course-media">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="280px"
          className="object-cover"
        />
        <span className="reiki-mega-course-badge">Free</span>
      </span>
      <span className="reiki-mega-course-body">
        <span className="reiki-mega-course-kicker">Join for free</span>
        <span className="reiki-mega-course-title">{course.title}</span>
        <span className="reiki-mega-course-copy">{course.description}</span>
        <span className="reiki-mega-course-cta">
          Start Introduction to Reiki
          <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}

export function ReikiDesktopNavMenu({ item, animated = true }: ReikiNavMenuProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { reikiMenuCourse } = useSiteChrome();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();
  const active = isActivePath(pathname, item.href);
  const useMotion = animated && !reduceMotion;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => clearCloseTimer(), []);

  const triggerClass = [
    "nav-link-desktop group relative inline-flex items-center gap-2 px-1 py-2",
    active || open ? "nav-link-desktop-active" : "",
  ].join(" ");

  const trigger = (
    <>
      <NavIcon id={item.icon} className="nav-link-icon h-[0.95rem] w-[0.95rem] shrink-0" />
      <span className="nav-link-desktop-label">{item.label}</span>
      <span className="reiki-mega-chevron" aria-hidden>
        ▾
      </span>
      <span className="nav-link-desktop-glow pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold/90 to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100" />
    </>
  );

  return (
    <div
      className="reiki-mega-root"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          scheduleClose();
        }
      }}
    >
      {useMotion ? (
        <motion.button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          variants={desktopNavItem}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 520, damping: 28 }}
          onClick={() => setOpen((value) => !value)}
        >
          {trigger}
        </motion.button>
      ) : (
        <button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={() => setOpen((value) => !value)}
        >
          {trigger}
        </button>
      )}

      <AnimatePresence>
        {open ? (
          <div className="reiki-mega-panel-anchor">
            <motion.div
              id={menuId}
              className="reiki-mega-panel"
              role="menu"
              aria-label="Reiki menu"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="reiki-mega-panel-glow" aria-hidden />
              <div className="reiki-mega-grid">
                <div className="reiki-mega-links">
                  <p className="reiki-mega-eyebrow">Explore Reiki</p>
                  {reikiNavLinks.map((link) => (
                    <a key={link.id} href={link.href} className="reiki-mega-link" role="menuitem">
                      <span className="reiki-mega-link-label">{link.label}</span>
                      <span className="reiki-mega-link-blurb">{link.blurb}</span>
                    </a>
                  ))}
                  <a href={item.href} className="reiki-mega-overview" role="menuitem">
                    View full Reiki page →
                  </a>
                </div>
                {reikiMenuCourse ? (
                  <CoursePromoCard course={reikiMenuCourse} />
                ) : (
                  <a href="/courses" className="reiki-mega-course reiki-mega-course-fallback" role="menuitem">
                    <span className="reiki-mega-course-body">
                      <span className="reiki-mega-course-kicker">Catalog</span>
                      <span className="reiki-mega-course-title">Browse Reiki courses</span>
                      <span className="reiki-mega-course-cta">
                        Open courses
                        <span aria-hidden>→</span>
                      </span>
                    </span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ReikiMobileNavMenu({
  item,
  onNavigate,
}: {
  item: SiteNavItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { reikiMenuCourse } = useSiteChrome();
  const [open, setOpen] = useState(false);
  const active = isActivePath(pathname, item.href);

  if (!isReikiNavItem(item)) return null;

  return (
    <div className={["reiki-mobile-menu", open ? "reiki-mobile-menu-open" : ""].join(" ")}>
      <button
        type="button"
        className={[
          "mobile-nav-link group relative flex w-full items-center gap-4 py-3.5 text-left",
          active ? "mobile-nav-link-active" : "",
        ].join(" ")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="mobile-nav-link-icon-wrap" aria-hidden>
          <NavIcon id={item.icon} className="mobile-nav-link-icon h-[1.05rem] w-[1.05rem]" />
        </span>
        <span className="mobile-nav-link-copy min-w-0 flex-1">
          <span className="mobile-nav-link-label nav-link-desktop-label">{item.label}</span>
        </span>
        <span className="reiki-mobile-chevron" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="reiki-mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="reiki-mobile-panel-inner">
              {reikiNavLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="reiki-mobile-link"
                  onClick={onNavigate}
                >
                  <span className="reiki-mobile-link-label">{link.label}</span>
                  <span className="reiki-mobile-link-blurb">{link.blurb}</span>
                </a>
              ))}
              {reikiMenuCourse ? (
                <CoursePromoCard course={reikiMenuCourse} onNavigate={onNavigate} />
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
