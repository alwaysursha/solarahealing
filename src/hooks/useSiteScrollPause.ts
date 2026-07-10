"use client";

import { useEffect } from "react";

const SCROLL_PANEL_SELECTOR = ".site-scroll-panel";
const SCROLLING_CLASS = "site-scrolling";
const SETTLE_MS = 180;

/** Pause heavy shell animations while the scroll panel moves — Chrome mobile compositor fix. */
export function useSiteScrollPause(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const panel = document.querySelector<HTMLElement>(SCROLL_PANEL_SELECTOR);
    if (!panel) return;

    let timer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      panel.classList.add(SCROLLING_CLASS);
      clearTimeout(timer);
      timer = setTimeout(() => panel.classList.remove(SCROLLING_CLASS), SETTLE_MS);
    };

    panel.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      panel.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      panel.classList.remove(SCROLLING_CLASS);
    };
  }, [enabled]);
}
