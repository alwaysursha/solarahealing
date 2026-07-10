"use client";

import { useEffect } from "react";

const SCROLL_PANEL_SELECTOR = ".site-scroll-panel";
const SCROLLING_CLASS = "site-scrolling";
const SETTLE_MS = 420;

/** Pause heavy shell animations while the scroll panel moves — Chrome mobile compositor fix. */
export function useSiteScrollPause(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const panel = document.querySelector<HTMLElement>(SCROLL_PANEL_SELECTOR);
    if (!panel) return;

    let settleTimer: ReturnType<typeof setTimeout>;
    let scrollEndSupported = "onscrollend" in window;

    const setScrolling = (active: boolean) => {
      panel.classList.toggle(SCROLLING_CLASS, active);
    };

    const scheduleIdle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => setScrolling(false), SETTLE_MS);
    };

    const onScroll = () => {
      setScrolling(true);
      scheduleIdle();
    };

    const onScrollEnd = () => {
      clearTimeout(settleTimer);
      setScrolling(false);
    };

    panel.addEventListener("scroll", onScroll, { passive: true });
    if (scrollEndSupported) {
      panel.addEventListener("scrollend", onScrollEnd, { passive: true });
    }

    return () => {
      panel.removeEventListener("scroll", onScroll);
      if (scrollEndSupported) {
        panel.removeEventListener("scrollend", onScrollEnd);
      }
      clearTimeout(settleTimer);
      panel.classList.remove(SCROLLING_CLASS);
    };
  }, [enabled]);
}
