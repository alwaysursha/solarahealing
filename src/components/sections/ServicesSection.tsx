"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import { ChakraDivider } from "@/components/ui/ChakraDivider";
import { services } from "@/lib/site";

import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  hands: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
    />
  ),
  waves: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
    />
  ),
  chakra: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  ),
  lotus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
    />
  ),
};

export function ServicesSection() {
  return (
    <section id="sessions" className="bg-cream/40 px-6 py-20 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <ChakraDivider />
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Healing Sessions
          </p>
          <h2 className="font-display mt-4 text-center text-3xl font-semibold text-purple-deep md:text-4xl">
            Pathways to wholeness
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <SectionReveal key={service.title} delay={i * 0.1}>
              <article className="group h-full rounded-2xl border border-purple-deep/8 bg-canvas p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-deep/5 text-gold transition-colors group-hover:bg-gold/10">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    {icons[service.icon]}
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-purple-deep">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gold">
                  {service.duration}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-purple-deep/65">
                  {service.description}
                </p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
