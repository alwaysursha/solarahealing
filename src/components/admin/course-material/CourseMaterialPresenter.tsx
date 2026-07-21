"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AuraDiagramVisual } from "@/components/admin/course-material/AuraDiagramVisual";
import { BalancingChakrasVisual } from "@/components/admin/course-material/BalancingChakrasVisual";
import { ChakrasGuideVisual } from "@/components/admin/course-material/ChakrasGuideVisual";
import { EnergyTakersVisual } from "@/components/admin/course-material/EnergyTakersVisual";
import { ReikiBenefitsWheel } from "@/components/admin/course-material/ReikiBenefitsWheel";
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

function teacherNameParts(name: string) {
  const trimmed = name.trim();
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    return { first: trimmed, last: "" };
  }
  return {
    first: `${trimmed.slice(0, space)} `,
    last: trimmed.slice(space + 1),
  };
}

function SlideCover({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "cover" }>;
  reduceMotion: boolean;
}) {
  const hasPortrait = Boolean(slide.teacherImage);
  const { first, last } = teacherNameParts(slide.teacher);

  return (
    <motion.div
      className={["cm-slide cm-slide-cover", hasPortrait ? "cm-slide-cover-with-portrait" : ""].join(
        " ",
      )}
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-slide-cover-copy">
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
        {!hasPortrait ? (
          <>
            <motion.p className="cm-slide-teacher" variants={reduceMotion ? undefined : slideItem}>
              {slide.teacher}
            </motion.p>
            <motion.p className="cm-slide-roles" variants={reduceMotion ? undefined : slideItem}>
              {slide.teacherRoles}
            </motion.p>
          </>
        ) : null}
        <motion.div className="cm-slide-cover-actions" variants={reduceMotion ? undefined : slideItem}>
          <p className="cm-slide-duration">{slide.duration}</p>
          <p className="cm-slide-journey cm-slide-journey-under-duration">{slide.journeyLine}</p>
        </motion.div>
      </div>

      {hasPortrait && slide.teacherImage ? (
        <motion.aside
          className="cm-slide-cover-teacher"
          variants={reduceMotion ? undefined : slideMedia}
        >
          <div className="cm-slide-cover-portrait">
            <Image
              src={slide.teacherImage.src}
              alt={slide.teacherImage.alt}
              width={slide.teacherImage.width}
              height={slide.teacherImage.height}
              className="cm-slide-cover-portrait-img"
              quality={95}
              priority
            />
          </div>
          <p className="cm-slide-teacher-signature about-signature" aria-label={slide.teacher}>
            <span className="about-signature-first">{first}</span>
            {last ? <span className="about-signature-last">{last}</span> : null}
          </p>
          <p className="cm-slide-roles cm-slide-roles-portrait">{slide.teacherRoles}</p>
        </motion.aside>
      ) : null}
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

function SlideStory({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "story" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-story"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-story-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title cm-story-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.div className="cm-story-paragraphs" variants={reduceMotion ? undefined : slideContainer}>
          {slide.paragraphs.map((paragraph) => (
            <motion.p key={paragraph} variants={reduceMotion ? undefined : slideItem}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </div>

      <motion.aside className="cm-story-media" variants={reduceMotion ? undefined : slideMedia}>
        <div className="cm-story-portrait">
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            width={slide.image.width}
            height={slide.image.height}
            className="cm-story-portrait-img"
            quality={95}
            priority
          />
        </div>
        {slide.imageCaption ? (
          <p className="cm-story-caption">{slide.imageCaption}</p>
        ) : null}
      </motion.aside>
    </motion.div>
  );
}

function SlideSignificance({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "significance" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-significance"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-significance-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title cm-significance-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.p className="cm-significance-lead" variants={reduceMotion ? undefined : slideItem}>
          {slide.lead}
        </motion.p>

        <motion.div className="cm-significance-section" variants={reduceMotion ? undefined : slideItem}>
          <p className="cm-significance-section-label">{slide.bodiesTitle}</p>
          <ul className="cm-significance-chips">
            {slide.bodies.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="cm-significance-section" variants={reduceMotion ? undefined : slideItem}>
          <p className="cm-significance-section-label">{slide.benefitsTitle}</p>
          <ul className="cm-significance-benefits">
            {slide.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.aside className="cm-significance-wheel-wrap" variants={reduceMotion ? undefined : slideMedia}>
        <ReikiBenefitsWheel />
      </motion.aside>
    </motion.div>
  );
}

function SlideEnergy({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "energy" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-energy"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-energy-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title cm-energy-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.p className="cm-energy-lead" variants={reduceMotion ? undefined : slideItem}>
          {slide.lead}
        </motion.p>
        <motion.p className="cm-energy-einstein" variants={reduceMotion ? undefined : slideItem}>
          {slide.einstein}
        </motion.p>
        <motion.ul className="cm-energy-principles" variants={reduceMotion ? undefined : slideContainer}>
          {slide.principles.map((item) => (
            <motion.li key={item} variants={reduceMotion ? undefined : slideItem}>
              {item}
            </motion.li>
          ))}
        </motion.ul>
        <motion.p className="cm-energy-closing" variants={reduceMotion ? undefined : slideItem}>
          {slide.closing}
        </motion.p>
      </div>

      <motion.aside className="cm-energy-visual-wrap" variants={reduceMotion ? undefined : slideMedia}>
        <EnergyTakersVisual />
      </motion.aside>
    </motion.div>
  );
}

function SlideReikiEnergy({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "reiki-energy" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-reiki-energy"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-reiki-energy-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title cm-reiki-energy-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.p className="cm-reiki-energy-lead" variants={reduceMotion ? undefined : slideItem}>
          {slide.lead}
        </motion.p>
        <motion.div className="cm-reiki-energy-paragraphs" variants={reduceMotion ? undefined : slideContainer}>
          {slide.paragraphs.map((paragraph) => (
            <motion.p key={paragraph} variants={reduceMotion ? undefined : slideItem}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
        <motion.p className="cm-reiki-energy-closing" variants={reduceMotion ? undefined : slideItem}>
          {slide.closing}
        </motion.p>
      </div>

      <motion.aside className="cm-reiki-energy-media" variants={reduceMotion ? undefined : slideMedia}>
        <div className="cm-reiki-energy-frame">
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            width={slide.image.width}
            height={slide.image.height}
            className="cm-reiki-energy-img"
            quality={100}
            unoptimized
            priority
          />
        </div>
      </motion.aside>
    </motion.div>
  );
}

function SlideReikiActivation({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "reiki-activation" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-reiki-activation"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-reiki-activation-copy">
        {slide.eyebrow ? (
          <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
            {slide.eyebrow}
          </motion.p>
        ) : null}
        <motion.h2 className="cm-slide-title cm-reiki-activation-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.p className="cm-reiki-activation-lead" variants={reduceMotion ? undefined : slideItem}>
          {slide.lead}
        </motion.p>

        <motion.div className="cm-reiki-activation-steps-block" variants={reduceMotion ? undefined : slideItem}>
          <p className="cm-reiki-activation-steps-title">{slide.stepsTitle}</p>
          <ol className="cm-reiki-activation-steps">
            {slide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </motion.div>

        <motion.p className="cm-reiki-activation-closing" variants={reduceMotion ? undefined : slideItem}>
          {slide.closing}
        </motion.p>
      </div>

      <motion.aside className="cm-reiki-activation-media" variants={reduceMotion ? undefined : slideMedia}>
        <div className="cm-reiki-activation-frame">
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            width={slide.image.width}
            height={slide.image.height}
            className="cm-reiki-activation-img"
            quality={100}
            unoptimized
            priority
          />
        </div>
      </motion.aside>
    </motion.div>
  );
}

function SlideChakraSystem({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "chakra-system" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-chakra-system"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-chakra-system-header">
        <div className="cm-chakra-system-heading-row">
          <div className="cm-chakra-system-heading">
            {slide.eyebrow ? (
              <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
                {slide.eyebrow}
              </motion.p>
            ) : null}
            <motion.h2 className="cm-slide-title cm-chakra-system-title" variants={reduceMotion ? undefined : slideItem}>
              {slide.title}
            </motion.h2>
          </div>
          <motion.ul className="cm-chakra-system-stats" variants={reduceMotion ? undefined : slideContainer}>
            {slide.stats.map((stat) => (
              <motion.li key={stat.label} variants={reduceMotion ? undefined : slideItem}>
                <span className="cm-chakra-system-stat-value">{stat.value}</span>
                <span className="cm-chakra-system-stat-label">{stat.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <motion.p className="cm-chakra-system-lead" variants={reduceMotion ? undefined : slideItem}>
          {slide.lead}
        </motion.p>
      </div>

      <motion.div className="cm-chakra-system-visuals" variants={reduceMotion ? undefined : slideContainer}>
        {slide.visuals.map((visual) => (
          <motion.figure key={visual.src} className="cm-chakra-system-card" variants={reduceMotion ? undefined : slideMedia}>
            <div className="cm-chakra-system-frame">
              <Image
                src={visual.src}
                alt={visual.alt}
                width={visual.width}
                height={visual.height}
                className="cm-chakra-system-img"
                quality={100}
                unoptimized
                priority
              />
            </div>
            <figcaption className="cm-chakra-system-caption">{visual.caption}</figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </motion.div>
  );
}

function SlideChakrasGuide({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="cm-slide cm-slide-chakras-guide"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <motion.div variants={reduceMotion ? undefined : slideMedia}>
        <ChakrasGuideVisual />
      </motion.div>
    </motion.div>
  );
}

function SlideBalancingChakras({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      className="cm-slide cm-slide-balancing-chakras"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <motion.div variants={reduceMotion ? undefined : slideMedia}>
        <BalancingChakrasVisual />
      </motion.div>
    </motion.div>
  );
}

function SlideMeditation({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "meditation" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-meditation"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-meditation-bg" aria-hidden>
        <Image
          src={slide.image.src}
          alt=""
          width={slide.image.width}
          height={slide.image.height}
          className="cm-meditation-bg-img"
          quality={100}
          unoptimized
          priority
        />
      </div>

      <div className="cm-meditation-panel">
        <motion.h2 className="cm-slide-title cm-meditation-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.p className="cm-meditation-why" variants={reduceMotion ? undefined : slideItem}>
          {slide.whyTitle}
        </motion.p>
        <motion.ul className="cm-meditation-reasons" variants={reduceMotion ? undefined : slideContainer}>
          {slide.reasons.map((reason) => (
            <motion.li key={reason} variants={reduceMotion ? undefined : slideItem}>
              {reason}
            </motion.li>
          ))}
        </motion.ul>
        <motion.p className="cm-meditation-practice" variants={reduceMotion ? undefined : slideItem}>
          {slide.practice}
        </motion.p>
        <motion.p className="cm-meditation-closing" variants={reduceMotion ? undefined : slideItem}>
          {slide.closing}
        </motion.p>
      </div>
    </motion.div>
  );
}

function SlideAura({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "aura" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-aura"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <motion.div variants={reduceMotion ? undefined : slideMedia}>
        <AuraDiagramVisual title={slide.title} lead={slide.lead} image={slide.image} />
      </motion.div>
    </motion.div>
  );
}

function SlideAuraReading({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "aura-reading" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-aura-reading"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <motion.h2 className="cm-aura-reading-title" variants={reduceMotion ? undefined : slideItem}>
        {slide.title}
      </motion.h2>

      <motion.ol className="cm-aura-reading-flow" variants={reduceMotion ? undefined : slideContainer}>
        {slide.steps.map((step, index) => (
          <motion.li key={step.title} className="cm-aura-reading-item" variants={reduceMotion ? undefined : slideItem}>
            {index > 0 ? (
              <span className="cm-aura-reading-arrow" aria-hidden>
                <svg viewBox="0 0 40 20" fill="none">
                  <path
                    d="M2 10h30M24 3l12 7-12 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}

            <div className="cm-aura-reading-step">
              <span className="cm-aura-reading-num">{index + 1}</span>
              <p className="cm-aura-reading-step-title">{step.title}</p>
              <p className="cm-aura-reading-step-text">{step.text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </motion.div>
  );
}

function SlideBeyondReiki({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "beyond-reiki" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-beyond-reiki"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <motion.h2 className="cm-beyond-reiki-title" variants={reduceMotion ? undefined : slideItem}>
        {slide.title}
      </motion.h2>

      <motion.div className="cm-beyond-reiki-media" variants={reduceMotion ? undefined : slideMedia}>
        <div className="cm-beyond-reiki-frame">
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            width={slide.image.width}
            height={slide.image.height}
            className="cm-beyond-reiki-img"
            quality={100}
            unoptimized
            priority
          />
        </div>
      </motion.div>

      <motion.div className="cm-beyond-reiki-copy" variants={reduceMotion ? undefined : slideContainer}>
        <motion.h3 className="cm-beyond-reiki-subtitle" variants={reduceMotion ? undefined : slideItem}>
          {slide.subtitle}
        </motion.h3>
        <motion.ul className="cm-beyond-reiki-points" variants={reduceMotion ? undefined : slideContainer}>
          {slide.points.map((point) => (
            <motion.li key={point} variants={reduceMotion ? undefined : slideItem}>
              {point}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

function SlideReikiPath({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "reiki-path" }>;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className="cm-slide cm-slide-reiki-path"
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <header className="cm-reiki-path-head">
        <motion.h2 className="cm-reiki-path-title" variants={reduceMotion ? undefined : slideItem}>
          {slide.title}
        </motion.h2>
        <motion.p className="cm-reiki-path-lead" variants={reduceMotion ? undefined : slideItem}>
          {slide.lead}
        </motion.p>
        <motion.p className="cm-reiki-path-intro" variants={reduceMotion ? undefined : slideItem}>
          {slide.intro}
        </motion.p>
      </header>

      <motion.ol className="cm-reiki-path-programs" variants={reduceMotion ? undefined : slideContainer}>
        {slide.programs.map((program) => (
          <motion.li key={program.name} className="cm-reiki-path-program" variants={reduceMotion ? undefined : slideItem}>
            <div className="cm-reiki-path-program-media">
              <Image
                src={program.image.src}
                alt={program.image.alt}
                width={program.image.width}
                height={program.image.height}
                className="cm-reiki-path-program-img"
                quality={90}
              />
            </div>
            <div className="cm-reiki-path-program-copy">
              <p className="cm-reiki-path-program-name">
                {program.name}
                <span className="cm-reiki-path-program-tagline"> — {program.tagline}</span>
              </p>
              <p className="cm-reiki-path-program-text">{program.text}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>

      <motion.p className="cm-reiki-path-closing" variants={reduceMotion ? undefined : slideItem}>
        {slide.closing}
      </motion.p>
    </motion.div>
  );
}

function SlideLifeForce({
  slide,
  reduceMotion,
}: {
  slide: Extract<CourseMaterialSlide, { kind: "life-force" }>;
  reduceMotion: boolean;
}) {
  const hasImage = Boolean(slide.image);

  return (
    <motion.div
      className={["cm-slide cm-slide-life-force", hasImage ? "has-media" : ""].join(" ")}
      variants={reduceMotion ? undefined : slideContainer}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? undefined : "show"}
    >
      <div className="cm-life-force-main">
        <div className="cm-life-force-intro">
          {slide.eyebrow ? (
            <motion.p className="cm-slide-eyebrow" variants={reduceMotion ? undefined : slideItem}>
              {slide.eyebrow}
            </motion.p>
          ) : null}
          <motion.p className="cm-life-force-lead" variants={reduceMotion ? undefined : slideItem}>
            {slide.lead}
          </motion.p>
          <motion.h2 className="cm-slide-title cm-life-force-title" variants={reduceMotion ? undefined : slideItem}>
            {slide.title}
          </motion.h2>
          <motion.ul className="cm-life-force-principles" variants={reduceMotion ? undefined : slideContainer}>
            {slide.principles.map((item) => (
              <motion.li key={item} variants={reduceMotion ? undefined : slideItem}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {hasImage && slide.image ? (
          <motion.div className="cm-life-force-media" variants={reduceMotion ? undefined : slideMedia}>
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
      </div>

      <motion.div className="cm-life-force-compare" variants={reduceMotion ? undefined : slideContainer}>
        <motion.section className="cm-life-force-panel is-open" variants={reduceMotion ? undefined : slideItem}>
          <p className="cm-life-force-panel-lead">{slide.open.lead}</p>
          <ul className="cm-life-force-chips">
            {slide.open.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.section>
        <motion.section className="cm-life-force-panel is-blocked" variants={reduceMotion ? undefined : slideItem}>
          <p className="cm-life-force-panel-lead">{slide.blocked.lead}</p>
          <ul className="cm-life-force-chips">
            {slide.blocked.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}

function SlideCornerLogo({ brandLogo }: { brandLogo: CourseMaterialDeck["brandLogo"] }) {
  return (
    <div className="cm-slide-corner-logo">
      <Image
        src={brandLogo.src}
        alt={brandLogo.alt}
        width={brandLogo.width}
        height={brandLogo.height}
        className="cm-slide-corner-logo-img"
        quality={95}
        priority
      />
    </div>
  );
}

function SlideView({
  slide,
  brandLogo,
  showStartSession,
  onStartSession,
  reduceMotion,
}: {
  slide: CourseMaterialSlide;
  brandLogo: CourseMaterialDeck["brandLogo"];
  showStartSession?: boolean;
  onStartSession?: () => void;
  reduceMotion: boolean;
}) {
  let body: ReactNode;
  switch (slide.kind) {
    case "session-start":
      body = (
        <SlideSessionStart
          slide={slide}
          showStartSession={showStartSession}
          onStartSession={onStartSession}
          reduceMotion={reduceMotion}
        />
      );
      break;
    case "cover":
      body = <SlideCover slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "bullets":
      body = <SlideBullets slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "quote":
      body = <SlideQuote slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "definition":
      body = <SlideDefinition slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "life-force":
      body = <SlideLifeForce slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "story":
      body = <SlideStory slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "significance":
      body = <SlideSignificance slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "energy":
      body = <SlideEnergy slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "reiki-energy":
      body = <SlideReikiEnergy slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "reiki-activation":
      body = <SlideReikiActivation slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "chakra-system":
      body = <SlideChakraSystem slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "chakras-guide":
      body = <SlideChakrasGuide reduceMotion={reduceMotion} />;
      break;
    case "balancing-chakras":
      body = <SlideBalancingChakras reduceMotion={reduceMotion} />;
      break;
    case "meditation":
      body = <SlideMeditation slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "aura":
      body = <SlideAura slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "aura-reading":
      body = <SlideAuraReading slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "beyond-reiki":
      body = <SlideBeyondReiki slide={slide} reduceMotion={reduceMotion} />;
      break;
    case "reiki-path":
      body = <SlideReikiPath slide={slide} reduceMotion={reduceMotion} />;
      break;
    default: {
      const _exhaustive: never = slide;
      return _exhaustive;
    }
  }

  return (
    <div className="cm-slide cm-slide-has-brand">
      <SlideCornerLogo brandLogo={brandLogo} />
      <div className="cm-slide-body">{body}</div>
    </div>
  );
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
              brandLogo={deck.brandLogo}
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
