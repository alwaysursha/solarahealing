"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/sections/nav/NavIcon";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import type { SiteNavItem } from "@/lib/frontpage-content";
import { desktopNavItem } from "@/lib/nav-motion";
import {
  isSessionsNavItem,
  pickSessionsForNav,
  type SessionsMenuItem,
} from "@/lib/sessions-nav";
import { formatCad } from "@/lib/site";

type SessionsNavMenuProps = {
  item: SiteNavItem;
  animated?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  const path = href.split("#")[0] || href;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function SessionRow({
  session,
  onNavigate,
}: {
  session: SessionsMenuItem;
  onNavigate?: () => void;
}) {
  return (
    <Link href={session.href} className="courses-mega-item" onClick={onNavigate} role="menuitem">
      <span className="courses-mega-item-media">
        <Image
          src={session.image}
          alt={session.imageAlt}
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>
      <span className="courses-mega-item-copy">
        <span className="courses-mega-item-title">{session.title}</span>
        {session.duration ? (
          <span className="courses-mega-item-meta">{session.duration}</span>
        ) : null}
      </span>
      <span className="courses-mega-item-price">{formatCad(session.priceCad)}</span>
    </Link>
  );
}

function SessionsList({
  sessions,
  onNavigate,
}: {
  sessions: SessionsMenuItem[];
  onNavigate?: () => void;
}) {
  if (sessions.length === 0) {
    return <p className="courses-mega-empty">Private sessions coming soon</p>;
  }

  return (
    <>
      {sessions.map((session) => (
        <SessionRow key={session.id} session={session} onNavigate={onNavigate} />
      ))}
    </>
  );
}

export function SessionsDesktopNavMenu({ item, animated = true }: SessionsNavMenuProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { sessionsMenu } = useSiteChrome();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();
  const active = isActivePath(pathname, item.href);
  const useMotion = animated && !reduceMotion;
  const sessions = pickSessionsForNav(sessionsMenu);

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
          <div className="sessions-mega-panel-anchor">
            <motion.div
              id={menuId}
              className="reiki-mega-panel courses-mega-panel"
              role="menu"
              aria-label="Book a session menu"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="reiki-mega-panel-glow" aria-hidden />
              <div className="sessions-mega-list">
                <p className="reiki-mega-eyebrow">Private sessions</p>
                <SessionsList sessions={sessions} />
              </div>
              <div className="courses-mega-footer">
                <a href={item.href} className="reiki-mega-overview" role="menuitem">
                  View all sessions →
                </a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SessionsMobileNavMenu({
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
  const { sessionsMenu } = useSiteChrome();
  const active = isActivePath(pathname, item.href);
  const sessions = pickSessionsForNav(sessionsMenu);

  if (!isSessionsNavItem(item)) return null;

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
              <div className="sessions-mega-list sessions-mega-list-mobile">
                <p className="reiki-mega-eyebrow">Private sessions</p>
                <SessionsList sessions={sessions} onNavigate={onNavigate} />
              </div>
              <a href={item.href} className="courses-mobile-all" onClick={onNavigate}>
                View all sessions →
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
