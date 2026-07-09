"use client";

import { useEffect, useState } from "react";

export type CompositorProfile = "default" | "chrome-touch";

const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

export function detectCompositorProfile(): CompositorProfile {
  if (typeof navigator === "undefined") return "default";

  const ua = navigator.userAgent;
  const isChrome =
    /CriOS\//.test(ua) ||
    (/Chrome\//.test(ua) && /Mobile|Android/i.test(ua) && !/EdgA?\/|OPR\/|Firefox/i.test(ua));
  const isTouch =
    typeof window !== "undefined" && window.matchMedia(TOUCH_QUERY).matches;

  return isChrome && isTouch ? "chrome-touch" : "default";
}

/** Chrome mobile needs a frozen clip-path + fewer full-layer opacity animations. */
export function useCompositorProfile(): CompositorProfile {
  const [profile, setProfile] = useState<CompositorProfile>("default");

  useEffect(() => {
    const next = detectCompositorProfile();
    setProfile(next);
    document.documentElement.dataset.compositor = next;
    return () => {
      delete document.documentElement.dataset.compositor;
    };
  }, []);

  return profile;
}
