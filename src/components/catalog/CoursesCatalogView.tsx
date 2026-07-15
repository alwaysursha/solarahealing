"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CatalogDetailCta } from "@/components/catalog/CatalogDetailCta";
import type { CatalogDetailItem } from "@/components/catalog/CatalogDetailView";
import { toImageObjectPosition } from "@/lib/image-focus";
import { formatCad } from "@/lib/site";

type CoursesCatalogViewProps = {
  items: CatalogDetailItem[];
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

function courseHref(id: string) {
  return `/courses/${id}`;
}

function uniqueLevels(items: CatalogDetailItem[]) {
  const levels = items
    .map((item) => item.level?.trim())
    .filter((level): level is string => Boolean(level));
  return Array.from(new Set(levels));
}

function SpotlightCourse({
  course,
  reduceMotion,
}: {
  course: CatalogDetailItem;
  reduceMotion: boolean | null;
}) {
  const objectPosition = toImageObjectPosition(course.imageFocusX ?? 50, course.imageFocusY ?? 50);
  const href = courseHref(course.id);

  return (
    <motion.article
      className="courses-catalog-spotlight"
      initial={reduceMotion ? undefined : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease }}
    >
      <Link href={href} className="courses-catalog-spotlight-media">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          priority
          sizes="(max-width: 960px) 100vw, 62vw"
          className="object-cover"
          style={{ objectPosition }}
        />
        <span className="courses-catalog-spotlight-veil" aria-hidden />
        <span className="courses-catalog-spotlight-glow" aria-hidden />
      </Link>

      <div className="courses-catalog-spotlight-copy">
        <p className="courses-catalog-kicker">Catalogue spotlight</p>
        {course.badge ? <span className="courses-catalog-chip">{course.badge}</span> : null}
        <h2 className="courses-catalog-spotlight-title">
          <Link href={href}>{course.title}</Link>
        </h2>
        {course.level ? <p className="courses-catalog-spotlight-level">{course.level}</p> : null}
        <p className="courses-catalog-spotlight-body">{course.description}</p>
        <p className="courses-catalog-spotlight-meta">{course.duration}</p>

        <div className="courses-catalog-spotlight-actions">
          <div>
            <p className="courses-catalog-fee-label">Course Fee</p>
            <p className="courses-catalog-fee">{formatCad(course.priceCad)}</p>
          </div>
          <div className="courses-catalog-spotlight-ctas">
            <CatalogDetailCta
              type="course"
              item={{
                id: course.id,
                title: course.title,
                priceCad: course.priceCad,
                image: course.image,
              }}
            />
            <Link href={href} className="courses-catalog-link">
              Explore pathway →
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function CatalogCard({
  course,
  index,
  reduceMotion,
}: {
  course: CatalogDetailItem;
  index: number;
  reduceMotion: boolean | null;
}) {
  const objectPosition = toImageObjectPosition(course.imageFocusX ?? 50, course.imageFocusY ?? 50);
  const href = courseHref(course.id);
  const featuredLayout = index % 5 === 0;

  return (
    <motion.article
      layout
      className={`courses-catalog-card${featuredLayout ? " is-wide" : ""}`}
      variants={rise}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2, margin: "-40px" }}
    >
      <Link href={href} className="courses-catalog-card-media">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover"
          style={{ objectPosition }}
        />
        <span className="courses-catalog-card-veil" aria-hidden />
        <span className="courses-catalog-card-shine" aria-hidden />
        {course.badge ? <span className="courses-catalog-card-badge">{course.badge}</span> : null}
        <span className="courses-catalog-card-index">{String(index + 1).padStart(2, "0")}</span>
      </Link>

      <div className="courses-catalog-card-body">
        <div className="courses-catalog-card-topline">
          {course.level ? <p className="courses-catalog-card-level">{course.level}</p> : null}
          <p className="courses-catalog-card-duration">{course.duration}</p>
        </div>
        <h3 className="courses-catalog-card-title">
          <Link href={href}>{course.title}</Link>
        </h3>
        <p className="courses-catalog-card-copy">{course.description}</p>
        <div className="courses-catalog-card-footer">
          <p className="courses-catalog-card-price">{formatCad(course.priceCad)}</p>
          <div className="courses-catalog-card-actions">
            <CatalogDetailCta
              type="course"
              item={{
                id: course.id,
                title: course.title,
                priceCad: course.priceCad,
                image: course.image,
              }}
            />
            <Link href={href} className="courses-catalog-link">
              View details
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function CoursesCatalogView({
  items,
  eyebrow,
  title,
  titleAccent,
  description,
}: CoursesCatalogViewProps) {
  const reduceMotion = useReducedMotion();
  const levels = useMemo(() => uniqueLevels(items), [items]);
  const [activeLevel, setActiveLevel] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (activeLevel === "all") return items;
    return items.filter((item) => item.level === activeLevel);
  }, [activeLevel, items]);

  const spotlight = filteredItems[0];
  const gridItems = filteredItems.slice(1);

  const heroImage = items[0]?.image;
  const heroPosition = toImageObjectPosition(
    items[0]?.imageFocusX ?? 50,
    items[0]?.imageFocusY ?? 50,
  );

  return (
    <div className="courses-catalog">
      <section className="courses-catalog-hero">
        {heroImage ? (
          <div className="courses-catalog-hero-media" aria-hidden>
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: heroPosition }}
            />
            <span className="courses-catalog-hero-veil" />
            <span className="courses-catalog-hero-grain" />
          </div>
        ) : null}

        <div className="courses-catalog-hero-orb courses-catalog-hero-orb-a" aria-hidden />
        <div className="courses-catalog-hero-orb courses-catalog-hero-orb-b" aria-hidden />

        <motion.div
          className="courses-catalog-hero-inner"
          variants={stagger}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.p className="courses-catalog-hero-eyebrow" variants={rise}>
            {eyebrow}
          </motion.p>
          <motion.h1 className="courses-catalog-hero-title" variants={rise}>
            {title}
            <span>{titleAccent}</span>
          </motion.h1>
          <motion.p className="courses-catalog-hero-copy" variants={rise}>
            {description}
          </motion.p>
          <motion.div className="courses-catalog-hero-meta" variants={rise}>
            <div className="courses-catalog-hero-count">
              <span className="courses-catalog-hero-count-number">
                {String(items.length).padStart(2, "0")}
              </span>
              <span className="courses-catalog-hero-count-label">programs in the catalogue</span>
            </div>
            <Link href="/#courses" className="courses-catalog-hero-home">
              ← Back to homepage
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div className="courses-catalog-body">
        {items.length === 0 ? (
          <div className="courses-catalog-empty">
            <p className="courses-catalog-empty-title">Catalogue opening soon</p>
            <p className="courses-catalog-empty-copy">
              New pathways are being prepared. Check back shortly for published courses.
            </p>
            <Link href="/" className="courses-catalog-link">
              Return home →
            </Link>
          </div>
        ) : (
          <>
            {spotlight ? <SpotlightCourse course={spotlight} reduceMotion={reduceMotion} /> : null}

            <section className="courses-catalog-browse" aria-label="Browse course catalogue">
              <div className="courses-catalog-browse-head">
                <div>
                  <p className="courses-catalog-kicker">Browse the shelves</p>
                  <h2 className="courses-catalog-browse-title">Find your pathway</h2>
                </div>

                {levels.length > 0 ? (
                  <div className="courses-catalog-filters" role="tablist" aria-label="Filter by level">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeLevel === "all"}
                      className={`courses-catalog-filter${activeLevel === "all" ? " is-active" : ""}`}
                      onClick={() => setActiveLevel("all")}
                    >
                      All
                    </button>
                    {levels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        role="tab"
                        aria-selected={activeLevel === level}
                        className={`courses-catalog-filter${activeLevel === level ? " is-active" : ""}`}
                        onClick={() => setActiveLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeLevel}
                  className="courses-catalog-grid"
                  variants={stagger}
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                >
                  {gridItems.length === 0 ? (
                    <p className="courses-catalog-empty-copy">
                      {filteredItems.length === 0
                        ? "No courses in this level yet."
                        : "This pathway is featured above — more programs coming soon."}
                    </p>
                  ) : (
                    gridItems.map((course, index) => (
                      <CatalogCard
                        key={course.id}
                        course={course}
                        index={index}
                        reduceMotion={reduceMotion}
                      />
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </section>

            <section className="courses-catalog-footer-band">
              <div>
                <p className="courses-catalog-kicker">Prefer live energy</p>
                <h2 className="courses-catalog-footer-title">Explore upcoming workshops</h2>
              </div>
              <Link href="/workshops" className="courses-catalog-footer-cta">
                View workshops
                <span aria-hidden>→</span>
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
