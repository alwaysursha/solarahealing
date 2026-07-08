"use client";

import { useEffect, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function usePageVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}

export function useAnimationsActive(
  ref: RefObject<Element | null>,
  margin = "-10% 0px -10% 0px",
) {
  const reduceMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const isInView = useInView(ref, {
    margin: margin as `${number}% ${number}px ${number}% ${number}px`,
    amount: 0.05,
  });

  return !reduceMotion && pageVisible && isInView;
}
