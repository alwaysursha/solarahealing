"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { heroSlides, site } from "@/lib/site";

const AUTO_PLAY_MS = 6500;

function LotusVisual({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={angle}
          cx="100"
          cy="100"
          rx="30"
          ry="70"
          fill="currentColor"
          opacity={0.2 + (i % 3) * 0.06}
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.35" />
      <circle cx="100" cy="100" r="8" fill="currentColor" className="text-gold" opacity="0.85" />
    </svg>
  );
}

function IllustratedSlideBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-hero-light" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 88% 28%, rgba(67,56,202,0.1) 0%, transparent 58%), radial-gradient(ellipse 55% 45% at 12% 75%, rgba(201,162,39,0.08) 0%, transparent 52%), radial-gradient(ellipse 40% 35% at 50% 100%, rgba(99,102,241,0.08) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="pointer-events-none absolute -right-[8%] top-[8%] hidden text-accent/25 md:block lg:-right-[4%]">
        <LotusVisual className="h-[min(52vw,420px)] w-[min(52vw,420px)]" />
      </div>
      <div className="pointer-events-none absolute right-[5%] top-[16%] text-accent/20 md:hidden">
        <LotusVisual className="h-44 w-44" />
      </div>
    </>
  );
}

function PhotoSlideBackground({
  image,
  imageAlt,
  priority,
}: {
  image: string;
  imageAlt: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/82 to-canvas/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-accent-soft/20" />
    </>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = heroSlides.length;

  const togglePause = useCallback(() => {
    setPaused((current) => !current);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActive((index + slideCount) % slideCount);
    },
    [slideCount],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (reduceMotion || paused) return;

    const timer = window.setInterval(next, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [next, paused, reduceMotion]);

  const slide = heroSlides[active];

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Hero highlights"
    >
      <div className="relative min-h-[min(72vh,640px)] w-full md:min-h-[min(78vh,720px)]">
        {heroSlides.map((item, index) => (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" }}
            style={{ zIndex: index === active ? 1 : 0 }}
            aria-hidden={index !== active}
          >
            {item.variant === "illustrated" ? (
              <IllustratedSlideBackground />
            ) : (
              <PhotoSlideBackground
                image={item.image}
                imageAlt={item.imageAlt}
                priority={index === 0}
              />
            )}
          </motion.div>
        ))}

        <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-canvas to-transparent" />

        <div className="relative z-20 flex min-h-[inherit] w-full flex-col justify-end px-6 pb-16 pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-16 lg:pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="w-full max-w-3xl"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                {slide.eyebrowSub}
              </p>

              <h1 className="font-display text-4xl font-semibold leading-[1.08] text-accent md:text-5xl lg:text-6xl xl:text-7xl">
                {slide.title}{" "}
                <span className="text-gold">{slide.titleAccent}</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-accent/75 md:text-lg">
                {slide.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <GlowButton href="#contact">{site.cta}</GlowButton>
                <GlowButton
                  href="#sessions"
                  variant="outline"
                  className="border-accent/25 text-accent hover:border-gold hover:text-gold"
                >
                  Explore Sessions
                </GlowButton>
              </div>
            </motion.div>
          </AnimatePresence>

          {slide.variant === "illustrated" && "caption" in slide && (
            <div className="absolute bottom-14 right-6 hidden max-w-xs text-right md:block lg:right-16 lg:bottom-20">
              <p className="font-display text-lg text-accent/85 md:text-xl">
                {slide.caption}
              </p>
              <p className="mt-1 text-sm text-accent/45">{slide.captionSub}</p>
            </div>
          )}

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
              {heroSlides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Go to slide ${index + 1}: ${item.title} ${item.titleAccent}`}
                  onClick={() => goTo(index)}
                  className={[
                    "h-2 rounded-full transition-all duration-300",
                    index === active
                      ? "w-8 bg-gold"
                      : "w-2 bg-accent/25 hover:bg-accent/45",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/15 text-accent/70 transition-colors hover:border-gold/50 hover:text-gold"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {!reduceMotion && (
                <button
                  type="button"
                  onClick={togglePause}
                  aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                  aria-pressed={paused}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/15 bg-transparent text-accent/75 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  {paused ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                      <path d="M7.5 5.44v9.12L14.25 10 7.5 5.44Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                      <path d="M6.75 4.5a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75v-9.5a.75.75 0 0 0-.75-.75h-1.5Zm5.25 0a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75v-9.5a.75.75 0 0 0-.75-.75h-1.5Z" />
                    </svg>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/15 text-accent/70 transition-colors hover:border-gold/50 hover:text-gold"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
