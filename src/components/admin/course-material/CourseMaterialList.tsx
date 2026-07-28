"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  getCourseMaterialSeriesGroups,
  type CourseMaterialDeck,
  type CourseMaterialSeriesGroup,
} from "@/lib/admin/course-material";

function statusLabel(status: CourseMaterialDeck["status"]) {
  switch (status) {
    case "ready":
      return "Ready";
    case "draft":
      return "Draft · awaiting content";
    case "coming-soon":
      return "Coming soon";
    case undefined:
      return null;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function PresentLink({
  deck,
  reduceMotion,
}: {
  deck: CourseMaterialDeck;
  reduceMotion: boolean | null;
}) {
  const label = deck.dayLabel ? `Present ${deck.dayLabel}` : "Present";

  return (
    <span className="cm-list-present-wrap">
      {!reduceMotion ? <span className="cm-list-present-glow" aria-hidden /> : null}
      <motion.div
        className="cm-list-present-motion"
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      >
        <Link href={`/admin/course-material/${deck.slug}`} className="cm-list-present">
          {!reduceMotion ? <span className="cm-list-present-shine" aria-hidden /> : null}
          <span className="relative">{label}</span>
          <span className="relative" aria-hidden>
            →
          </span>
        </Link>
      </motion.div>
    </span>
  );
}

function DayRow({
  deck,
  reduceMotion,
}: {
  deck: CourseMaterialDeck;
  reduceMotion: boolean | null;
}) {
  const status = statusLabel(deck.status);

  return (
    <div className="cm-list-day">
      <div className="cm-list-day-copy">
        <div className="cm-list-day-heading">
          <p className="cm-list-day-label">{deck.dayLabel ?? "Session"}</p>
          {status ? <span className="cm-list-status">{status}</span> : null}
        </div>
        <p className="cm-list-day-meta">
          {deck.slides.length} slides · {deck.duration}
        </p>
      </div>
      <PresentLink deck={deck} reduceMotion={reduceMotion} />
    </div>
  );
}

function CourseCard({
  group,
  reduceMotion,
}: {
  group: CourseMaterialSeriesGroup;
  reduceMotion: boolean | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const isSeries = group.decks.length > 1 || Boolean(group.decks[0]?.series);
  const single = group.decks[0]!;
  const panelId = `cm-list-panel-${group.key}`;

  return (
    <article
      className={`cm-list-card admin-panel rounded-2xl shadow-sm ${expanded ? "cm-list-card-open" : "cm-list-card-collapsed"}`}
    >
      <button
        type="button"
        className="cm-list-toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((open) => !open)}
      >
        <h3 className="cm-list-toggle-title admin-panel-title font-serif">{group.title}</h3>
        <span className="cm-list-toggle-meta" aria-hidden>
          {group.duration}
        </span>
        <span className={`cm-list-chevron${expanded ? " cm-list-chevron-open" : ""}`} aria-hidden>
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            id={panelId}
            className="cm-list-panel"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }
            }
          >
            <div className="cm-list-panel-inner">
              <p className="admin-stat-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
                {isSeries ? "Multi-day course" : "Teaching deck"}
              </p>

              <div className="cm-list-field mt-4">
                <p className="cm-list-field-label">Description</p>
                <p className="admin-shell-description mt-1.5 max-w-2xl text-sm leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div className="cm-list-meta mt-5 grid gap-3 sm:grid-cols-2">
                <div className="cm-list-meta-item admin-catalog-metric rounded-xl px-3.5 py-3">
                  <p className="cm-list-field-label">Length</p>
                  <p className="admin-panel-title mt-1.5 font-serif text-xl leading-none">
                    {group.duration}
                  </p>
                </div>
                <div className="cm-list-meta-item admin-catalog-metric rounded-xl px-3.5 py-3">
                  <p className="cm-list-field-label">
                    {isSeries ? "Days" : "Number of slides"}
                  </p>
                  <p className="admin-panel-title mt-1.5 font-serif text-xl leading-none">
                    {isSeries ? group.decks.length : single.slides.length}
                  </p>
                </div>
              </div>

              {isSeries ? (
                <div className="cm-list-days mt-5">
                  {group.decks.map((deck) => (
                    <DayRow key={deck.slug} deck={deck} reduceMotion={reduceMotion} />
                  ))}
                </div>
              ) : (
                <div className="cm-list-actions mt-5 flex justify-end">
                  <PresentLink deck={single} reduceMotion={reduceMotion} />
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export function CourseMaterialList() {
  const reduceMotion = useReducedMotion();
  const groups = getCourseMaterialSeriesGroups();

  return (
    <div className="cm-list">
      {groups.map((group) => (
        <CourseCard key={group.key} group={group} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}
