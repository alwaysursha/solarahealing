"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { scheduleBooking } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ScheduleSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(sectionRef);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className={`schedule-section relative mt-12 w-full overflow-hidden md:mt-16 lg:mt-20 ${animationsActive ? "" : "animations-paused"}`}
    >
      <div className="schedule-section-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="schedule-section-mist pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-[1] grid min-h-[28rem] lg:min-h-[32rem] lg:grid-cols-12 lg:items-center">
        <motion.div
          className="schedule-content-panel group relative flex flex-col justify-center overflow-hidden px-5 py-16 sm:px-8 md:px-10 md:py-20 lg:col-span-5 lg:overflow-visible lg:px-12 xl:px-14 xl:py-24"
          initial={reduceMotion ? false : { opacity: 0, x: -32 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease }}
        >
          <div className="schedule-content-bg pointer-events-none absolute inset-0 lg:hidden" aria-hidden>
            <Image
              src={scheduleBooking.image}
              alt=""
              fill
              sizes="100vw"
              className="schedule-content-bg-image object-cover object-[center_15%]"
            />
            <div className="schedule-content-bg-overlay absolute inset-0" />
          </div>

          <div className="relative z-[1]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gray-50/75">
              {scheduleBooking.eyebrow}
            </p>
            <h2 className="font-serif mt-5 max-w-md text-[2.15rem] font-normal leading-[1.08] tracking-[-0.02em] text-gray-50 md:text-[2.65rem] lg:text-[2.85rem]">
              {scheduleBooking.title}
            </h2>

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={scheduleBooking.ctaHref}
                className="schedule-cta-btn inline-flex w-fit items-center justify-center rounded-full bg-purple-deep px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gray-50 shadow-lg shadow-purple-deep/35 transition-colors hover:bg-purple-mid"
              >
                {scheduleBooking.cta}
              </Link>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {scheduleBooking.socialProof.avatars.map((avatar, index) => (
                    <div
                      key={avatar.src}
                      className="schedule-avatar relative h-11 w-11 overflow-hidden rounded-full border-2 border-purple-deep/80 bg-purple-deep/40"
                      style={{ zIndex: 10 - index, marginLeft: index === 0 ? 0 : -12 }}
                    >
                      <Image
                        src={avatar.src}
                        alt={avatar.alt}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-50/30 bg-purple-mid/60 text-[0.62rem] font-bold text-gray-50"
                    style={{ marginLeft: -12, zIndex: 0 }}
                  >
                    {scheduleBooking.socialProof.count}
                  </div>
                </div>
                <p className="max-w-[9rem] text-[0.68rem] font-medium leading-snug text-gray-50/70">
                  {scheduleBooking.socialProof.label}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="schedule-portrait-panel group relative hidden min-h-[32rem] lg:col-span-7 lg:block"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease }}
        >
          <div className="schedule-aura pointer-events-none absolute inset-0 z-[1]" aria-hidden />
          <div className="schedule-aura-ring pointer-events-none absolute z-[2]" aria-hidden />

          <div className="absolute inset-0 z-[3] overflow-hidden">
            <Image
              src={scheduleBooking.image}
              alt={scheduleBooking.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="schedule-portrait-image object-cover object-[center_15%]"
            />
            <div className="schedule-portrait-overlay pointer-events-none absolute inset-0" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
