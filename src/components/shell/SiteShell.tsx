"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { buildPanelPath, buildBorderTracePath } from "@/lib/panel-path";
import { useChromeMobile } from "@/hooks/useChromeMobile";
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

export function SiteShell({ header, children }: SiteShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<PanelGeometry>();
  const chromeMobile = useChromeMobile();

  const updateClip = useCallback(() => {
    const panel = panelRef.current;
    const header = headerRef.current;
    if (!panel) return;

    const lineY = (header?.offsetHeight ?? 68) + 6;
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

  return (
    <div className={`fixed inset-0 overflow-hidden${chromeMobile ? " site-chrome-fix" : ""}`}>
      <SpiritualBackground />

      <div
        ref={headerRef}
        className="absolute inset-x-0 top-0 z-30 px-5 pt-4 pb-4 md:px-10 md:pt-5 md:pb-4.5 lg:px-14"
      >
        {header}
      </div>

      <div
        ref={panelRef}
        className={[
          "absolute z-10 overflow-y-auto overscroll-contain bg-canvas",
          PANEL_POSITION,
          chromeMobile ? "site-chrome-scroll-panel" : "",
        ].join(" ")}
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

      <div
        className={`${PANEL_POSITION} z-20 overflow-visible pointer-events-none`}
        aria-hidden
      >
        {geometry ? (
          <PanelBorderStar
            width={geometry.width}
            height={geometry.height}
            outlinePath={geometry.outlinePath}
            tracePath={geometry.tracePath}
          />
        ) : null}
      </div>
    </div>
  );
}
