"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { ChakraDivider } from "@/components/ui/ChakraDivider";
import { testimonials } from "@/lib/site";

export function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, reduceMotion]);

  return (
    <section id="testimonials" className="px-6 py-20 md:px-12 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <SectionReveal>
          <ChakraDivider />
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Testimonials
          </p>
          <h2 className="font-display mt-4 text-center text-3xl font-semibold text-purple-deep md:text-4xl">
            Voices of transformation
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.15} className="mt-14">
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active}
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="font-display text-xl leading-relaxed text-purple-deep/80 md:text-2xl">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </p>
                <footer className="mt-8">
                  <p className="font-medium text-purple-deep">
                    {testimonials[active].name}
                  </p>
                  <p className="text-sm text-purple-deep/50">
                    {testimonials[active].location}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active
                    ? "w-8 bg-gold"
                    : "w-2 bg-purple-deep/20 hover:bg-purple-deep/40"
                }`}
              />
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
