"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { useHeroEntranceComplete } from "@/hooks/useHeroEntranceComplete";
import { aboutContent as staticAbout } from "@/lib/site";
import { DEFAULT_QUOTE_LABEL, normalizeAboutContent, type AboutContent } from "@/lib/frontpage-content";

const ease = [0.22, 1, 0.36, 1] as const;
const DEFAULT_ABOUT_IMAGE = "/about/vanita-portrait-v3.jpg";
const DEFAULT_ABOUT_IMAGE_ALT = "Vanita Bassi, founder of Soulara Healing Academy";

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

function AboutPortraitVisual({
  animationsActive,
  src,
  alt,
}: {
  animationsActive: boolean;
  src: string;
  alt: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="about-portrait relative h-full w-full overflow-hidden rounded-xl bg-[#d9d2df] lg:rounded-2xl">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={animationsActive || reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.85, ease }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 420px"
          className="object-contain object-center"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" aria-hidden />
    </div>
  );
}

function AboutSignature({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const name = "Vanita Bassi";

  if (reduceMotion) {
    return (
      <div className="about-signature-block">
        <p className="about-signature">
          <span className="about-signature-first">Vanita </span>
          <span className="about-signature-last">Bassi</span>
        </p>
        <p className="about-signature-role text-gold">Founder</p>
      </div>
    );
  }

  return (
    <div className="about-signature-block">
      <p className="about-signature" aria-label={name}>
        <span className={["about-signature-write", active ? "is-active" : ""].join(" ")} aria-hidden>
          <span className="about-signature-first">Vanita </span>
          <span className="about-signature-last">Bassi</span>
        </span>
      </p>
      <motion.p
        className="about-signature-role text-gold"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: active ? 0.9 : 0, ease }}
      >
        Founder
      </motion.p>
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
  }, [fullQuote, heroEntranceComplete, reduceMotion]);

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
          <span className="about-quote-shimmer bg-gradient-to-r from-purple-deep via-purple-mid to-purple-deep bg-clip-text not-italic text-transparent">
            {accent}
          </span>
        ) : null}
        {showCursor ? (
          <span
            className={`about-quote-cursor ml-0.5 inline-block not-italic text-purple-mid ${cursorBlink ? "about-quote-cursor-blink" : ""}`}
            aria-hidden
          >
            |
          </span>
        ) : null}
      </span>
    </p>
  );
}

function PracticeQuote({
  quote,
  label = DEFAULT_QUOTE_LABEL,
}: {
  quote: string;
  label?: string;
}) {
  const reduceMotion = useReducedMotion();
  const fullQuote = normalizeQuote(quote);

  return (
    <div className="about-quote-shadow relative z-0 mx-auto w-full max-w-[17.5rem] overflow-hidden rounded-lg bg-white/35 p-3 backdrop-blur-[2px] sm:max-w-sm lg:mx-0 lg:max-w-none">
      <div
        className="about-quote-glow pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_50%,rgba(var(--purple-mid-rgb),0.16),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-xl border border-purple-deep/12"
        aria-hidden
      />

      <blockquote className="relative border-l-2 border-purple-mid/55 pl-3.5">
        <span
          className="font-serif pointer-events-none absolute -top-1 left-2.5 text-3xl leading-none text-purple-mid/25"
          aria-hidden
        >
          &ldquo;
        </span>
        <TypewriterQuote reduceMotion={reduceMotion} fullQuote={fullQuote} />
        <div className="mt-2.5 space-y-1.5">
          <div className="h-px w-full max-w-[7rem] bg-gradient-to-r from-purple-mid/60 to-transparent" />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-purple-deep">
            {label}
          </p>
        </div>
      </blockquote>
    </div>
  );
}

export function AboutSection({
  content,
}: {
  content?: AboutContent;
}) {
  const resolved = normalizeAboutContent(content ?? staticAbout);
  const paragraphs = resolved.paragraphs?.length
    ? resolved.paragraphs
    : [...staticAbout.paragraphs];
  const [first, second, third] = paragraphs;
  const portraitSrc = resolved.image?.trim() || DEFAULT_ABOUT_IMAGE;
  const portraitAlt = resolved.imageAlt?.trim() || DEFAULT_ABOUT_IMAGE_ALT;
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
      <div className="mx-auto grid max-w-7xl gap-6 md:gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-6 xl:gap-10">
        <Reveal
          delay={0.05}
          className="order-2 lg:order-none lg:col-span-3 lg:self-start"
        >
          <div className="relative w-full overflow-visible">
            <div className="relative aspect-[68/85] w-full overflow-hidden">
              <AboutPortraitVisual
                animationsActive={animationsActive}
                src={portraitSrc}
                alt={portraitAlt}
              />
            </div>
            <AboutSignature active={animationsActive} />
          </div>
        </Reveal>

        <Reveal className="order-3 lg:order-none lg:col-span-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gold">
            Our Philosophy
          </p>
          <h2 className="font-serif mt-4 text-[2rem] font-normal leading-[1.08] tracking-[-0.02em] text-purple-deep md:text-4xl lg:text-[2.15rem] xl:text-4xl">
            At{" "}
            <span className="italic text-purple-mid">Soulara Healing Academy,</span>
          </h2>
          <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold/70 to-transparent" />
          <p className="mt-6 text-[0.92rem] leading-[1.85] text-purple-deep/68 md:text-[1.05rem] lg:text-[1.08rem] lg:text-purple-deep/75">
            {first}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="order-1 z-0 max-lg:mb-6 lg:order-none lg:col-span-3">
          <PracticeQuote quote={resolved.quote} label={resolved.quoteLabel} />
          <p className="mt-6 hidden text-[0.92rem] leading-[1.85] text-purple-deep/68 md:text-[1.05rem] lg:block">
            {second}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="order-4 lg:hidden">
          <p className="text-[0.92rem] leading-[1.85] text-purple-deep/68 md:text-[1.05rem]">
            {second}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="order-5 lg:order-none lg:col-span-3">
          <p className="text-[0.92rem] leading-[1.85] text-purple-deep/68 md:text-[1.05rem]">
            {third}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
