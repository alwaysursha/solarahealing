"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  HERO_CAPTION_DELAY_S,
  HERO_CONTROLS_DELAY_S,
  HERO_ENTRANCE_DURATION_S,
  HERO_IMAGE_DELAY_S,
  HERO_REVEAL_EASE,
  HERO_SLIDE_BG_DURATION_S,
  HERO_SLIDE_CHANGE_DURATION_S,
  HERO_SLIDE_CHANGE_EASE,
  HERO_TEXT_DELAY_S,
} from "@/lib/home-entrance";
import { heroSlides, site } from "@/lib/site";

const AUTO_PLAY_MS = 6500;

type SlideMotionCustom = {
  direction: number;
  isSlideChange: boolean;
};

const heroSlideTextVariants = {
  enter: ({ direction, isSlideChange }: SlideMotionCustom) =>
    isSlideChange
      ? { opacity: 0, x: direction * 26 }
      : { opacity: 0, y: 20 },
  center: { opacity: 1, x: 0, y: 0 },
  exit: ({ direction, isSlideChange }: SlideMotionCustom) =>
    isSlideChange
      ? { opacity: 0, x: direction * -26 }
      : { opacity: 0, y: -12 },
};

function getSlideDirection(from: number, to: number, count: number) {
  if (from === to) return 1;

  const forward = (to - from + count) % count;
  const backward = (from - to + count) % count;
  return forward <= backward ? 1 : -1;
}

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

function HeroPhotoOverlays() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/82 to-canvas/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-accent-soft/20" />
    </>
  );
}

function IllustratedSlideBackground({
  image,
  imageAlt,
  priority,
  imagePosition = "94% center",
}: {
  image?: string;
  imageAlt?: string;
  priority?: boolean;
  imagePosition?: string;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-hero-light" />
      {image && imageAlt ? (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <HeroPhotoOverlays />
        </>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 12% 75%, rgba(201,162,39,0.08) 0%, transparent 52%), radial-gradient(ellipse 40% 35% at 50% 100%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="pointer-events-none absolute -right-[8%] top-[8%] z-[2] hidden text-accent/25 md:block lg:-right-[4%]">
        <LotusVisual className="h-[min(52vw,420px)] w-[min(52vw,420px)]" />
      </div>
      <div className="pointer-events-none absolute right-[5%] top-[16%] z-[2] text-accent/20 md:hidden">
        <LotusVisual className="h-44 w-44" />
      </div>
    </>
  );
}

function PhotoSlideBackground({
  image,
  imageAlt,
  priority,
  imagePosition = "68% center",
}: {
  image: string;
  imageAlt: string;
  priority?: boolean;
  imagePosition?: string;
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
        style={{ objectPosition: imagePosition }}
      />
      <HeroPhotoOverlays />
    </>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(reduceMotion === true);
  const [slideDirection, setSlideDirection] = useState(1);
  const activeRef = useRef(active);
  const slideCount = heroSlides.length;

  activeRef.current = active;

  const togglePause = useCallback(() => {
    setPaused((current) => !current);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const normalized = (index + slideCount) % slideCount;
      setSlideDirection(getSlideDirection(activeRef.current, normalized, slideCount));
      setActive(normalized);
    },
    [slideCount],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (reduceMotion) {
      setEntranceComplete(true);
      return;
    }

    const timer = window.setTimeout(
      () => setEntranceComplete(true),
      (HERO_IMAGE_DELAY_S + HERO_ENTRANCE_DURATION_S) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || paused || !entranceComplete) return;

    const timer = window.setInterval(next, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [next, paused, reduceMotion, entranceComplete]);

  const slide = heroSlides[active];

  return (
    <section
      className="site-scroll-section relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Hero highlights"
    >
      <div className="relative h-[min(72vh,640px)] w-full md:h-[min(78vh,720px)]">
        <div className="absolute inset-0 bg-hero-light" aria-hidden />

        {heroSlides.map((item, index) => (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={entranceComplete ? false : { opacity: 0 }}
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={
              entranceComplete
                ? {
                    duration: reduceMotion ? 0 : HERO_SLIDE_BG_DURATION_S,
                    ease: HERO_SLIDE_CHANGE_EASE,
                  }
                : {
                    duration: reduceMotion ? 0 : HERO_ENTRANCE_DURATION_S,
                    delay: reduceMotion || index !== active ? 0 : HERO_IMAGE_DELAY_S,
                    ease: HERO_REVEAL_EASE,
                  }
            }
            style={{ zIndex: index === active ? 1 : 0 }}
            aria-hidden={index !== active}
          >
            {item.variant === "illustrated" ? (
              <IllustratedSlideBackground
                image={"image" in item ? item.image : undefined}
                imageAlt={"imageAlt" in item ? item.imageAlt : undefined}
                imagePosition={"imagePosition" in item ? item.imagePosition : undefined}
                priority={index === 0}
              />
            ) : (
              <PhotoSlideBackground
                image={item.image}
                imageAlt={item.imageAlt}
                imagePosition={"imagePosition" in item ? item.imagePosition : undefined}
                priority={index === 0}
              />
            )}
          </motion.div>
        ))}

        <div className="absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-canvas to-transparent" />

        <div className="relative z-[1] grid h-full w-full grid-rows-[1fr_auto] px-6 pb-16 md:px-12 md:pb-20 lg:px-16 lg:pb-24">
          <div className="flex min-h-0 flex-col pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44">
            <div className="mt-auto w-full min-h-0">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={slide.id}
                className="w-full max-w-3xl"
                custom={{
                  direction: slideDirection,
                  isSlideChange: entranceComplete,
                }}
                variants={heroSlideTextVariants}
                initial={reduceMotion ? false : "enter"}
                animate={reduceMotion ? undefined : "center"}
                exit={reduceMotion ? undefined : "exit"}
                transition={{
                  duration: entranceComplete
                    ? HERO_SLIDE_CHANGE_DURATION_S
                    : 0.55,
                  delay: reduceMotion
                    ? 0
                    : entranceComplete
                      ? 0.06
                      : HERO_TEXT_DELAY_S,
                  ease: entranceComplete ? HERO_SLIDE_CHANGE_EASE : HERO_REVEAL_EASE,
                }}
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
            </div>
          </div>

          <div className="shrink-0">
            <div className="hidden h-[5.25rem] md:ml-auto md:block md:max-w-xs md:text-right">
              <AnimatePresence mode="wait">
                {slide.variant === "illustrated" && "caption" in slide && (
                  <motion.div
                    key={`${slide.id}-caption`}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.55,
                      delay: reduceMotion
                        ? 0
                        : entranceComplete
                          ? 0.08
                          : HERO_CAPTION_DELAY_S,
                      ease: HERO_REVEAL_EASE,
                    }}
                  >
                    <p className="font-display text-lg text-accent/85 md:text-xl">
                      {slide.caption}
                    </p>
                    <p className="mt-1 text-sm text-accent/45">{slide.captionSub}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="mt-8 flex h-9 items-center gap-4 md:mt-10"
              initial={false}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : HERO_CONTROLS_DELAY_S,
                ease: HERO_REVEAL_EASE,
              }}
            >
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
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
