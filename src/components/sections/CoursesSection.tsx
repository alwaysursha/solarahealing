"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CartIcon } from "@/components/ui/CartIcon";
import { CoursesSpaceBackground } from "@/components/sections/CoursesSpaceBackground";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { useCompositorProfile } from "@/lib/compositor-profile";
import { coursesIntro, formatCad, onlineCourses } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const revealEase: [number, number, number, number] = [0.65, 0, 0.35, 1];
const springEase: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const coursesStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.08 },
  },
};

const featuredReveal = {
  hidden: {
    opacity: 0,
    y: 72,
    scale: 0.94,
    rotateX: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 1, ease },
  },
};

const featuredImageReveal = {
  hidden: { clipPath: "inset(0 100% 0 0 round 1.75rem)" },
  visible: {
    clipPath: "inset(0 0% 0 0 round 1.75rem)",
    transition: { duration: 1.1, ease: revealEase },
  },
};

const featuredImageZoom = {
  hidden: { scale: 1.18 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease },
  },
};

const featuredPanelReveal = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, delay: 0.25, ease },
  },
};

const featuredContentStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
};

const featuredContentItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const upcomingReveals = [
  {
    hidden: { opacity: 0, x: -56, y: 32, rotate: -3, scale: 0.88 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.95,
        ease,
        staggerChildren: 0.09,
        delayChildren: 0.18,
      },
    },
  },
  {
    hidden: { opacity: 0, y: 80, scale: 0.86 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease,
        staggerChildren: 0.09,
        delayChildren: 0.18,
      },
    },
  },
  {
    hidden: { opacity: 0, x: 56, y: 32, rotate: 3, scale: 0.88 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.95,
        ease,
        staggerChildren: 0.09,
        delayChildren: 0.18,
      },
    },
  },
];

const cardOverlayReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const cardPriceReveal = {
  hidden: { opacity: 0, scale: 0.6, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: springEase },
  },
};

const [featured, ...upcoming] = onlineCourses;

function EnrollingDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full bg-gold shadow-[0_0_8px_rgba(201,162,39,0.6)] ${className}`}
      aria-hidden
    />
  );
}

function CourseBadge({ label }: { label: string }) {
  const isOnDemand = label === "On Demand";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
      {isOnDemand && <EnrollingDot className="h-1.5 w-1.5 shrink-0" />}
      {label}
    </span>
  );
}

function PriceTag({
  priceCad,
  large = false,
}: {
  priceCad: number;
  large?: boolean;
}) {
  return (
    <div className={large ? "workshop-price-large" : "workshop-price-tag"}>
      <span className={large ? "font-serif text-4xl text-gold md:text-5xl" : "font-serif text-2xl text-gold"}>
        {formatCad(priceCad)}
      </span>
      {!large && (
        <span className="mt-0.5 block text-[0.55rem] uppercase tracking-[0.22em] text-white/45">
          per course
        </span>
      )}
    </div>
  );
}

function AddToCartButton({
  courseId,
  variant = "gold",
  className = "",
  disableMotion = false,
}: {
  courseId: string;
  variant?: "gold" | "outline";
  className?: string;
  disableMotion?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const motionDisabled = Boolean(reduceMotion || disableMotion);
  const styles =
    variant === "gold"
      ? "bg-gold text-purple-deep shadow-lg shadow-gold/30 hover:bg-gold-light"
      : "border border-gold/45 bg-white/5 text-gold backdrop-blur-sm hover:bg-gold/10";

  if (motionDisabled) {
    return (
      <a
        href={`/checkout?course=${courseId}`}
        className={`workshop-register-btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-colors md:px-5 md:text-[0.65rem] ${styles} ${className}`}
      >
        <CartIcon className="relative h-3.5 w-3.5" />
        <span className="relative">Add to Cart</span>
      </a>
    );
  }

  return (
    <motion.a
      href={`/checkout?course=${courseId}`}
      className={`workshop-register-btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-colors md:px-5 md:text-[0.65rem] ${styles} ${className}`}
      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      <span className="workshop-register-shimmer pointer-events-none absolute inset-0" aria-hidden />
      <CartIcon className="relative h-3.5 w-3.5" />
      <span className="relative">Add to Cart</span>
    </motion.a>
  );
}

function FeaturedCourse({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) {
    return <FeaturedCourseStatic />;
  }

  return (
    <motion.article
      className="workshop-featured group relative overflow-hidden rounded-[1.75rem] border border-white/15"
      variants={featuredReveal}
      style={{ transformPerspective: 1200 }}
    >
      <div className="grid lg:grid-cols-12">
        <motion.div
          className="relative min-h-[260px] lg:col-span-7 lg:min-h-[340px]"
          variants={featuredImageReveal}
        >
          <motion.div className="absolute inset-0" variants={featuredImageZoom}>
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-deep/20 to-purple-deep/80 lg:via-purple-deep/10" />
          <div className="workshop-card-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <motion.div
            className="absolute left-5 top-5 z-[3] flex items-center gap-3"
            variants={featuredContentItem}
          >
            <CourseBadge label={featured.badge} />
            <span className="rounded-full bg-gold/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-purple-deep">
              Featured
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-[3] flex flex-col justify-between bg-[#2a1050]/82 p-6 backdrop-blur-xl md:p-8 lg:col-span-5"
          variants={featuredPanelReveal}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
            aria-hidden
          />
          <motion.div variants={featuredContentStagger}>
            <motion.div variants={featuredContentItem}>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-gold-light/80">
                {featured.date}
              </p>
              <h3 className="font-serif mt-3 text-2xl font-normal leading-tight text-white md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {featured.description}
              </p>
              <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/35">
                {featured.duration}
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6"
              variants={featuredContentItem}
            >
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.24em] text-white/40">Investment</p>
                <PriceTag priceCad={featured.priceCad} large />
              </div>
              <AddToCartButton courseId={featured.id} className="px-6 py-2.5 text-[0.68rem] md:text-xs" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function FeaturedCourseStatic({ disableMotion = false }: { disableMotion?: boolean }) {
  return (
    <article className="workshop-featured group relative overflow-hidden rounded-[1.75rem] border border-white/15">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[260px] lg:col-span-7 lg:min-h-[340px]">
          <Image
            src={featured.image}
            alt={featured.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-deep/20 to-purple-deep/80 lg:via-purple-deep/10" />
          <div className="absolute left-5 top-5 flex items-center gap-3">
            <CourseBadge label={featured.badge} />
            <span className="rounded-full bg-gold/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-purple-deep">
              Featured
            </span>
          </div>
        </div>
        <div className="relative flex flex-col justify-between bg-[#2a1050]/82 p-6 backdrop-blur-xl md:p-8 lg:col-span-5">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-gold-light/80">{featured.date}</p>
            <h3 className="font-serif mt-3 text-2xl font-normal leading-tight text-white md:text-3xl">{featured.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">{featured.description}</p>
            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/35">{featured.duration}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.24em] text-white/40">Investment</p>
              <PriceTag priceCad={featured.priceCad} large />
            </div>
            <AddToCartButton
              courseId={featured.id}
              className="px-6 py-2.5 text-[0.68rem] md:text-xs"
              disableMotion={disableMotion}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function UpcomingCourseCard({
  course,
  index,
  reduceMotion,
  disableMotion = false,
}: {
  course: (typeof onlineCourses)[number];
  index: number;
  reduceMotion: boolean | null;
  disableMotion?: boolean;
}) {
  const variants = upcomingReveals[index] ?? upcomingReveals[1];

  if (reduceMotion || disableMotion) {
    return (
      <article className="workshop-upcoming group relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/15">
        <UpcomingCourseCardContent course={course} disableMotion={disableMotion} />
      </article>
    );
  }

  return (
    <motion.article
      className="workshop-upcoming group relative z-0 min-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/15"
      variants={variants}
      style={{ transformPerspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      >
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e0a38]/95 via-[#281050]/55 to-[#3a1868]/15" />
      <div className="workshop-card-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div className="absolute right-4 top-4 z-[3]" variants={cardPriceReveal}>
        <PriceTag priceCad={course.priceCad} />
      </motion.div>

      <motion.div className="absolute inset-x-0 bottom-0 z-[3] p-5 md:p-6" variants={cardOverlayReveal}>
        <CourseBadge label={course.badge} />
        <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-gold-light/75">
          {course.date}
        </p>
        <h3 className="font-serif mt-2 text-xl leading-tight text-white">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">{course.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[0.62rem] uppercase tracking-[0.18em] text-white/35">{course.duration}</span>
          <AddToCartButton courseId={course.id} variant="outline" disableMotion={disableMotion} />
        </div>
      </motion.div>
    </motion.article>
  );
}

function UpcomingCourseCardContent({
  course,
  disableMotion = false,
}: {
  course: (typeof onlineCourses)[number];
  disableMotion?: boolean;
}) {
  return (
    <>
      <Image
        src={course.image}
        alt={course.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e0a38]/95 via-[#281050]/55 to-[#3a1868]/15" />
      <div className="absolute right-4 top-4 z-[3]">
        <PriceTag priceCad={course.priceCad} />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[3] p-5 md:p-6">
        <CourseBadge label={course.badge} />
        <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-gold-light/75">{course.date}</p>
        <h3 className="font-serif mt-2 text-xl leading-tight text-white">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/55">{course.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[0.62rem] uppercase tracking-[0.18em] text-white/35">{course.duration}</span>
          <AddToCartButton courseId={course.id} variant="outline" disableMotion={disableMotion} />
        </div>
      </div>
    </>
  );
}

export function CoursesSection() {
  const reduceMotion = useReducedMotion();
  const chromeTouch = useCompositorProfile() === "chrome-touch";
  const sectionRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(sectionRef, "0px 0px -5% 0px", {
    once: true,
    amount: 0.25,
  });
  const cosmosEnabled = !reduceMotion;
  const gridCourses = upcoming.slice(0, 3);
  const staticCards = Boolean(reduceMotion || chromeTouch);

  return (
    <section
      id="courses"
      ref={sectionRef}
      className={`site-scroll-section relative overflow-hidden${animationsActive ? "" : " animations-paused"}`}
    >
      <div
        className={`workshop-stage courses-cosmos-stage relative w-full overflow-hidden rounded-none${cosmosEnabled ? " courses-cosmos-daynight" : ""}`}
      >
        <div className="workshop-stage-mesh courses-cosmos-day-layer pointer-events-none absolute inset-0" aria-hidden />
        <div className="workshop-stage-gloss courses-cosmos-day-layer pointer-events-none absolute inset-0" aria-hidden />
        <div className="workshop-stage-shine workshop-gloss-sweep pointer-events-none absolute inset-0" aria-hidden />
        <div className="workshop-stage-noise courses-cosmos-noise-layer pointer-events-none absolute inset-0" aria-hidden />
        <CoursesSpaceBackground animationsActive={animationsActive} cosmosEnabled={cosmosEnabled} />

        <div
          className="courses-cosmos-content grid gap-12 px-5 py-6 sm:px-8 md:p-10 lg:grid-cols-12 lg:gap-10 lg:px-12 xl:px-14 xl:py-14"
        >
          <motion.div
            className="z-0 lg:col-span-4 lg:self-start xl:sticky xl:top-8"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease }}
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <EnrollingDot className="h-2 w-2" />
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/70">
                {coursesIntro.eyebrow}
              </span>
            </div>

            <h2 className="font-serif mt-7 text-[2.4rem] font-normal leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
              {coursesIntro.title}
              <span className="mt-1 block bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text italic text-transparent">
                {coursesIntro.titleAccent}
              </span>
            </h2>

            <div className="workshop-title-line mt-6 h-px w-20 origin-left bg-gradient-to-r from-gold to-transparent" />

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55 md:text-[0.95rem] md:leading-7">
              {coursesIntro.description}
            </p>

            <p className="mt-8 font-serif text-6xl font-normal text-white/8">
              {String(onlineCourses.length).padStart(2, "0")}
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/30">
              Online programs
            </p>

            <Link
              href="#contact"
              className="workshop-view-all group mt-8 inline-flex items-center gap-4 rounded-full border border-gold/40 bg-white/5 px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold/10"
            >
              View All Courses
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 transition-transform duration-300 group-hover:translate-x-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>

          {staticCards ? (
            <div className="courses-cards-static space-y-6 lg:col-span-8">
              <FeaturedCourseStatic disableMotion={chromeTouch} />
              <div className="grid gap-6 overflow-visible md:grid-cols-3">
                {gridCourses.map((course, index) => (
                  <UpcomingCourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    reduceMotion={reduceMotion}
                    disableMotion={chromeTouch}
                  />
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="space-y-6 lg:col-span-8"
              variants={coursesStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12, margin: "-40px" }}
            >
              <FeaturedCourse reduceMotion={reduceMotion} />
              <motion.div className="grid gap-6 overflow-visible md:grid-cols-3" variants={coursesStagger}>
                {gridCourses.map((course, index) => (
                  <UpcomingCourseCard key={course.id} course={course} index={index} reduceMotion={reduceMotion} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
