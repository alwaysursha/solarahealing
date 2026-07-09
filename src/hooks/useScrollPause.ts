"use client";

import { useEffect, type RefObject } from "react";

/** Pause CSS animations while the scroll panel moves — avoids Chrome clip-path flicker. */
export function useScrollPause(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const section = ref.current;
    const panel = section?.closest(".site-scroll-panel");
    if (!section || !panel) return;

    let timer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      section.classList.add("courses-scrolling");
      clearTimeout(timer);
      timer = setTimeout(() => section.classList.remove("courses-scrolling"), 140);
    };

    panel.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      panel.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      section.classList.remove("courses-scrolling");
    };
  }, [enabled, ref]);
}
