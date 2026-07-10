"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { testimonials, testimonialsIntro } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 40"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.2 0C8.4 0 2 6.1 2 14.2c0 7.4 4.8 13.8 11.6 16.1-.3-2.8-.1-6 1.6-8.8 2.2-3.6 6.2-6 10.4-6.8C21.4 2.2 18.8 0 16.2 0zm29.6 0c-7.8 0-14.2 6.1-14.2 14.2 0 7.4 4.8 13.8 11.6 16.1-.3-2.8-.1-6 1.6-8.8 2.2-3.6 6.2-6 10.4-6.8C51 2.2 48.4 0 45.8 0z" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  item,
  index,
  featured = false,
  reduceMotion,
}: {
  item: (typeof testimonials)[number];
  index: number;
  featured?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      className={`testimonial-card group relative ${featured ? "testimonial-card-featured lg:-mt-6 lg:mb-6" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
    >
      <div className="testimonial-card-inner relative h-full overflow-hidden rounded-[1.75rem] border border-purple-deep/8 bg-white p-8 md:p-9">
        <div className="testimonial-card-corner testimonial-card-corner-tl" aria-hidden />
        <div className="testimonial-card-corner testimonial-card-corner-br" aria-hidden />
        <QuoteMark className="testimonial-quote-icon h-10 w-10 text-gold/35 transition-colors duration-500 group-hover:text-gold/55" />
        <p className="font-serif mt-6 text-[1.15rem] font-normal leading-[1.65] tracking-[-0.01em] text-purple-deep/85 md:text-[1.22rem]">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="testimonial-card-rule mt-8 h-px w-full bg-gradient-to-r from-gold/70 via-gold/25 to-transparent" />
        <footer className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-medium text-purple-deep">{item.name}</p>
            <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-purple-deep/45">
              {item.location}
            </p>
          </div>
          <Stars />
        </footer>
      </div>
    </motion.article>
  );
}

export function TestimonialsShowcaseSection({
  intro = testimonialsIntro,
  items = testimonials,
}: {
  intro?: typeof testimonialsIntro;
  items?: typeof testimonials;
}) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(sectionRef);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`testimonial-showcase relative overflow-hidden bg-canvas px-5 py-20 sm:px-8 md:py-24 lg:px-12 lg:py-28 xl:px-14 ${animationsActive ? "" : "animations-paused"}`}
    >
      <div className="testimonial-showcase-ornament pointer-events-none absolute left-1/2 top-12 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/35 to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease }}
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gold">
            {intro.eyebrow}
          </p>
          <h2 className="font-serif mt-4 text-[2.2rem] font-normal leading-[1.06] tracking-[-0.02em] text-purple-deep md:text-5xl">
            {intro.title}
            <span className="mt-1 block bg-gradient-to-r from-purple-deep via-purple-mid to-gold bg-clip-text italic text-transparent">
              {intro.titleAccent}
            </span>
          </h2>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="h-1.5 w-1.5 rotate-45 border border-gold/50 bg-gold/20" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
          </div>
          <p className="mt-6 text-base leading-relaxed text-purple-deep/60 md:text-[1.02rem]">
            {intro.description}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:mt-16 lg:grid-cols-3 lg:items-center lg:gap-8">
          <TestimonialCard item={items[0]} index={0} reduceMotion={!!reduceMotion} />
          <TestimonialCard
            item={items[1]}
            index={1}
            featured
            reduceMotion={!!reduceMotion}
          />
          <TestimonialCard item={items[2]} index={2} reduceMotion={!!reduceMotion} />
        </div>

        <motion.p
          className="mt-12 text-center font-serif text-sm italic text-purple-deep/35 md:mt-14"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          सत्यम् शिवम् सुन्दरम् — Truth, consciousness, and beauty in every healing journey
        </motion.p>
      </div>
    </section>
  );
}
