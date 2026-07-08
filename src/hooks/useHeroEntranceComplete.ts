"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HOME_HERO_ENTRANCE_MS } from "@/lib/home-entrance";

export function useHeroEntranceComplete() {
  const reduceMotion = useReducedMotion();
  const [complete, setComplete] = useState(reduceMotion === true);

  useEffect(() => {
    if (reduceMotion) {
      setComplete(true);
      return;
    }

    const timer = window.setTimeout(() => setComplete(true), HOME_HERO_ENTRANCE_MS);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return complete;
}
