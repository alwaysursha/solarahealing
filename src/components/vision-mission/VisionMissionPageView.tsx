"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { visionMissionPage as content } from "@/lib/vision-mission";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function SignatureMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.6" opacity="0.35" />
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="0.7" opacity="0.55" />
      <path
        d="M32 14c2.8 6.4 8.2 11.2 14.8 13.2C40.2 29.4 34.8 34.8 32 42.2 29.2 34.8 23.8 29.4 17.2 27.2 23.8 25.2 29.2 20.4 32 14z"
        fill="currentColor"
        opacity="0.72"
      />
      <circle cx="32" cy="32" r="2.4" fill="currentColor" />
    </svg>
  );
}

function Pillar({
  index,
  title,
  paragraphs,
  delay = 0,
  align = "start",
}: {
  index: string;
  title: string;
  paragraphs: readonly string[];
  delay?: number;
  align?: "start" | "end";
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={[
        "vm-pillar",
        align === "end" ? "vm-pillar-end" : "vm-pillar-start",
      ].join(" ")}
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease }}
    >
      <div className="vm-pillar-index" aria-hidden>
        {index}
      </div>
      <div className="vm-pillar-body">
        <p className="vm-pillar-eyebrow">{title}</p>
        <div className="vm-pillar-rule" aria-hidden />
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="vm-pillar-copy">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.article>
  );
}

export function VisionMissionPageView() {
  const reduceMotion = useReducedMotion();
  const pageRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(pageRef);

  return (
    <main
      ref={pageRef}
      className={`vm-page${animationsActive ? "" : " animations-paused"}`}
    >
      <div className="vm-page-aura" aria-hidden />
      <div className="vm-page-veil" aria-hidden />

      <div className="vm-page-inner">
        <motion.header
          className="vm-hero"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="vm-hero-eyebrow">{content.eyebrow}</p>
          <h1 className="vm-hero-title">
            {content.title}
            <span>{content.titleAccent}</span>
          </h1>
          <p className="vm-hero-lead">{content.lead}</p>
        </motion.header>

        <motion.section
          className="vm-signature"
          aria-label="Signature statement"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
        >
          <div className="vm-signature-frame" aria-hidden>
            <span className="vm-signature-corner vm-signature-corner-tl" />
            <span className="vm-signature-corner vm-signature-corner-tr" />
            <span className="vm-signature-corner vm-signature-corner-bl" />
            <span className="vm-signature-corner vm-signature-corner-br" />
          </div>
          <SignatureMark className="vm-signature-mark" />
          <p className="vm-signature-text">&ldquo;{content.signature}&rdquo;</p>
          <motion.div
            className="vm-signature-ink"
            aria-hidden
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={reduceMotion ? undefined : { scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease }}
          />
          <p className="vm-signature-sanskrit" lang="sa">
            {content.sanskrit}
          </p>
          <p className="vm-signature-meaning">{content.sanskritMeaning}</p>
        </motion.section>

        <div className="vm-pillars">
          <Pillar
            index={content.vision.index}
            title={content.vision.title}
            paragraphs={content.vision.paragraphs}
            delay={0.05}
            align="start"
          />

          <div className="vm-pillars-spine" aria-hidden>
            <span className="vm-pillars-gem" />
          </div>

          <Pillar
            index={content.mission.index}
            title={content.mission.title}
            paragraphs={content.mission.paragraphs}
            delay={0.12}
            align="end"
          />
        </div>

        <motion.footer
          className="vm-close"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="vm-close-quote">{content.signature}</p>
          <Link href={content.cta.href} className="vm-close-cta">
            <span>{content.cta.label}</span>
            <span aria-hidden>→</span>
          </Link>
        </motion.footer>
      </div>
    </main>
  );
}
