"use client";

import { useEffect, useState } from "react";

export function isChromeMobile(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  const isChrome =
    /CriOS\//.test(ua) ||
    (/Chrome\//.test(ua) && /Mobile|Android/i.test(ua) && !/EdgA?\/|OPR\/|Firefox\//.test(ua));
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  return isChrome && isTouch;
}

/** Chrome on phones has compositor bugs with clip-path scroll + backdrop-filter. */
export function useChromeMobile(): boolean {
  const [chromeMobile, setChromeMobile] = useState(false);

  useEffect(() => {
    setChromeMobile(isChromeMobile());
  }, []);

  return chromeMobile;
}
