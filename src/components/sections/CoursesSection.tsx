"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEnrollmentGate } from "@/components/auth/EnrollmentGateProvider";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { useHorizontalSwipe } from "@/hooks/useHorizontalSwipe";
import { toImageObjectPosition } from "@/lib/image-focus";
import { coursesIntro, formatCad, onlineCourses, resolveCoursesIntroDescription } from "@/lib/site";

type CourseItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  badge: string;
  priceCad: number;
  image: string;
  imageAlt: string;
  imageFocusX?: number;
  imageFocusY?: number;
  level?: string;
};

function courseImagePosition(course: CourseItem) {
  return toImageObjectPosition(course.imageFocusX ?? 50, course.imageFocusY ?? 50);
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const revealEase: [number, number, number, number] = [0.65, 0, 0.35, 1];
const springEase: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const catalogStagger = {
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
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
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
      <span className={large ? "font-serif text-5xl text-gold md:text-6xl" : "font-serif text-3xl text-gold"}>
        {formatCad(priceCad)}
      </span>
      {!large && (
        <span className="mt-0.5 block text-[0.62rem] uppercase tracking-[0.22em] text-white/45">
          Course Fee
        </span>
      )}
    </div>
  );
}

function EnrolIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function EnrollButton({
  course,
  variant = "gold",
  className = "",
}: {
  course: Pick<CourseItem, "id" | "title" | "priceCad" | "image">;
  variant?: "gold" | "outline";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { requestEnrollment } = useEnrollmentGate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const styles =
    variant === "gold"
      ? "bg-gold text-purple-deep shadow-lg shadow-gold/30 hover:bg-gold-light"
      : "border border-gold/45 bg-white/5 text-gold backdrop-blur-sm hover:bg-gold/10";

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={`workshop-register-btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition-colors md:px-5 md:text-[0.75rem] ${styles} ${className}`}
      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      onClick={() =>
        requestEnrollment(
          {
            id: course.id,
            type: "course",
            title: course.title,
            priceCad: course.priceCad,
            image: course.image,
          },
          buttonRef.current,
          Boolean(reduceMotion),
        )
      }
    >
      <span className="workshop-register-shimmer pointer-events-none absolute inset-0" aria-hidden />
      <EnrolIcon className="relative h-3.5 w-3.5" />
      <span className="relative">Enroll Now</span>
    </motion.button>
  );
}

function ViewCourseDetailsLink({ courseId }: { courseId: string }) {
  return (
    <Link href={`/courses/${courseId}`} className="catalog-view-details catalog-view-details-inline">
      View Course Details
      <span aria-hidden>→</span>
    </Link>
  );
}

function FeaturedCourse({
  reduceMotion,
  course,
}: {
  reduceMotion: boolean | null;
  course: CourseItem;
}) {
  if (reduceMotion) {
    return <FeaturedCourseStatic course={course} />;
  }

  return (
    <motion.article
      className="workshop-featured group relative overflow-hidden rounded-[1.75rem] border border-white/15"
      variants={featuredReveal}
      style={{ transformPerspective: 1200 }}
    >
      <div className="grid lg:grid-cols-12">
        <motion.div
          className="workshop-featured-media relative min-h-[260px] lg:col-span-7 lg:min-h-[340px]"
          variants={featuredImageReveal}
        >
          <motion.div className="absolute inset-0" variants={featuredImageZoom}>
            <Image
              src={course.image}
              alt={course.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              style={{ objectPosition: courseImagePosition(course) }}
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-deep/15 to-purple-deep/55 lg:via-purple-deep/8" />
          <div className="workshop-card-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <motion.div
            className="absolute left-5 top-5 z-[3] flex items-center gap-3"
            variants={featuredContentItem}
          >
            <CourseBadge label={course.badge} />
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
              <h3 className="font-serif text-3xl font-normal leading-tight text-white md:text-4xl">
                {course.title}
              </h3>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-white/60">{course.description}</p>
              <div className="mt-3.5">
                <ViewCourseDetailsLink courseId={course.id} />
              </div>
              <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/35">
                {course.duration}
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6"
              variants={featuredContentItem}
            >
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/40">Course Fee</p>
                <PriceTag priceCad={course.priceCad} large />
              </div>
              <EnrollButton course={course} className="px-6 py-2.5 text-[0.75rem] md:text-[0.8rem]" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function FeaturedCourseStatic({ course }: { course: CourseItem }) {
  return (
    <article className="workshop-featured group relative overflow-hidden rounded-[1.75rem] border border-white/15">
      <div className="grid lg:grid-cols-12">
        <div className="workshop-featured-media relative min-h-[260px] lg:col-span-7 lg:min-h-[340px]">
          <Image
            src={course.image}
            alt={course.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
            style={{ objectPosition: courseImagePosition(course) }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-deep/15 to-purple-deep/55 lg:via-purple-deep/8" />
          <div className="absolute left-5 top-5 flex items-center gap-3">
            <CourseBadge label={course.badge} />
          </div>
        </div>
        <div className="relative flex flex-col justify-between bg-[#2a1050]/82 p-6 backdrop-blur-xl md:p-8 lg:col-span-5">
          <div>
            <h3 className="font-serif text-3xl font-normal leading-tight text-white md:text-4xl">{course.title}</h3>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-white/60">{course.description}</p>
            <div className="mt-3.5">
              <ViewCourseDetailsLink courseId={course.id} />
            </div>
            <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white/35">{course.duration}</p>
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/40">Course Fee</p>
              <PriceTag priceCad={course.priceCad} large />
            </div>
            <EnrollButton course={course} className="px-6 py-2.5 text-[0.75rem] md:text-[0.8rem]" />
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
}: {
  course: CourseItem;
  index: number;
  reduceMotion: boolean | null;
}) {
  const variants = upcomingReveals[index] ?? upcomingReveals[1];

  if (reduceMotion) {
    return (
      <article className="workshop-upcoming group relative min-h-[420px] overflow-hidden rounded-[1.5rem] border border-white/15">
        <UpcomingCourseCardContent course={course} />
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
          style={{ objectPosition: courseImagePosition(course) }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#352560]/75 via-[#483878]/40 to-[#584890]/10" />
      <div className="workshop-card-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <motion.div className="absolute right-4 top-4 z-[3]" variants={cardPriceReveal}>
        <PriceTag priceCad={course.priceCad} />
      </motion.div>

      <motion.div className="absolute inset-x-0 bottom-0 z-[3] p-5 md:p-6" variants={cardOverlayReveal}>
        <CourseBadge label={course.badge} />
        <h3 className="font-serif mt-3 text-2xl leading-tight text-white">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-white/55">{course.description}</p>
        <div className="mt-3">
          <ViewCourseDetailsLink courseId={course.id} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-white/35">{course.duration}</span>
          <EnrollButton course={course} variant="outline" />
        </div>
      </motion.div>
    </motion.article>
  );
}

function UpcomingCourseCardContent({ course }: { course: CourseItem }) {
  return (
    <>
      <Image
        src={course.image}
        alt={course.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
        style={{ objectPosition: courseImagePosition(course) }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#352560]/75 via-[#483878]/40 to-[#584890]/10" />
      <div className="absolute right-4 top-4 z-[3]">
        <PriceTag priceCad={course.priceCad} />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[3] p-5 md:p-6">
        <CourseBadge label={course.badge} />
        <h3 className="font-serif mt-3 text-2xl leading-tight text-white">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-white/55">{course.description}</p>
        <div className="mt-3">
          <ViewCourseDetailsLink courseId={course.id} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-white/35">{course.duration}</span>
          <EnrollButton course={course} variant="outline" />
        </div>
      </div>
    </>
  );
}

const COURSES_SLIDER_AUTO_MS = 5200;

function useCoursesPerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setPerPage(media.matches ? 3 : 1);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return perPage;
}

function chunkCourses(courses: CourseItem[], size: number) {
  const pages: CourseItem[][] = [];
  for (let i = 0; i < courses.length; i += size) {
    pages.push(courses.slice(i, i + size));
  }
  return pages;
}

function CoursesUpcomingSlider({
  courses,
  reduceMotion,
}: {
  courses: CourseItem[];
  reduceMotion: boolean | null;
}) {
  const perPage = useCoursesPerPage();
  const pages = chunkCourses(courses, perPage);
  const pageCount = pages.length;
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(page);

  pageRef.current = page;

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const update = () => setViewportWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(pageCount - 1, 0)));
  }, [pageCount]);

  const goTo = useCallback(
    (index: number) => {
      if (pageCount <= 1) return;
      setPage(((index % pageCount) + pageCount) % pageCount);
    },
    [pageCount],
  );

  const next = useCallback(() => goTo(pageRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(pageRef.current - 1), [goTo]);

  const swipe = useHorizontalSwipe({
    enabled: pageCount > 1,
    onSwipeLeft: next,
    onSwipeRight: prev,
  });

  useEffect(() => {
    if (reduceMotion || paused || pageCount <= 1) return;
    const timer = window.setInterval(next, COURSES_SLIDER_AUTO_MS);
    return () => window.clearInterval(timer);
  }, [next, pageCount, paused, reduceMotion]);

  if (courses.length === 0) {
    return null;
  }

  if (pageCount <= 1 || reduceMotion) {
    return (
      <div className="grid gap-6 overflow-visible md:grid-cols-3">
        {courses.map((course, index) => (
          <UpcomingCourseCard
            key={course.id}
            course={course}
            index={index % 3}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="courses-upcoming-slider"
      aria-roledescription="carousel"
      aria-label="More online courses"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className={`courses-upcoming-slider-viewport overflow-hidden ${swipe.className}`}
        onPointerDown={swipe.onPointerDown}
        onPointerUp={swipe.onPointerUp}
        onPointerCancel={swipe.onPointerCancel}
      >
        <motion.div
          className="flex will-change-transform"
          animate={{ x: viewportWidth ? -page * viewportWidth : 0 }}
          transition={{ duration: 0.72, ease }}
        >
          {pages.map((pageCourses, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="grid shrink-0 grid-cols-1 gap-6 md:grid-cols-3"
              style={{ width: viewportWidth || "100%" }}
              aria-hidden={pageIndex !== page}
              {...(pageIndex !== page ? { inert: true } : {})}
            >
              {pageCourses.map((course, index) => (
                <UpcomingCourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  reduceMotion={false}
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {pageCount > 1 ? (
        <div className="courses-upcoming-slider-dots mt-5 flex items-center justify-center gap-2">
          {pages.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`courses-upcoming-slider-dot ${index === page ? "is-active" : ""}`}
              aria-label={`Show courses page ${index + 1}`}
              aria-current={index === page ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CoursesSection({
  courses,
  intro = coursesIntro,
}: {
  courses?: CourseItem[];
  intro?: typeof coursesIntro;
}) {
  const catalog = courses && courses.length > 0 ? courses : [...onlineCourses];
  const [featured, ...upcoming] = catalog;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(sectionRef);
  const description = resolveCoursesIntroDescription(intro.description, catalog.length);

  if (!featured) {
    return null;
  }

  return (
    <section
      id="courses"
      ref={sectionRef}
      className={`site-scroll-section relative overflow-hidden${animationsActive ? "" : " animations-paused"}`}
    >
      <div className="workshop-stage relative w-full overflow-hidden rounded-none">
        <div className="workshop-stage-mesh pointer-events-none absolute inset-0" aria-hidden />
        <div className="workshop-stage-gloss pointer-events-none absolute inset-0" aria-hidden />
        <div className="workshop-stage-shine workshop-gloss-sweep pointer-events-none absolute inset-0" aria-hidden />
        <div className="workshop-stage-noise pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden />

        <div className="workshop-stage-content relative grid gap-12 px-5 py-6 sm:px-8 md:p-10 lg:grid-cols-12 lg:gap-10 lg:px-12 xl:px-14 xl:py-14">
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
                {intro.eyebrow}
              </span>
            </div>

            <h2 className="font-serif mt-7 text-[2.4rem] font-normal leading-[1.05] tracking-[-0.02em] text-white md:text-5xl">
              {intro.title}
              <span className="mt-1 block bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text italic text-transparent">
                {intro.titleAccent}
              </span>
            </h2>

            <div className="workshop-title-line mt-6 h-px w-20 origin-left bg-gradient-to-r from-gold to-transparent" />

            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-white/55 md:text-[1.15rem] md:leading-7">
              {description}
            </p>

            <p className="mt-8 font-serif text-6xl font-normal text-white/8">
              {String(catalog.length).padStart(2, "0")}
            </p>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/30">Online programs</p>

            <Link
              href="/courses"
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

          {reduceMotion ? (
            <div className="space-y-6 lg:col-span-8">
              <FeaturedCourseStatic course={featured} />
              <CoursesUpcomingSlider courses={upcoming} reduceMotion={reduceMotion} />
            </div>
          ) : (
            <motion.div
              className="space-y-6 lg:col-span-8"
              variants={catalogStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12, margin: "-40px" }}
            >
              <FeaturedCourse reduceMotion={reduceMotion} course={featured} />
              <motion.div variants={catalogStagger}>
                <CoursesUpcomingSlider courses={upcoming} reduceMotion={reduceMotion} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
