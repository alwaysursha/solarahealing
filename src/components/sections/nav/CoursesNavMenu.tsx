"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/sections/nav/NavIcon";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import {
  isCoursesNavItem,
  pickCoursesForNav,
  type CoursesMenuCourse,
} from "@/lib/courses-nav";
import type { SiteNavItem } from "@/lib/frontpage-content";
import { desktopNavItem } from "@/lib/nav-motion";
import { formatCad } from "@/lib/site";

type CoursesNavMenuProps = {
  item: SiteNavItem;
  animated?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  const path = href.split("#")[0] || href;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function CourseRow({
  course,
  onNavigate,
}: {
  course: CoursesMenuCourse;
  onNavigate?: () => void;
}) {
  const price = formatCad(course.priceCad);
  const isFree = course.priceCad <= 0;

  return (
    <Link href={course.href} className="courses-mega-item" onClick={onNavigate} role="menuitem">
      <span className="courses-mega-item-media">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>
      <span className="courses-mega-item-copy">
        <span className="courses-mega-item-title">{course.title}</span>
        {course.duration ? (
          <span className="courses-mega-item-meta">{course.duration}</span>
        ) : null}
      </span>
      <span className={["courses-mega-item-price", isFree ? "is-free" : ""].join(" ")}>
        {price}
      </span>
    </Link>
  );
}

function CourseGroup({
  eyebrow,
  courses,
  emptyLabel,
  onNavigate,
}: {
  eyebrow: string;
  courses: CoursesMenuCourse[];
  emptyLabel: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="courses-mega-group">
      <p className="reiki-mega-eyebrow">{eyebrow}</p>
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseRow key={course.id} course={course} onNavigate={onNavigate} />
        ))
      ) : (
        <p className="courses-mega-empty">{emptyLabel}</p>
      )}
    </div>
  );
}

export function CoursesDesktopNavMenu({ item, animated = true }: CoursesNavMenuProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { coursesMenu } = useSiteChrome();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();
  const active = isActivePath(pathname, item.href);
  const useMotion = animated && !reduceMotion;
  const { reiki, nonReiki } = pickCoursesForNav(coursesMenu);

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
          <div className="courses-mega-panel-anchor">
            <motion.div
              id={menuId}
              className="reiki-mega-panel courses-mega-panel"
              role="menu"
              aria-label="Courses menu"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="reiki-mega-panel-glow" aria-hidden />
              <div className="courses-mega-grid">
                <CourseGroup
                  eyebrow="Reiki courses"
                  courses={reiki}
                  emptyLabel="More Reiki courses coming soon"
                />
                <CourseGroup
                  eyebrow="Non-Reiki"
                  courses={nonReiki}
                  emptyLabel="More wellness courses coming soon"
                />
              </div>
              <div className="courses-mega-footer">
                <a href={item.href} className="reiki-mega-overview" role="menuitem">
                  View all courses →
                </a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function CoursesMobileNavMenu({
  item,
  onNavigate,
  open,
  onToggle,
}: {
  item: SiteNavItem;
  onNavigate?: () => void;
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { coursesMenu } = useSiteChrome();
  const active = isActivePath(pathname, item.href);
  const { reiki, nonReiki } = pickCoursesForNav(coursesMenu);

  if (!isCoursesNavItem(item)) return null;

  return (
    <div className={["reiki-mobile-menu", open ? "reiki-mobile-menu-open" : ""].join(" ")}>
      <button
        type="button"
        className={[
          "mobile-nav-link group relative flex w-full items-center gap-4 py-3.5 text-left",
          active ? "mobile-nav-link-active" : "",
        ].join(" ")}
        aria-expanded={open}
        onClick={onToggle}
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
            <div className="reiki-mobile-panel-inner courses-mobile-panel-inner">
              <CourseGroup
                eyebrow="Reiki courses"
                courses={reiki}
                emptyLabel="More Reiki courses coming soon"
                onNavigate={onNavigate}
              />
              <CourseGroup
                eyebrow="Non-Reiki"
                courses={nonReiki}
                emptyLabel="More wellness courses coming soon"
                onNavigate={onNavigate}
              />
              <a href={item.href} className="courses-mobile-all" onClick={onNavigate}>
                View all courses →
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
