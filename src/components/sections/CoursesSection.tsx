"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { CartIcon } from "@/components/ui/CartIcon";
import { coursesIntro, formatCad, onlineCourses } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const slideEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const courseCount = onlineCourses.length;

type CarouselLayout = {
  cardWidth: number;
  contentWidth: number;
  gapPx: number;
  visibleCount: number;
};

const defaultLayout: CarouselLayout = {
  cardWidth: 280,
  contentWidth: 1200,
  gapPx: 24,
  visibleCount: 4,
};

function getVisibleCount(width: number) {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
  return 1;
}

function CourseCard({
  course,
  cardWidth,
  reduceMotion,
}: {
  course: (typeof onlineCourses)[number];
  cardWidth: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      className="courses-card group relative shrink-0 grow-0"
      style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <div className="courses-card-inner overflow-hidden rounded-[1.65rem] backdrop-blur-md">
        <div className="courses-card-shine pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={course.image}
            alt={course.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
          <div className="courses-card-image-overlay absolute inset-0" />
          <span className="absolute left-5 top-5 z-10 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-cream/90 backdrop-blur-md">
            {course.level}
          </span>
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 pt-16">
            <p className="courses-price font-serif text-[2rem] font-normal leading-none tracking-[-0.02em] text-gold-light md:text-[2.15rem]">
              {formatCad(course.priceCad)}
            </p>
            <p className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-cream/55">
              Canadian dollars
            </p>
          </div>
        </div>

        <div className="relative space-y-5 p-6 pt-5 md:p-7">
          <h3 className="font-serif text-xl font-normal leading-snug tracking-[-0.01em] text-cream md:text-[1.35rem]">
            {course.title}
          </h3>

          <Link
            href={`/checkout?course=${course.id}`}
            className="courses-cart-btn group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-purple-deep/30 bg-purple-deep px-6 py-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold shadow-lg shadow-purple-deep/25 transition-colors hover:border-gold/35 hover:bg-purple-mid"
          >
            <span className="courses-cart-shimmer pointer-events-none absolute inset-0" />
            <CartIcon className="relative h-4 w-4" />
            <span className="relative">Add to Cart</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function CoursesSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationsActive = useAnimationsActive(sectionRef);
  const [slideIndex, setSlideIndex] = useState(0);
  const [layout, setLayout] = useState<CarouselLayout>(defaultLayout);
  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 260, damping: 34, mass: 0.95 });

  const { cardWidth, gapPx, visibleCount } = layout;
  const slideCount = Math.max(1, Math.ceil(courseCount / visibleCount));
  const maxSlideIndex = slideCount - 1;
  const pageStep = visibleCount * (cardWidth + gapPx);

  const measureLayout = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportWidth = viewport.getBoundingClientRect().width;
    const viewportStyles = getComputedStyle(viewport);
    const edgePad =
      (Number.parseFloat(viewportStyles.paddingLeft) || 0) +
      (Number.parseFloat(viewportStyles.paddingRight) || 0);
    const nextContentWidth = viewportWidth - edgePad;
    const nextVisible = getVisibleCount(viewportWidth);
    const track = viewport.querySelector(".courses-track");
    const nextGapPx = track
      ? Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16
      : 16;
    const totalGaps = nextGapPx * (nextVisible - 1);
    const nextCardWidth = Math.floor(((nextContentWidth - totalGaps) / nextVisible) * 100) / 100;

    setLayout({
      cardWidth: nextCardWidth,
      contentWidth: nextContentWidth,
      gapPx: nextGapPx,
      visibleCount: nextVisible,
    });

    const nextSlideCount = Math.max(1, Math.ceil(courseCount / nextVisible));
    setSlideIndex((current) => Math.min(current, nextSlideCount - 1));
  }, []);

  useEffect(() => {
    measureLayout();
    window.addEventListener("resize", measureLayout);
    return () => window.removeEventListener("resize", measureLayout);
  }, [measureLayout]);

  useEffect(() => {
    const target = -slideIndex * pageStep;
    if (reduceMotion) {
      dragX.set(target);
      return;
    }
    animate(dragX, target, { duration: 0.72, ease: slideEase });
  }, [slideIndex, pageStep, dragX, reduceMotion]);

  const goToSlide = useCallback(
    (index: number) => {
      setSlideIndex(Math.max(0, Math.min(maxSlideIndex, index)));
    },
    [maxSlideIndex],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = Math.min(pageStep * 0.12, 80);
    if (info.offset.x < -threshold || info.velocity.x < -420) {
      goToSlide(slideIndex + 1);
      return;
    }
    if (info.offset.x > threshold || info.velocity.x > 420) {
      goToSlide(slideIndex - 1);
      return;
    }
    goToSlide(slideIndex);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(slideIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(slideIndex + 1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goToSlide(maxSlideIndex);
      }
    };

    carousel.addEventListener("keydown", onKeyDown);
    return () => carousel.removeEventListener("keydown", onKeyDown);
  }, [goToSlide, maxSlideIndex, slideIndex]);

  const visibleRange = useMemo(() => {
    const start = slideIndex * visibleCount + 1;
    const end = Math.min((slideIndex + 1) * visibleCount, courseCount);
    return { start, end };
  }, [slideIndex, visibleCount]);

  const dragConstraints = useMemo(
    () => ({ left: -maxSlideIndex * pageStep, right: 0 }),
    [maxSlideIndex, pageStep],
  );

  return (
    <section
      id="courses"
      ref={sectionRef}
      className={`courses-section relative w-full overflow-hidden py-20 md:py-24 lg:py-28 ${animationsActive ? "" : "animations-paused"}`}
    >

      <motion.div
        className="relative z-[1] mb-10 px-5 sm:mb-12 sm:px-8 md:mb-14 md:px-10 lg:px-12 xl:px-14"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease }}
      >
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-purple-deep/80">
          {coursesIntro.eyebrow}
        </p>
        <h2 className="font-serif mt-4 text-[2.2rem] font-normal leading-[1.06] tracking-[-0.02em] text-gray-50 md:text-5xl">
          {coursesIntro.title}
          <span className="mt-1 block bg-gradient-to-r from-purple-deep via-purple-mid to-purple-deep bg-clip-text italic text-transparent">
            {coursesIntro.titleAccent}
          </span>
        </h2>
        <div className="mt-6 h-px w-20 bg-gradient-to-r from-purple-deep/60 to-transparent" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-50 md:text-[1.02rem]">
          {coursesIntro.description}
        </p>
      </motion.div>

      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Soulara Healing online courses"
        tabIndex={0}
        className="courses-carousel relative z-[1] w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-deep/25"
      >
        <p className="sr-only">
          Showing courses {visibleRange.start} to {visibleRange.end} of {courseCount}. Use arrow keys
          or swipe to browse.
        </p>

        <div ref={viewportRef} className="courses-slider-viewport overflow-hidden py-4 md:py-6">
          <motion.div
            className="courses-track flex cursor-grab select-none active:cursor-grabbing"
            style={{ x: springX, gap: gapPx }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={dragConstraints}
            dragElastic={0.04}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            {onlineCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                cardWidth={cardWidth}
                reduceMotion={!!reduceMotion}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative z-[1] mt-8 flex items-center justify-between gap-6 px-5 sm:px-8 md:mt-10 md:px-10 lg:px-12 xl:px-14">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="courses-nav-btn"
            aria-label="Previous courses"
            disabled={slideIndex === 0}
            onClick={() => goToSlide(slideIndex - 1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="courses-nav-btn"
            aria-label="Next courses"
            disabled={slideIndex === maxSlideIndex}
            onClick={() => goToSlide(slideIndex + 1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M7 4l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center gap-2">
          {Array.from({ length: slideCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show course page ${index + 1}`}
              aria-current={index === slideIndex ? "true" : undefined}
              className={`courses-dot h-1.5 rounded-full transition-all duration-500 ${index === slideIndex ? "courses-dot-active w-8 bg-purple-deep" : "w-1.5 bg-purple-deep/20 hover:bg-purple-deep/35"}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <p className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-purple-deep/50 sm:block">
          {String(visibleRange.start).padStart(2, "0")}–{String(visibleRange.end).padStart(2, "0")}{" "}
          / {String(courseCount).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
