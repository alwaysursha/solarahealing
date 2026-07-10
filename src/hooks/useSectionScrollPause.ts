"use client";

import { useEffect, useState, type RefObject } from "react";

const SCROLL_PANEL_SELECTOR = ".site-scroll-panel";
const SETTLE_MS = 420;

/** Pause a section while the site scroll panel moves; resumes after scroll settles. */
export function useSectionScrollPause(
  ref: RefObject<HTMLElement | null>,
  pausedClass = "section-scroll-paused",
  enabled = true,
) {
  const [scrollPaused, setScrollPaused] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const section = ref.current;
    const panel = section?.closest<HTMLElement>(SCROLL_PANEL_SELECTOR);
    if (!section || !panel) return;

    let settleTimer: ReturnType<typeof setTimeout>;
    const scrollEndSupported = "onscrollend" in window;

    const setPaused = (active: boolean) => {
      setScrollPaused(active);
      section.classList.toggle(pausedClass, active);
    };

    const scheduleIdle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => setPaused(false), SETTLE_MS);
    };

    const onScroll = () => {
      setPaused(true);
      scheduleIdle();
    };

    const onScrollEnd = () => {
      clearTimeout(settleTimer);
      setPaused(false);
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
      section.classList.remove(pausedClass);
    };
  }, [ref, pausedClass, enabled]);

  return scrollPaused;
}
