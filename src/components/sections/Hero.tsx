"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useHorizontalSwipe } from "@/hooks/useHorizontalSwipe";
import {
  HERO_CAPTION_DELAY_S,
  HERO_CONTROLS_DELAY_S,
  HERO_ENTRANCE_DURATION_S,
  HERO_FIRST_SLIDE_DWELL_MS,
  HERO_IMAGE_DELAY_S,
  HOME_HERO_ENTRANCE_MS,
  HERO_REVEAL_EASE,
  HERO_SLIDE_BG_DURATION_S,
  HERO_SLIDE_CHANGE_DURATION_S,
  HERO_SLIDE_CHANGE_EASE,
  HERO_TEXT_DELAY_S,
} from "@/lib/home-entrance";
import type { HeroSlide } from "@/lib/frontpage-content";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";

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

function HeroPhotoOverlays() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/82 to-canvas/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-transparent to-hero-wash/25" />
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
            "radial-gradient(ellipse 55% 45% at 12% 75%, rgba(212,173,53,0.08) 0%, transparent 52%), radial-gradient(ellipse 40% 35% at 50% 100%, rgba(157,77,174,0.06) 0%, transparent 60%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-purple-mid/20 to-transparent" />
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

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const { cta } = useSiteChrome();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplayReady, setAutoplayReady] = useState(reduceMotion === true);
  const [hasSlideChanged, setHasSlideChanged] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);
  const activeRef = useRef(active);
  const entranceFinishedRef = useRef(reduceMotion === true);
  const autoplayDwellTimerRef = useRef<number | undefined>(undefined);
  const slideCount = slides.length;
  const nextSlideIndex = (active + 1) % slideCount;

  activeRef.current = active;

  const scheduleAutoplayReady = useCallback(() => {
    if (entranceFinishedRef.current || reduceMotion) return;
    entranceFinishedRef.current = true;
    clearTimeout(autoplayDwellTimerRef.current);
    autoplayDwellTimerRef.current = window.setTimeout(
      () => setAutoplayReady(true),
      HERO_FIRST_SLIDE_DWELL_MS,
    );
  }, [reduceMotion]);

  const togglePause = useCallback(() => {
    setPaused((current) => !current);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const normalized = (index + slideCount) % slideCount;
      if (normalized === activeRef.current) return;

      setSlideDirection(getSlideDirection(activeRef.current, normalized, slideCount));
      setHasSlideChanged(true);
      setActive(normalized);
    },
    [slideCount],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  const swipe = useHorizontalSwipe({
    enabled: slideCount > 1,
    onSwipeLeft: next,
    onSwipeRight: prev,
  });

  useEffect(() => {
    return () => clearTimeout(autoplayDwellTimerRef.current);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const fallback = window.setTimeout(
      scheduleAutoplayReady,
      HOME_HERO_ENTRANCE_MS + HERO_FIRST_SLIDE_DWELL_MS,
    );
    return () => window.clearTimeout(fallback);
  }, [reduceMotion, scheduleAutoplayReady]);

  useEffect(() => {
    if (reduceMotion || paused || !autoplayReady) return;

    const timer = window.setInterval(next, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [next, paused, reduceMotion, autoplayReady]);

  const slide = slides[active];

  return (
    <section
      className="site-scroll-section relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Hero highlights"
    >
      <div
        className={`relative h-[min(72vh,640px)] w-full md:h-[min(78vh,720px)] ${swipe.className}`}
        onPointerDown={swipe.onPointerDown}
        onPointerUp={swipe.onPointerUp}
        onPointerCancel={swipe.onPointerCancel}
      >
        <div className="absolute inset-0 bg-hero-light" aria-hidden />

        {slides.map((item, index) => {
          const isActive = index === active;
          const isEntrance = !entranceFinishedRef.current && index === 0 && active === 0;

          return (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : isEntrance
                  ? {
                      duration: HERO_ENTRANCE_DURATION_S,
                      delay: HERO_IMAGE_DELAY_S,
                      ease: HERO_REVEAL_EASE,
                    }
                  : {
                      duration: HERO_SLIDE_BG_DURATION_S,
                      ease: HERO_SLIDE_CHANGE_EASE,
                    }
            }
            onAnimationComplete={() => {
              if (isEntrance && isActive) {
                scheduleAutoplayReady();
              }
            }}
            style={{ zIndex: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
          >
            {item.variant === "illustrated" ? (
              <IllustratedSlideBackground
                image={"image" in item ? item.image : undefined}
                imageAlt={"imageAlt" in item ? item.imageAlt : undefined}
                imagePosition={"imagePosition" in item ? item.imagePosition : undefined}
                priority={index === active || index === nextSlideIndex}
              />
            ) : (
              <PhotoSlideBackground
                image={item.image}
                imageAlt={item.imageAlt}
                imagePosition={"imagePosition" in item ? item.imagePosition : undefined}
                priority={index === active || index === nextSlideIndex}
              />
            )}
          </motion.div>
          );
        })}

        <div className="absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-canvas to-transparent" />

        <div className="relative z-[1] grid h-full w-full grid-rows-[1fr_auto] px-6 pb-6 md:px-12 md:pb-20 lg:px-16 lg:pb-24">
          <div className="flex min-h-0 flex-col pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44">
            <div className="mt-auto w-full min-h-0">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={slide.id}
                className="w-full max-w-3xl"
                custom={{
                  direction: slideDirection,
                  isSlideChange: hasSlideChanged,
                }}
                variants={heroSlideTextVariants}
                initial={reduceMotion ? false : "enter"}
                animate={reduceMotion ? undefined : "center"}
                exit={reduceMotion ? undefined : "exit"}
                transition={{
                  duration: hasSlideChanged ? HERO_SLIDE_CHANGE_DURATION_S : 0.55,
                  delay: reduceMotion ? 0 : hasSlideChanged ? 0.06 : HERO_TEXT_DELAY_S,
                  ease: hasSlideChanged ? HERO_SLIDE_CHANGE_EASE : HERO_REVEAL_EASE,
                }}
              >
                <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold/78">
                  {slide.eyebrowSub}
                </p>

                <h1 className="font-serif text-[2.35rem] font-normal leading-[1.06] tracking-[-0.02em] text-purple-deep md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]">
                  {slide.title}{" "}
                  <span className="text-gold/92">{slide.titleAccent}</span>
                </h1>

                <p className="mt-5 max-w-lg text-[0.95rem] font-normal leading-[1.7] text-foreground/62 md:text-base md:leading-[1.75]">
                  {slide.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3.5">
                  {slide.buttons.map((button) =>
                    button.style === "primary" ? (
                      <GlowButton key={button.id} href={button.href}>
                        {button.label || cta}
                      </GlowButton>
                    ) : (
                      <GlowButton
                        key={button.id}
                        href={button.href}
                        variant="outline"
                        className="border-purple-deep/25 text-purple-deep hover:border-gold hover:text-gold"
                      >
                        {button.label}
                      </GlowButton>
                    ),
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            </div>
          </div>

          <div className="shrink-0">
            {"caption" in slide &&
            typeof slide.caption === "string" &&
            slide.caption.trim() ? (
              <div className="hidden md:ml-auto md:block md:max-w-xs md:text-right">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${slide.id}-caption`}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{
                      duration: 0.55,
                      delay: reduceMotion ? 0 : hasSlideChanged ? 0.08 : HERO_CAPTION_DELAY_S,
                      ease: HERO_REVEAL_EASE,
                    }}
                  >
                    <p className="font-serif text-base font-normal leading-snug text-purple-deep/72 md:text-lg">
                      {slide.caption}
                    </p>
                    {"captionSub" in slide &&
                    typeof slide.captionSub === "string" &&
                    slide.captionSub.trim() ? (
                      <p className="mt-1.5 text-[0.8rem] tracking-[0.02em] text-purple-deep/38">
                        {slide.captionSub}
                      </p>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : null}

            <motion.div
              className="mt-8 flex h-9 items-center gap-4 md:mt-10"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : HERO_CONTROLS_DELAY_S,
                ease: HERO_REVEAL_EASE,
              }}
            >
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
              {slides.map((item, index) => (
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
                      : "w-2 bg-purple-deep/25 hover:bg-purple-deep/45",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-deep/15 text-purple-deep/70 transition-colors hover:border-gold/50 hover:text-gold"
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-deep/15 bg-transparent text-purple-deep/75 transition-colors hover:border-gold/50 hover:text-gold"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-deep/15 text-purple-deep/70 transition-colors hover:border-gold/50 hover:text-gold"
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
