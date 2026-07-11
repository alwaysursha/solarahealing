"use client";

import { useState, type FormEvent } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { ChakraDivider } from "@/components/ui/ChakraDivider";
import { site } from "@/lib/site";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="bg-cream/40 px-6 py-20 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <ChakraDivider />
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-gold">
            Begin Your Journey
          </p>
          <h2 className="font-display mt-4 text-center text-3xl font-semibold text-purple-deep md:text-4xl">
            Book a healing session
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <SectionReveal delay={0.1}>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-purple-deep/50">Email</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-purple-deep transition-colors hover:text-gold"
                >
                  {site.contact.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-deep/50">Phone</p>
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="text-purple-deep transition-colors hover:text-gold"
                >
                  {site.contact.phone}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-purple-deep/50">Location</p>
                <p className="text-purple-deep">{site.contact.location}</p>
              </div>
              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-5 py-2.5 text-sm font-medium text-[#128C7E] transition-colors hover:bg-[#25D366]/20"
              >
                Chat on WhatsApp
              </a>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            {submitted ? (
              <div className="rounded-2xl border border-gold/30 bg-canvas p-8 text-center">
                <p className="font-display text-xl text-purple-deep">
                  Thank you for reaching out
                </p>
                <p className="mt-2 text-sm text-purple-deep/60">
                  We will respond within 24 hours. Namaste.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm text-purple-deep/60">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-xl border border-purple-deep/10 bg-canvas px-4 py-3 text-purple-deep outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm text-purple-deep/60">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-purple-deep/10 bg-canvas px-4 py-3 text-purple-deep outline-none transition-colors focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm text-purple-deep/60">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full resize-none rounded-xl border border-purple-deep/10 bg-canvas px-4 py-3 text-purple-deep outline-none transition-colors focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="relative inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-cream shadow-lg shadow-gold/25 transition-colors hover:bg-gold-light"
                >
                  Send Message
                </button>
              </form>
            )}
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
