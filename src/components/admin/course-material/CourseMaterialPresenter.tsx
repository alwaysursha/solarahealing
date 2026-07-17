"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type CourseMaterialDeck,
  type CourseMaterialSlide,
} from "@/lib/admin/course-material";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SWIPE_THRESHOLD = 48;
const SESSION_MS = 60 * 60 * 1000;

const slideContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const slideItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

const slideMedia = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const slideSoft = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, ease },
  },
};

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

function SlideSessionStart({
  slide,
  showStartSession,
  onStartSession,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "session-start" }>;
  showStartSession?: boolean;
  onStartSession?: () => void;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-session-start"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-slide-session-main">
        <motion.div variants={reduceMotion ? undefined : slideMedia}>
          <Image
            src={slide.logo.src}
            alt={slide.logo.alt}
            width={slide.logo.width}
            height={slide.logo.height}
            className="cm-slide-logo cm-slide-logo-session"
            quality={95}
            priority
          />
        </motion.div>
        <motion.div
          className="cm-slide-session-heading"
          variants={reduceMotion ? undefined : slideContainer}
        >
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
          <motion.h1 className="cm-slide-title cm-slide-title-session" variants={reduceMotion ? undefined : slideItem}>
            {slide.title}
          </motion.h1>
        </motion.div>
      </div>
      {showStartSession && onStartSession ? (
        <motion.div className="cm-slide-cover-actions" variants={reduceMotion ? undefined : slideItem}>
          <span className="cm-slide-start-session-wrap">
            {!reduceMotion ? (
              <span className="cm-slide-start-session-glow" aria-hidden />
            ) : null}
            <motion.button
              type="button"
              className="cm-slide-start-session"
              onClick={onStartSession}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            >
              {!reduceMotion ? (
                <span className="cm-slide-start-session-shine" aria-hidden />
              ) : null}
              <span className="relative">Start Session</span>
            </motion.button>
          </span>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function SlideCover({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "cover" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-cover"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      {slide.logo ? (
        <motion.div variants={reduceMotion ? undefined : slideMedia}>
          <Image
            src={slide.logo.src}
            alt={slide.logo.alt}
            width={slide.logo.width}
            height={slide.logo.height}
            className="cm-slide-logo"
            quality={95}
            priority
          />
        </motion.div>
      ) : null}
      <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
        {slide.eyebrow}
      </motion.p>
      <motion.h1 className="cm-slide-title" variants={reduceMotion ? undefined : slideItem}>
        {slide.title}
      </motion.h1>
      <motion.p className="cm-slide-subtitle" variants={reduceMotion ? undefined : slideItem}>
        {slide.subtitle}
      </motion.p>
      <motion.div className="cm-slide-rule" aria-hidden variants={reduceMotion ? undefined : slideSoft} />
      <motion.p className="cm-slide-teacher" variants={reduceMotion ? undefined : slideItem}>
        {slide.teacher}
      </motion.p>
      <motion.p className="cm-slide-roles" variants={reduceMotion ? undefined : slideItem}>
        {slide.teacherRoles}
      </motion.p>
      <motion.p className="cm-slide-journey" variants={reduceMotion ? undefined : slideItem}>
        {slide.journeyLine}
      </motion.p>
      <motion.div className="cm-slide-cover-actions" variants={reduceMotion ? undefined : slideItem}>
        <p className="cm-slide-duration">{slide.duration}</p>
      </motion.div>
    </motion.div>
  );
}

function SlideBullets({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "bullets" }>;
  reduceMotion: boolean;
}) {
  const hasImage = Boolean(slide.image);

  return (
    <motion.div
      className={[
        "cm-slide cm-slide-bullets",
        hasImage ? "cm-slide-bullets-media" : "",
      ].join(" ")}
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      {hasImage && slide.image ? (
        <motion.div className="cm-slide-media" variants={reduceMotion ? undefined : slideMedia}>
          <div className="cm-slide-media-frame">
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              className="cm-slide-media-img"
              quality={95}
              priority
            />
            <span className="cm-slide-media-glow" aria-hidden />
          </div>
        </motion.div>
      ) : null}

      <div className="cm-slide-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        {slide.lead ? (
          <motion.p className="cm-slide-lead" variants={reduceMotion ? undefined : slideItem}>
            {slide.lead}
          </motion.p>
        ) : null}
        <motion.ul className="cm-slide-list" variants={reduceMotion ? undefined : slideContainer}>
          {slide.items.map((item) => (
            <motion.li key={item} variants={reduceMotion ? undefined : slideItem}>
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

function SlideQuote({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "quote" }>;
  reduceMotion: boolean;
}) {
  const hasImage = Boolean(slide.image);

  return (
    <motion.div
      className={["cm-slide cm-slide-quote", hasImage ? "cm-slide-quote-media" : ""].join(" ")}
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-slide-copy cm-slide-quote-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.blockquote className="cm-slide-blockquote" variants={reduceMotion ? undefined : slideItem}>
          &ldquo;{slide.quote}&rdquo;
        </motion.blockquote>
      </div>

      {hasImage && slide.image ? (
        <motion.div className="cm-slide-media" variants={reduceMotion ? undefined : slideMedia}>
          <div className="cm-slide-media-frame cm-slide-media-frame-wide">
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              className="cm-slide-media-img"
              quality={95}
              priority
            />
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function SlideDefinition({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "definition" }>;
  reduceMotion: boolean;
}) {
  const hasImage = Boolean(slide.image);

  return (
    <motion.div
      className={[
        "cm-slide cm-slide-definition",
        hasImage ? "cm-slide-definition-media" : "",
      ].join(" ")}
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      {hasImage && slide.image ? (
        <motion.div className="cm-slide-media" variants={reduceMotion ? undefined : slideMedia}>
          <div className="cm-slide-media-frame">
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              className="cm-slide-media-img"
              quality={95}
              priority
            />
            <span className="cm-slide-media-glow" aria-hidden />
          </div>
        </motion.div>
      ) : null}

      <div className="cm-slide-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        {slide.lead ? (
          <motion.p className="cm-slide-lead" variants={reduceMotion ? undefined : slideItem}>
            {slide.lead}
          </motion.p>
        ) : null}
        <motion.div className="cm-definition-grid" variants={reduceMotion ? undefined : slideContainer}>
          {slide.columns.map((column) => (
            <motion.div
              key={column.term}
              className="cm-definition-card"
              variants={reduceMotion ? undefined : slideItem}
            >
              <p className="cm-definition-term">{column.term}</p>
              <p className="cm-definition-meaning">{column.meaning}</p>
              <ul>
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <motion.p className="cm-definition-result" variants={reduceMotion ? undefined : slideItem}>
          {slide.result}
        </motion.p>
      </div>
    </motion.div>
  );
}

function SlideImpactGrid({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "impact-grid" }>;
  reduceMotion: boolean;
}) {
  const hasImage = Boolean(slide.image);

  return (
    <motion.div
      className={[
        "cm-slide cm-slide-impact",
        hasImage ? "cm-slide-impact-media" : "",
      ].join(" ")}
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-slide-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
      </div>

      {hasImage && slide.image ? (
        <motion.div
          className="cm-slide-media cm-slide-media-between"
          variants={reduceMotion ? undefined : slideMedia}
        >
          <div className="cm-slide-media-frame cm-slide-media-frame-wide">
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              className="cm-slide-media-img"
              quality={100}
              unoptimized
              priority
            />
          </div>
        </motion.div>
      ) : null}

      <motion.ul className="cm-impact-grid" variants={reduceMotion ? undefined : slideContainer}>
        {slide.items.map((item) => (
          <motion.li key={item} variants={reduceMotion ? undefined : slideItem}>
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function SlideView({
  slide,
  showStartSession,
  onStartSession,
  reduceMotion,
}: {
  slide: CourseMaterialSlide;
  showStartSession?: boolean;
  onStartSession?: () => void;
  reduceMotion: boolean;
}) {
  switch (slide.kind) {
    case "session-start":
      return (
        <SlideSessionStart
          slide={slide}
          showStartSession={showStartSession}
          onStartSession={onStartSession}
          reduceMotion={reduceMotion}
        />
      );
    case "cover":
      return <SlideCover slide={slide} reduceMotion={reduceMotion} />;
    case "bullets":
      return <SlideBullets slide={slide} reduceMotion={reduceMotion} />;
    case "quote":
      return <SlideQuote slide={slide} reduceMotion={reduceMotion} />;
    case "definition":
      return <SlideDefinition slide={slide} reduceMotion={reduceMotion} />;
    case "impact-grid":
      return <SlideImpactGrid slide={slide} reduceMotion={reduceMotion} />;
    default: {
      const _exhaustive: never = slide;
      return _exhaustive;
    }
  }
}

export function CourseMaterialPresenter({ deck }: { deck: CourseMaterialDeck }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(SESSION_MS);
  const count = deck.slides.length;
  const slide = deck.slides[index]!;
  const sessionStarted = sessionEndsAt !== null;
  const sessionComplete = sessionStarted && remainingMs <= 0;
  const mustStartSession =
    !sessionStarted && deck.slides[0]?.kind === "session-start";
  const nextLocked = mustStartSession && index === 0;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const syncFullscreen = () => {
      const active = document.fullscreenElement === rootRef.current;
      setIsFullscreen(active);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    if (sessionEndsAt == null) return;

    const tick = () => {
      setRemainingMs(Math.max(0, sessionEndsAt - Date.now()));
    };
    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [sessionEndsAt]);

  const startSession = useCallback(() => {
    setSessionEndsAt(Date.now() + SESSION_MS);
    setRemainingMs(SESSION_MS);
    setIndex(count > 1 ? 1 : 0);

    const node = rootRef.current;
    if (!node || document.fullscreenElement === node) return;

    void (async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        await node.requestFullscreen();
      } catch {
        // Browser may block fullscreen without support.
      }
    })();
  }, [count]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = clampIndex(next, count);
      if (mustStartSession && clamped !== 0) return;
      setIndex(clamped);
    },
    [count, mustStartSession],
  );

  const goNext = useCallback(() => {
    if (nextLocked || index >= count - 1) return;
    goTo(index + 1);
  }, [count, goTo, index, nextLocked]);

  const goPrev = useCallback(() => {
    if (index <= 0) return;
    goTo(index - 1);
  }, [goTo, index]);

  const toggleFullscreen = useCallback(async () => {
    const node = rootRef.current;
    if (!node) return;

    try {
      if (document.fullscreenElement === node) {
        await document.exitFullscreen();
        return;
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      await node.requestFullscreen();
    } catch {
      // Browser may block fullscreen without a user gesture or support.
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        void toggleFullscreen();
        return;
      }
      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        goNext();
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(count - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, goNext, goPrev, goTo, toggleFullscreen]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -320) {
      goNext();
      return;
    }
    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 320) {
      goPrev();
    }
  };

  return (
    <div ref={rootRef} className="cm-presenter">
      <div className="cm-presenter-aura" aria-hidden />
      <header className="cm-presenter-bar">
        <div className="cm-presenter-bar-left">
          <Link href="/admin/course-material" className="cm-presenter-exit">
            Exit
          </Link>
          <button
            type="button"
            className="cm-presenter-fullscreen"
            onClick={() => void toggleFullscreen()}
            aria-pressed={isFullscreen}
            aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
        <p className="cm-presenter-deck">{deck.title}</p>
        <div className="cm-presenter-bar-right">
          {sessionStarted ? (
            <p
              className={[
                "cm-presenter-timer",
                sessionComplete ? "cm-presenter-timer-done" : "",
              ].join(" ")}
              aria-live="polite"
            >
              <span className="cm-presenter-timer-label">Session</span>
              <span className="cm-presenter-timer-value">
                {sessionComplete ? "00:00:00" : formatCountdown(remainingMs)}
              </span>
            </p>
          ) : null}
          <p className="cm-presenter-count">
            {String(index + 1).padStart(2, "0")}
            <span>/</span>
            {String(count).padStart(2, "0")}
          </p>
        </div>
      </header>

      <motion.div
        className="cm-presenter-stage"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragMomentum={false}
        onDragEnd={onDragEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="cm-presenter-frame"
            initial={reduceMotion ? false : { opacity: 0, x: 40, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -32, scale: 0.985 }}
            transition={{ duration: 0.48, ease }}
          >
            <SlideView
              slide={slide}
              showStartSession={slide.kind === "session-start" && !sessionStarted}
              onStartSession={startSession}
              reduceMotion={!!reduceMotion}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <footer className="cm-presenter-controls">
        <button
          type="button"
          className="cm-presenter-nav"
          onClick={goPrev}
          disabled={index <= 0}
          aria-label="Previous slide"
        >
          ←
        </button>
        <div className="cm-presenter-dots" role="tablist" aria-label="Slides">
          {deck.slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className={["cm-presenter-dot", i === index ? "is-active" : ""].join(" ")}
              disabled={mustStartSession && i !== 0}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="cm-presenter-nav"
          onClick={goNext}
          disabled={nextLocked || index >= count - 1}
          aria-label="Next slide"
        >
          →
        </button>
      </footer>
    </div>
  );
}
