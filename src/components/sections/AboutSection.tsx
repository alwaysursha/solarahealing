"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { useHeroEntranceComplete } from "@/hooks/useHeroEntranceComplete";
import { aboutContent } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

const particles = [
  { x: "18%", y: "72%", size: 4, delay: 0 },
  { x: "78%", y: "65%", size: 3, delay: 0.4 },
  { x: "62%", y: "28%", size: 5, delay: 0.8 },
  { x: "32%", y: "38%", size: 3, delay: 1.2 },
  { x: "85%", y: "42%", size: 4, delay: 0.6 },
  { x: "12%", y: "48%", size: 3, delay: 1.5 },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const heroEntranceComplete = useHeroEntranceComplete();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={heroEntranceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.85, delay: heroEntranceComplete ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

function AboutEnergyVisual({ animationsActive }: { animationsActive: boolean }) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = animationsActive && !reduceMotion;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl lg:rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1f0d38] via-purple-deep to-[#120828]" />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 35%, rgba(201,162,39,0.35) 0%, transparent 42%), radial-gradient(circle at 72% 68%, rgba(139,58,154,0.45) 0%, transparent 48%), radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl"
        animate={motionEnabled ? { scale: [1, 1.15, 1], opacity: [0.5, 0.75, 0.5] } : undefined}
        transition={
          motionEnabled
            ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        aria-hidden
      />

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="about-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dbb94a" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#c9a227" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4b0082" stopOpacity="0" />
          </radialGradient>
          <filter id="about-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[88, 112, 136].map((radius, index) => (
          <circle
            key={radius}
            cx="200"
            cy="200"
            r={radius}
            fill="none"
            stroke="#c9a227"
            strokeWidth="0.6"
            opacity={0.12 + index * 0.06}
          />
        ))}

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <ellipse
            key={angle}
            cx="200"
            cy="200"
            rx="34"
            ry="82"
            fill="url(#about-core-glow)"
            opacity={0.22 + (index % 3) * 0.05}
            transform={`rotate(${angle} 200 200)`}
          />
        ))}

        <circle cx="200" cy="200" r="28" fill="#c9a227" opacity="0.85" filter="url(#about-soft-glow)" />
        <circle cx="200" cy="200" r="12" fill="#faf7f2" opacity="0.95" />

        <motion.g
          animate={motionEnabled ? { rotate: 360 } : undefined}
          transition={
            motionEnabled
              ? { duration: 90, repeat: Infinity, ease: "linear" }
              : undefined
          }
          style={{ transformOrigin: "200px 200px" }}
        >
          {[0, 120, 240].map((angle) => (
            <line
              key={angle}
              x1="200"
              y1="200"
              x2="200"
              y2="72"
              stroke="#dbb94a"
              strokeWidth="0.8"
              opacity="0.25"
              transform={`rotate(${angle} 200 200)`}
            />
          ))}
        </motion.g>
      </svg>

      {motionEnabled &&
        particles.map((particle) => (
          <motion.span
            key={`${particle.x}-${particle.y}`}
            className="absolute rounded-full bg-gold-light/80 shadow-[0_0_12px_rgba(219,185,74,0.8)]"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
            animate={{ y: [0, -28, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: 4.5 + particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
            aria-hidden
          />
        ))}

      <div className="absolute inset-0 bg-gradient-to-t from-[#120828]/80 via-transparent to-[#1f0d38]/20" />
      <div className="absolute inset-0 ring-1 ring-inset ring-gold/20" />

      <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5">
        <p className="font-serif text-sm italic text-gold-light/90 md:text-base">
          Universal light, inner peace
        </p>
        <p className="mt-1 text-[0.6rem] uppercase tracking-[0.28em] text-white/35">
          Energy · Balance · Renewal
        </p>
      </div>
    </div>
  );
}

const QUOTE_LEAD = "Healing begins ";
const TYPE_INTERVAL_MS = 48;
const DELETE_INTERVAL_MS = 32;
const REPEAT_PAUSE_MS = 3000;

function normalizeQuote(quote: string) {
  return quote.endsWith(".") ? quote : `${quote}.`;
}

function TypewriterQuote({
  reduceMotion,
  fullQuote,
}: {
  reduceMotion: boolean | null;
  fullQuote: string;
}) {
  const heroEntranceComplete = useHeroEntranceComplete();
  const [charCount, setCharCount] = useState(reduceMotion ? fullQuote.length : 0);
  const [isComplete, setIsComplete] = useState(Boolean(reduceMotion));
  const [isActive, setIsActive] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion || !heroEntranceComplete) return;

    let stepTimer: number | undefined;
    let pauseTimer: number | undefined;
    let cancelled = false;

    const clearTimers = () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(pauseTimer);
      stepTimer = undefined;
      pauseTimer = undefined;
    };

    const startTyping = () => {
      if (cancelled) return;

      setIsActive(true);
      setCharCount(0);
      setIsComplete(false);

      let index = 0;
      stepTimer = window.setInterval(() => {
        if (cancelled) return;

        index += 1;
        setCharCount(index);

        if (index >= fullQuote.length) {
          window.clearInterval(stepTimer);
          setIsComplete(true);

          pauseTimer = window.setTimeout(() => {
            startErasing();
          }, REPEAT_PAUSE_MS);
        }
      }, TYPE_INTERVAL_MS);
    };

    const startErasing = () => {
      if (cancelled) return;

      setIsComplete(false);

      let index = fullQuote.length;
      stepTimer = window.setInterval(() => {
        if (cancelled) return;

        index -= 1;
        setCharCount(index);

        if (index <= 0) {
          window.clearInterval(stepTimer);
          setCharCount(0);

          pauseTimer = window.setTimeout(() => {
            startTyping();
          }, 350);
        }
      }, DELETE_INTERVAL_MS);
    };

    startTyping();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [heroEntranceComplete, reduceMotion]);

  const visible = fullQuote.slice(0, charCount);
  const lead = visible.slice(0, Math.min(visible.length, QUOTE_LEAD.length));
  const accent =
    visible.length > QUOTE_LEAD.length ? visible.slice(QUOTE_LEAD.length) : "";
  const showCursor = heroEntranceComplete && isActive;
  const cursorBlink = isComplete || charCount === 0;

  return (
    <p
      className="font-serif text-lg italic leading-snug text-purple-deep md:text-xl lg:text-[1.15rem] xl:text-xl"
      aria-label={fullQuote}
    >
      <span aria-hidden="true">
        {lead}
        {accent ? (
          <span className="about-quote-shimmer bg-gradient-to-r from-gold via-[#e8c96a] to-gold bg-clip-text not-italic text-transparent">
            {accent}
          </span>
        ) : null}
        {showCursor ? (
          <span
            className={`about-quote-cursor ml-0.5 inline-block not-italic text-gold ${cursorBlink ? "about-quote-cursor-blink" : ""}`}
            aria-hidden
          >
            |
          </span>
        ) : null}
      </span>
    </p>
  );
}

function PracticeQuote({ quote }: { quote: string }) {
  const reduceMotion = useReducedMotion();
  const fullQuote = normalizeQuote(quote);

  return (
    <div className="about-quote-shadow relative z-0 mx-auto w-full max-w-[17.5rem] overflow-hidden rounded-lg bg-white/35 p-3 backdrop-blur-[2px] sm:max-w-sm lg:mx-0 lg:max-w-none">
      <div
        className="about-quote-glow pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.12),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-xl border border-gold/12"
        aria-hidden
      />

      <blockquote className="relative border-l-2 border-gold/50 pl-3.5">
        <span
          className="font-serif pointer-events-none absolute -top-1 left-2.5 text-3xl leading-none text-gold/20"
          aria-hidden
        >
          &ldquo;
        </span>
        <TypewriterQuote reduceMotion={reduceMotion} fullQuote={fullQuote} />
        <div className="mt-2.5 space-y-1.5">
          <div className="h-px w-full max-w-[7rem] bg-gradient-to-r from-gold/55 to-transparent" />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold">
            The heart of our practice
          </p>
        </div>
      </blockquote>
    </div>
  );
}

export function AboutSection({ content = aboutContent }: { content?: typeof aboutContent }) {
  const [first, second, third] = content.paragraphs;
  const sectionRef = useRef<HTMLElement>(null);
  const heroEntranceComplete = useHeroEntranceComplete();
  const scrollAnimationsActive = useAnimationsActive(sectionRef);
  const animationsActive = heroEntranceComplete || scrollAnimationsActive;

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`bg-canvas px-6 pb-12 pt-6 md:px-10 md:pb-16 md:pt-10 lg:px-14 lg:pb-20 lg:pt-28${animationsActive ? "" : " animations-paused"}`}
    >
      <div className="mx-auto grid max-w-7xl gap-6 md:gap-8 lg:grid-cols-12 lg:items-start lg:gap-6 xl:gap-10">
        <Reveal delay={0.05} className="order-2 lg:order-none lg:col-span-3">
          <div className="relative aspect-[16/10] lg:aspect-[4/5]">
            <AboutEnergyVisual animationsActive={animationsActive} />
          </div>
        </Reveal>

        <Reveal className="order-3 lg:order-none lg:col-span-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gold">
            Our Philosophy
          </p>
          <h2 className="font-serif mt-4 text-[2rem] font-normal leading-[1.08] tracking-[-0.02em] text-purple-deep md:text-4xl lg:text-[2.15rem] xl:text-4xl">
            At{" "}
            <span className="italic text-purple-mid">Soulara Healing,</span>
          </h2>
          <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold/70 to-transparent" />
          <p className="mt-6 text-sm leading-[1.85] text-purple-deep/68 md:text-[0.98rem] lg:text-[1.02rem] lg:text-purple-deep/75">
            {first}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="order-1 z-0 max-lg:mb-6 lg:order-none lg:col-span-3">
          <PracticeQuote quote={content.quote} />
          <p className="mt-6 hidden text-sm leading-[1.85] text-purple-deep/68 md:text-[0.98rem] lg:block">
            {second}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="order-4 lg:hidden">
          <p className="text-sm leading-[1.85] text-purple-deep/68 md:text-[0.98rem]">
            {second}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="order-5 lg:order-none lg:col-span-3">
          <p className="text-sm leading-[1.85] text-purple-deep/68 md:text-[0.98rem]">
            {third}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
