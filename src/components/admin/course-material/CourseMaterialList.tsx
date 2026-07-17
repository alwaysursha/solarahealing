"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { courseMaterialDecks } from "@/lib/admin/course-material";

export function CourseMaterialList() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="cm-list">
      {courseMaterialDecks.map((deck) => (
        <article key={deck.slug} className="cm-list-card admin-panel rounded-2xl p-5 shadow-sm sm:p-6">
          <p className="admin-stat-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
            Teaching deck
          </p>

          <div className="cm-list-field mt-4">
            <p className="cm-list-field-label">Course name</p>
            <h3 className="admin-panel-title mt-1.5 font-serif text-2xl leading-tight">{deck.title}</h3>
          </div>

          <div className="cm-list-field mt-4">
            <p className="cm-list-field-label">Description</p>
            <p className="admin-shell-description mt-1.5 max-w-2xl text-sm leading-relaxed">
              {deck.description}
            </p>
          </div>

          <div className="cm-list-meta mt-5 grid gap-3 sm:grid-cols-2">
            <div className="cm-list-meta-item admin-catalog-metric rounded-xl px-3.5 py-3">
              <p className="cm-list-field-label">Length</p>
              <p className="admin-panel-title mt-1.5 font-serif text-xl leading-none">{deck.duration}</p>
            </div>
            <div className="cm-list-meta-item admin-catalog-metric rounded-xl px-3.5 py-3">
              <p className="cm-list-field-label">Number of slides</p>
              <p className="admin-panel-title mt-1.5 font-serif text-xl leading-none">
                {deck.slides.length}
              </p>
            </div>
          </div>

          <div className="cm-list-actions mt-5 flex justify-end">
            <span className="cm-list-present-wrap">
              {!reduceMotion ? <span className="cm-list-present-glow" aria-hidden /> : null}
              <motion.div
                className="cm-list-present-motion"
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              >
                <Link href={`/admin/course-material/${deck.slug}`} className="cm-list-present">
                  {!reduceMotion ? <span className="cm-list-present-shine" aria-hidden /> : null}
                  <span className="relative">Present</span>
                  <span className="relative" aria-hidden>
                    →
                  </span>
                </Link>
              </motion.div>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
