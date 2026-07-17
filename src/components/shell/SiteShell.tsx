"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { buildPanelPath, buildBorderTracePath } from "@/lib/panel-path";
import { Header } from "@/components/sections/Header";
import { PanelBorderStar } from "./PanelBorderStar";
import { SpiritualBackground } from "./SpiritualBackground";

type SiteShellProps = {
  children: ReactNode;
};

type PanelGeometry = {
  width: number;
  height: number;
  outlinePath: string;
  tracePath: string;
  clipPath: string;
};

const PANEL_POSITION = [
  "absolute inset-x-0 bottom-1 top-0",
  "md:bottom-2 md:left-1.5 md:right-0",
  "lg:bottom-2.5 lg:left-2",
].join(" ");

const HASH_SCROLL_GAP_PX = 22;

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<PanelGeometry>();

  const updateClip = useCallback(() => {
    const panel = panelRef.current;
    const header = headerRef.current;
    if (!panel) return;

    const gapRaw = getComputedStyle(document.documentElement)
      .getPropertyValue("--panel-header-gap")
      .trim();
    const headerGap = Number.parseFloat(gapRaw) || 6;
    const lineY = (header?.offsetHeight ?? 68) + headerGap;
    const { width, height } = panel.getBoundingClientRect();
    const outlinePath = buildPanelPath(width, height, lineY);
    const tracePath = buildBorderTracePath(width, height, lineY);

    if (outlinePath) {
      setGeometry({
        width,
        height,
        outlinePath,
        tracePath,
        clipPath: `path('${outlinePath}')`,
      });
    }
  }, []);

  const scrollToHashTarget = useCallback(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const panel = panelRef.current;
    const header = headerRef.current;
    if (!panel) return;

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // keep raw id
    }

    const target = document.getElementById(id);
    if (!target || !panel.contains(target)) return;

    const gapRaw = getComputedStyle(document.documentElement)
      .getPropertyValue("--panel-header-gap")
      .trim();
    const headerGap = Number.parseFloat(gapRaw) || 6;
    // Use layout height (not getBoundingClientRect) so open mega-menus don't inflate offset.
    const offset = (header?.offsetHeight ?? 88) + headerGap + HASH_SCROLL_GAP_PX;
    const panelRect = panel.getBoundingClientRect();
    const nextTop =
      panel.scrollTop + (target.getBoundingClientRect().top - panelRect.top) - offset;

    panel.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateClip();

    const panel = panelRef.current;
    if (!panel) return;

    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateClip);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(panel);
    if (headerRef.current) observer.observe(headerRef.current);
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [updateClip]);

  // Native hash scrolling fights our fixed header + custom scroll panel — align manually.
  useEffect(() => {
    const onHash = () => {
      if (!window.location.hash) return;
      // Override the browser’s first jump after layout settles.
      window.setTimeout(scrollToHashTarget, 0);
      window.setTimeout(scrollToHashTarget, 80);
      window.setTimeout(scrollToHashTarget, 200);
    };

    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname, scrollToHashTarget]);

  return (
    <div className="site-shell fixed inset-0 overflow-hidden">
      <SpiritualBackground />

      <div
        ref={panelRef}
        className={["site-scroll-panel absolute z-10 overflow-y-auto overscroll-contain bg-canvas", PANEL_POSITION].join(
          " ",
        )}
        style={
          geometry
            ? {
                clipPath: geometry.clipPath,
                WebkitClipPath: geometry.clipPath,
              }
            : undefined
        }
      >
        {children}
      </div>

      <div className={`site-panel-frame ${PANEL_POSITION} pointer-events-none absolute z-[35] overflow-visible`} aria-hidden>
        {geometry ? (
          <PanelBorderStar
            width={geometry.width}
            height={geometry.height}
            outlinePath={geometry.outlinePath}
            tracePath={geometry.tracePath}
          />
        ) : null}
      </div>

      <div ref={headerRef} className="site-header-layer absolute inset-x-0 top-0 z-40 px-5 pt-4 pb-4 md:px-10 md:pt-5 md:pb-4.5 lg:px-14">
        <Header />
      </div>
    </div>
  );
}
