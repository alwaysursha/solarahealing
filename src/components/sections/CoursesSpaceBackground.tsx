"use client";

import { useReducedMotion } from "framer-motion";
import { NIGHT_STARFIELD } from "@/lib/courses-night-stars";
import { CoursesShootingStars } from "@/components/sections/CoursesShootingStars";
import { useCompositorProfile } from "@/lib/compositor-profile";

const STARS = [
  { x: "5%", y: "10%", size: 2, delay: 0, opacity: 0.55 },
  { x: "11%", y: "28%", size: 1.5, delay: 1.2, opacity: 0.42 },
  { x: "18%", y: "6%", size: 1, delay: 2.4, opacity: 0.35 },
  { x: "24%", y: "18%", size: 2.5, delay: 0.6, opacity: 0.52 },
  { x: "30%", y: "42%", size: 1, delay: 3.1, opacity: 0.32 },
  { x: "36%", y: "12%", size: 1.5, delay: 1.8, opacity: 0.46 },
  { x: "43%", y: "58%", size: 2, delay: 2.2, opacity: 0.4 },
  { x: "49%", y: "24%", size: 1, delay: 0.3, opacity: 0.36 },
  { x: "55%", y: "68%", size: 1.5, delay: 2.8, opacity: 0.44 },
  { x: "61%", y: "14%", size: 2, delay: 1.1, opacity: 0.5 },
  { x: "67%", y: "38%", size: 1, delay: 3.6, opacity: 0.34 },
  { x: "73%", y: "8%", size: 1.5, delay: 0.9, opacity: 0.4 },
  { x: "79%", y: "52%", size: 2, delay: 2.1, opacity: 0.46 },
  { x: "85%", y: "26%", size: 1, delay: 1.5, opacity: 0.32 },
  { x: "91%", y: "72%", size: 1.5, delay: 2.6, opacity: 0.38 },
  { x: "8%", y: "76%", size: 1, delay: 3.3, opacity: 0.3 },
  { x: "22%", y: "84%", size: 2, delay: 0.4, opacity: 0.42 },
  { x: "38%", y: "90%", size: 1, delay: 1.9, opacity: 0.33 },
  { x: "52%", y: "82%", size: 1.5, delay: 2.5, opacity: 0.37 },
  { x: "64%", y: "88%", size: 1, delay: 3.8, opacity: 0.3 },
  { x: "76%", y: "80%", size: 2, delay: 0.7, opacity: 0.4 },
  { x: "88%", y: "92%", size: 1, delay: 1.4, opacity: 0.28 },
  { x: "96%", y: "44%", size: 1.5, delay: 2.9, opacity: 0.35 },
  { x: "3%", y: "48%", size: 1, delay: 3.5, opacity: 0.3 },
  { x: "14%", y: "62%", size: 1.5, delay: 0.2, opacity: 0.38 },
  { x: "33%", y: "32%", size: 1, delay: 1.7, opacity: 0.34 },
  { x: "58%", y: "46%", size: 1, delay: 2.3, opacity: 0.31 },
  { x: "82%", y: "64%", size: 1.5, delay: 3.0, opacity: 0.36 },
  { x: "47%", y: "4%", size: 1, delay: 1.0, opacity: 0.33 },
  { x: "70%", y: "58%", size: 1, delay: 2.7, opacity: 0.29 },
] as const;

const DEEP_STARS = [
  { x: "12%", y: "22%", size: 0.75, delay: 0.5, opacity: 0.2 },
  { x: "28%", y: "54%", size: 0.75, delay: 1.6, opacity: 0.18 },
  { x: "44%", y: "36%", size: 0.75, delay: 2.1, opacity: 0.16 },
  { x: "60%", y: "74%", size: 0.75, delay: 0.8, opacity: 0.2 },
  { x: "74%", y: "30%", size: 0.75, delay: 2.9, opacity: 0.17 },
  { x: "86%", y: "48%", size: 0.75, delay: 1.3, opacity: 0.19 },
  { x: "20%", y: "68%", size: 0.75, delay: 3.2, opacity: 0.15 },
  { x: "52%", y: "16%", size: 0.75, delay: 2.4, opacity: 0.18 },
  { x: "68%", y: "92%", size: 0.75, delay: 0.3, opacity: 0.16 },
  { x: "92%", y: "18%", size: 0.75, delay: 1.9, opacity: 0.17 },
] as const;

/** Bottom-left (closest) → top-right (farthest) */
const PLANETS = [
  { id: "a", drift: "courses-space-planet-drift-a" },
  { id: "b", drift: "courses-space-planet-drift-b" },
  { id: "c", drift: "courses-space-planet-drift-c" },
] as const;

type CoursesSpaceBackgroundProps = {
  animationsActive: boolean;
  cosmosEnabled: boolean;
  staticNight?: boolean;
};

export function CoursesSpaceBackground({
  animationsActive,
  cosmosEnabled,
  staticNight = false,
}: CoursesSpaceBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const chromeTouch = useCompositorProfile() === "chrome-touch";
  const motionEnabled = animationsActive && cosmosEnabled && !reduceMotion;
  const shootingStarsEnabled = motionEnabled && !chromeTouch;
  const layersMounted = cosmosEnabled && !reduceMotion;
  const chromeStaticNight = staticNight && layersMounted;

  return (
    <>
    <div className="courses-cosmos-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {layersMounted && <div className="courses-cosmos-night-veil absolute inset-0" />}

      <div className="courses-cosmos-celestial absolute inset-0 overflow-hidden">
        <div
          className={`courses-space courses-space-deep absolute inset-0 overflow-hidden${layersMounted && !chromeStaticNight ? " courses-space-parallax-deep" : ""}`}
        >
          <div className="courses-space-nebula absolute inset-0" />
          <div className="courses-space-void absolute inset-0" />

          {!chromeStaticNight &&
            DEEP_STARS.map((star, index) => (
              <span
                key={`deep-star-${index}`}
                className={`courses-space-star courses-space-star-deep absolute rounded-full bg-white ${layersMounted ? "courses-space-star-twinkle" : ""}`}
                style={{
                  left: star.x,
                  top: star.y,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
        </div>

        {!chromeStaticNight && (
          <div
            className={`courses-space courses-space-mid absolute inset-0 overflow-hidden${layersMounted ? " courses-space-parallax-mid" : ""}`}
          >
            {STARS.map((star, index) => (
              <span
                key={`star-${index}`}
                className={`courses-space-star absolute rounded-full bg-white ${layersMounted ? "courses-space-star-twinkle" : ""}`}
                style={{
                  left: star.x,
                  top: star.y,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}

            <div className={`courses-space-dust absolute inset-0${layersMounted ? " courses-space-dust-drift" : ""}`} />
          </div>
        )}

        {!chromeStaticNight && (
          <div className="courses-space-planets-arc absolute inset-0">
            {PLANETS.map((planet) => (
              <div
                key={planet.id}
                className={`courses-space-planet courses-space-planet-${planet.id} absolute ${layersMounted ? planet.drift : ""}`}
              />
            ))}
          </div>
        )}
      </div>

      {layersMounted && (
        <div className="courses-cosmos-night-stars absolute inset-0 overflow-hidden">
          {NIGHT_STARFIELD.map((star, index) => {
            const twinkles = chromeStaticNight ? index % 5 === 0 || index % 7 === 2 : index % 14 === 0;
            return (
              <span
                key={`night-star-${index}`}
                className={`courses-night-star absolute rounded-full bg-white ${twinkles ? "courses-night-star-twinkle" : ""}`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                  animationDelay: twinkles ? `${((index * 0.17) % 4.2) + (index % 11) * 0.19}s` : undefined,
                }}
              />
            );
          })}
        </div>
      )}

      {layersMounted && <div className="courses-cosmos-night-glow absolute inset-0" />}

      <div
        className={`courses-cosmos-depth-fog absolute inset-0${layersMounted && !chromeStaticNight ? " courses-cosmos-depth-fog-cycle" : ""}`}
      />
    </div>

    {shootingStarsEnabled && (
      <div className="courses-cosmos-shooting-layer pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
        <CoursesShootingStars />
      </div>
    )}
  </>
  );
}
