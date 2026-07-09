"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { buildPanelPath, buildBorderTracePath } from "@/lib/panel-path";
import { PanelBorderStar } from "./PanelBorderStar";
import { SpiritualBackground } from "./SpiritualBackground";

type SiteShellProps = {
  header: ReactNode;
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

const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia(TOUCH_QUERY).matches;
}

export function SiteShell({ header, children }: SiteShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<PanelGeometry>();
  const clipKeyRef = useRef<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateClip = useCallback(() => {
    const panel = panelRef.current;
    const header = headerRef.current;
    if (!panel) return;

    const lineY = (header?.offsetHeight ?? 68) + 6;
    const { width, height } = panel.getBoundingClientRect();
    const headerH = header?.offsetHeight ?? 68;
    const clipKey = `${Math.round(width)}:${Math.round(headerH)}`;

    /* Mobile browsers resize the panel when the URL bar hides — skip height-only churn */
    if (isTouchDevice() && clipKeyRef.current && clipKeyRef.current === clipKey) {
      return;
    }

    clipKeyRef.current = clipKey;
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

  useEffect(() => {
    updateClip();
    const panel = panelRef.current;
    if (!panel) return;

    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const run = () => {
        frame = requestAnimationFrame(updateClip);
      };

      if (isTouchDevice()) {
        debounceRef.current = setTimeout(run, 280);
        return;
      }

      run();
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(panel);
    if (headerRef.current) observer.observe(headerRef.current);
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [updateClip]);

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

      <div className={`${PANEL_POSITION} pointer-events-none absolute z-20 overflow-visible`} aria-hidden>
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
        {header}
      </div>
    </div>
  );
}
