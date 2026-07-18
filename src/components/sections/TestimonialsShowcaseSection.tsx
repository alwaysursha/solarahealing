"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import {
  testimonials,
  testimonialsIntro,
  type Testimonial,
} from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTO_MS = 5600;
const SWIPE_THRESHOLD = 48;
const SWIPE_VELOCITY = 320;

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 40" fill="currentColor" aria-hidden>
      <path d="M16.2 0C8.4 0 2 6.1 2 14.2c0 7.4 4.8 13.8 11.6 16.1-.3-2.8-.1-6 1.6-8.8 2.2-3.6 6.2-6 10.4-6.8C21.4 2.2 18.8 0 16.2 0zm29.6 0c-7.8 0-14.2 6.1-14.2 14.2 0 7.4 4.8 13.8 11.6 16.1-.3-2.8-.1-6 1.6-8.8 2.2-3.6 6.2-6 10.4-6.8C51 2.2 48.4 0 45.8 0z" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function relativeOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function TestimonialSlideCard({
  item,
  offset,
  reduceMotion,
}: {
  item: Testimonial;
  offset: number;
  reduceMotion: boolean;
}) {
  const abs = Math.abs(offset);
  const isActive = offset === 0;

  return (
    <motion.article
      className={[
        "testimonial-carousel-card",
        isActive ? "testimonial-carousel-card-active" : "",
      ].join(" ")}
      style={{ zIndex: 20 - abs }}
      initial={false}
      animate={
        reduceMotion
          ? {
              opacity: isActive ? 1 : 0,
              x: "0%",
              scale: 1,
              rotateY: 0,
              filter: "blur(0px)",
            }
          : {
              opacity: abs > 1 ? 0 : abs === 1 ? 0.5 : 1,
              x: `${offset * 52}%`,
              scale: abs === 0 ? 1 : abs === 1 ? 0.84 : 0.7,
              rotateY: offset * -12,
              filter: abs === 0 ? "blur(0px)" : abs === 1 ? "blur(0.8px)" : "blur(2.5px)",
            }
      }
      transition={{ duration: 0.7, ease }}
      aria-hidden={!isActive}
    >
      <div className="testimonial-card-inner testimonial-carousel-card-inner relative overflow-hidden rounded-[1.75rem] border border-purple-deep/8 bg-white p-7 md:p-9">
        <div className="testimonial-card-corner testimonial-card-corner-tl" aria-hidden />
        <div className="testimonial-card-corner testimonial-card-corner-br" aria-hidden />
        <QuoteMark className="testimonial-quote-icon h-10 w-10 text-gold/35" />
        <p className="font-serif mt-5 text-[1.12rem] font-normal leading-[1.65] tracking-[-0.01em] text-purple-deep/85 md:text-[1.28rem]">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="testimonial-card-rule mt-6 h-px w-full bg-gradient-to-r from-gold/70 via-gold/25 to-transparent" />
        <footer className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-medium text-purple-deep">{item.name}</p>
            <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-purple-deep/45">
              {item.location}
            </p>
          </div>
          <Stars />
        </footer>
      </div>
    </motion.article>
  );
}

export function TestimonialsShowcaseSection({
  intro = testimonialsIntro,
  items = testimonials,
}: {
  intro?: typeof testimonialsIntro;
  items?: readonly Testimonial[];
}) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);
  const animationsActive = useAnimationsActive(sectionRef);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const count = items.length;

  const goTo = useCallback(
    (next: number, dir?: number) => {
      if (count < 1) return;
      const wrapped = wrapIndex(next, count);
      setDirection(dir ?? (wrapped > active ? 1 : -1));
      setActive(wrapped);
    },
    [active, count],
  );

  const goNext = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  useEffect(() => {
    if (reduceMotion || paused || count < 2 || !animationsActive) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActive((current) => wrapIndex(current + 1, count));
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [animationsActive, count, paused, reduceMotion]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (isEditableTarget(event.target)) return;

      const stageFocused = stageRef.current?.contains(document.activeElement as Node | null);
      if (!stageFocused && !inViewRef.current) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, goNext, goPrev]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY) {
      goNext();
      return;
    }
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY) {
      goPrev();
    }
  };

  const onStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const activeItem = items[active] ?? items[0];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`testimonial-showcase relative overflow-x-clip bg-canvas px-5 py-20 sm:px-8 md:py-24 lg:px-12 lg:py-28 xl:px-14 ${animationsActive ? "" : "animations-paused"}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="testimonial-showcase-ornament pointer-events-none absolute left-1/2 top-12 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/35 to-transparent"
        aria-hidden
      />
      <div className="testimonial-carousel-aura pointer-events-none absolute inset-x-0 top-[38%] h-64 -translate-y-1/2" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease }}
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gold">
            {intro.eyebrow}
          </p>
          <h2 className="font-serif mt-4 text-[2.2rem] font-normal leading-[1.06] tracking-[-0.02em] text-purple-deep md:text-5xl">
            {intro.title}
            <span className="mt-1 block bg-gradient-to-r from-purple-deep via-purple-mid to-gold bg-clip-text italic text-transparent">
              {intro.titleAccent}
            </span>
          </h2>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold/50 bg-gold/20" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
          </div>
          <p className="mt-6 text-base leading-relaxed text-purple-deep/60 md:text-[1.02rem]">
            {intro.description}
          </p>
        </motion.div>

        <div className="testimonial-carousel mt-10 md:mt-12">
          <div
            ref={stageRef}
            className="testimonial-carousel-stage"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={0}
            onKeyDown={onStageKeyDown}
          >
            <AnimatePresence initial={false} mode="sync">
              {items.map((item, index) => {
                const offset = relativeOffset(index, active, count);
                if (Math.abs(offset) > 1 && !reduceMotion) return null;
                if (reduceMotion && offset !== 0) return null;
                return (
                  <TestimonialSlideCard
                    key={`${item.name}-${item.location}`}
                    item={item}
                    offset={offset}
                    reduceMotion={!!reduceMotion}
                  />
                );
              })}
            </AnimatePresence>

            <motion.div
              className="testimonial-carousel-drag"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              dragMomentum={false}
              onDragEnd={onDragEnd}
              aria-hidden
              tabIndex={-1}
              aria-label={`Testimonial from ${activeItem?.name ?? "client"}`}
            />
          </div>

          <div className="testimonial-carousel-controls">
            <button
              type="button"
              className="testimonial-carousel-nav"
              onClick={goPrev}
              aria-label="Previous testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 6 9 12l6 6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="testimonial-carousel-dots" role="tablist" aria-label="Testimonial slides">
              {items.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={`${item.name}-dot`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={`Show testimonial from ${item.name}`}
                    className={[
                      "testimonial-carousel-dot",
                      selected ? "testimonial-carousel-dot-active" : "",
                    ].join(" ")}
                    onClick={() => goTo(index, index > active ? 1 : -1)}
                  >
                    {selected && !reduceMotion ? (
                      <motion.span
                        key={`progress-${active}-${paused ? "paused" : "run"}`}
                        className="testimonial-carousel-dot-progress"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? 0 : 1 }}
                        transition={{
                          duration: paused ? 0.2 : AUTO_MS / 1000,
                          ease: "linear",
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="testimonial-carousel-nav"
              onClick={goNext}
              aria-label="Next testimonial"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="m9 6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className="testimonial-carousel-count" aria-hidden>
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="testimonial-carousel-count-sep">/</span>
            <span>{String(count).padStart(2, "0")}</span>
          </p>
        </div>

        <motion.p
          className="mt-12 text-center font-serif text-sm italic text-purple-deep/35 md:mt-14"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          सत्यम् शिवम् सुन्दरम् — Truth, consciousness, and beauty in every healing journey
        </motion.p>
      </div>

      <span className="sr-only" aria-live="polite">
        Showing testimonial {active + 1} of {count}
        {direction > 0 ? ", next" : ", previous"}
      </span>
    </section>
  );
}
