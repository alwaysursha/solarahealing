"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  createFollowerStar,
  createLeadStar,
  eventGapDelay,
  isPairEvent,
  pairStaggerDelay,
  type ShootingStarConfig,
} from "@/lib/courses-shooting-stars";

type FlyingStar = {
  id: number;
  config: ShootingStarConfig;
};

const MAX_STARS = 2;

export function CoursesShootingStars() {
  const [flying, setFlying] = useState<FlyingStar[]>([]);
  const idRef = useRef(0);
  const seedRef = useRef(1);
  const activeCountRef = useRef(0);
  const clearWaitRef = useRef<(() => void) | null>(null);

  const spawn = useCallback((config: ShootingStarConfig) => {
    if (activeCountRef.current >= MAX_STARS) return;
    const id = ++idRef.current;
    activeCountRef.current += 1;
    setFlying((prev) => (prev.length >= MAX_STARS ? prev : [...prev, { id, config }]));
  }, []);

  const onStarEnd = useCallback((id: number) => {
    setFlying((prev) => prev.filter((star) => star.id !== id));
    activeCountRef.current = Math.max(0, activeCountRef.current - 1);
    if (activeCountRef.current === 0 && clearWaitRef.current) {
      clearWaitRef.current();
      clearWaitRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(
          setTimeout(() => {
            if (!cancelled) resolve();
          }, ms),
        );
      });

    const waitForSkyClear = () =>
      new Promise<void>((resolve) => {
        if (activeCountRef.current === 0) {
          resolve();
          return;
        }
        clearWaitRef.current = resolve;
      });

    const runLoop = async () => {
      while (!cancelled) {
        const seed = seedRef.current++;
        const lead = createLeadStar(seed);
        spawn(lead);

        if (isPairEvent(seed)) {
          await wait(pairStaggerDelay(seed) * 1000);
          if (cancelled) return;
          if (activeCountRef.current < MAX_STARS) {
            spawn(createFollowerStar(seed + 5000, lead));
          }
        }

        await waitForSkyClear();
        if (cancelled) return;

        await wait(eventGapDelay(seed) * 1000);
      }
    };

    runLoop();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      clearWaitRef.current = null;
    };
  }, [spawn]);

  return (
    <>
      {flying.map((star) => (
        <span
          key={star.id}
          className="courses-space-shooting-star absolute"
          style={
            {
              top: `${star.config.top}%`,
              left: `${star.config.left}%`,
              "--shoot-angle": `${star.config.angle}deg`,
              "--shoot-duration": `${star.config.duration}s`,
              "--shoot-distance-x": `${star.config.distanceX}px`,
              "--shoot-distance-y": `${star.config.distanceY}px`,
            } as CSSProperties
          }
          onAnimationEnd={() => onStarEnd(star.id)}
        />
      ))}
    </>
  );
}
