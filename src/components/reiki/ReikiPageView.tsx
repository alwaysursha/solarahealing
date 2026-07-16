"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { ReikiBenefitTabId, ReikiPageContent } from "@/lib/reiki-page";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

function BookSessionCtaIcon({ className = "h-4 w-4" }: { className?: string }) {
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

function BookSessionCta({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="catalog-detail-cta">
      <span className="catalog-detail-cta-shine" aria-hidden />
      <BookSessionCtaIcon className="relative h-4 w-4" />
      <span className="relative">{label}</span>
    </Link>
  );
}

const benefitIcons: Record<ReikiBenefitTabId, ReactNode> = {
  mind: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="reiki-benefits-tab-icon">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.5 3.75a4.75 4.75 0 0 0-4.55 3.4A3.9 3.9 0 0 0 4.5 11c0 1.7 1.05 3.15 2.55 3.7V17.5c0 .55.45 1 1 1h3.2c.55 0 1-.45 1-1v-1.1c1.7-.2 3.05-1.65 3.05-3.4 0-.55-.12-1.07-.33-1.53A4.74 4.74 0 0 0 12.5 3.75Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M9.2 20.5h3.1M14.75 8.25c.7.35 1.2 1.05 1.2 1.9"
      />
    </svg>
  ),
  body: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="reiki-benefits-tab-icon">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.25s-6.75-3.9-6.75-9.15A3.9 3.9 0 0 1 12 7.8a3.9 3.9 0 0 1 6.75 3.3c0 5.25-6.75 9.15-6.75 9.15Z"
      />
    </svg>
  ),
  soul: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="reiki-benefits-tab-icon">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5v2.2M12 18.3v2.2M4.9 7.4l1.55 1.55M17.55 15.05l1.55 1.55M3.5 12h2.2M18.3 12h2.2M4.9 16.6l1.55-1.55M17.55 8.95l1.55-1.55"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

function SectionHead({
  eyebrow,
  title,
  titleAccent,
  description,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description?: string;
}) {
  return (
    <motion.header
      className="reiki-section-head"
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="reiki-eyebrow">{eyebrow}</p>
      <h2 className="reiki-section-title">
        {title}
        {titleAccent ? <span> {titleAccent}</span> : null}
      </h2>
      {description ? <p className="reiki-section-copy">{description}</p> : null}
    </motion.header>
  );
}

export function ReikiPageView({ content }: { content: ReikiPageContent }) {
  const reduceMotion = useReducedMotion();
  const [benefitTab, setBenefitTab] = useState<ReikiBenefitTabId>("mind");
  const [openFaqId, setOpenFaqId] = useState<string | null>(content.faq.items[0]?.id ?? null);
  const activeBenefits =
    content.benefits.tabs.find((tab) => tab.id === benefitTab) ?? content.benefits.tabs[0];

  return (
    <div className="reiki-page">
      {/* Hero — one composition */}
      <section className="reiki-hero" aria-label="Reiki hero">
        <div className="reiki-hero-media" aria-hidden>
          <Image
            src={content.hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="reiki-hero-veil" />
          <div className="reiki-hero-grain" />
          {!reduceMotion ? (
            <>
              <motion.div
                className="reiki-hero-float reiki-hero-float-a"
                animate={{ y: [0, -18, 0], opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="reiki-hero-float reiki-hero-float-b"
                animate={{ y: [0, 14, 0], opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            </>
          ) : null}
        </div>

        <div className="reiki-hero-inner">
          <motion.p
            className="reiki-hero-brand"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease }}
          >
            {content.hero.eyebrow}
          </motion.p>
          <motion.h1
            className="reiki-hero-title"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease }}
          >
            {content.hero.title}
            <span> {content.hero.titleAccent}</span>
          </motion.h1>
          <motion.p
            className="reiki-hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease }}
          >
            {content.hero.description}
          </motion.p>
          <motion.div
            className="reiki-hero-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.24, ease }}
          >
            <BookSessionCta
              href={content.hero.primaryCta.href}
              label={content.hero.primaryCta.label}
            />
            <Link href={content.hero.secondaryCta.href} className="reiki-hero-ghost">
              {content.hero.secondaryCta.label}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What is Reiki */}
      <section id="reiki-what" className="reiki-intro">
        <div className="reiki-intro-aura" aria-hidden />
        <div className="reiki-intro-inner">
          <div className="reiki-intro-grid">
            <div className="reiki-intro-head">
              <SectionHead
                eyebrow={content.intro.eyebrow}
                title={content.intro.title}
                titleAccent={content.intro.titleAccent}
              />
            </div>
            <motion.div
              className="reiki-intro-visual"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1, ease }}
            >
              <Image
                src={content.intro.image}
                alt={content.intro.imageAlt}
                fill
                sizes="(max-width: 960px) 100vw, 40vw"
                className="reiki-intro-visual-image object-cover"
              />
              <div className="reiki-intro-visual-veil" aria-hidden />
              <p className="reiki-intro-visual-caption">{content.intro.visualCaption}</p>
            </motion.div>
            <motion.div
              className="reiki-intro-copy"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {content.intro.paragraphs.map((paragraph) => (
                <motion.p key={paragraph.slice(0, 24)} variants={rise}>
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits tabs */}
      <section id="reiki-benefits" className="reiki-benefits">
        <div className="reiki-benefits-aura" aria-hidden />
        <div className="reiki-benefits-inner">
          <SectionHead
            eyebrow={content.benefits.eyebrow}
            title={content.benefits.title}
            titleAccent={content.benefits.titleAccent}
          />

          <div className="reiki-benefits-panel">
            <div className="reiki-benefits-tabs" role="tablist" aria-label="Reiki benefits">
              {content.benefits.tabs.map((tab) => {
                const selected = tab.id === benefitTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={["reiki-benefits-tab", selected ? "reiki-benefits-tab-active" : ""].join(
                      " ",
                    )}
                    onClick={() => setBenefitTab(tab.id)}
                  >
                    {benefitIcons[tab.id]}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={activeBenefits.id}
                className="reiki-benefits-list"
                role="tabpanel"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
              >
                {activeBenefits.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Chakras */}
      <section className="reiki-chakras">
        <div className="reiki-chakras-inner">
          <SectionHead
            eyebrow={content.chakras.eyebrow}
            title={content.chakras.title}
            titleAccent={content.chakras.titleAccent}
            description={content.chakras.description}
          />
          <motion.div
            className="reiki-chakra-row"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {["Root", "Sacral", "Solar", "Heart", "Throat", "Third Eye", "Crown"].map((name, i) => (
              <motion.span
                key={name}
                className="reiki-chakra-dot"
                style={{ "--i": i } as CSSProperties}
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.18, 1], opacity: [0.55, 1, 0.55] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 3.2, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }
                }
              >
                <em>{name}</em>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pathways */}
      <section className="reiki-pathways">
        <div className="reiki-pathways-inner">
          <SectionHead
            eyebrow={content.pathways.eyebrow}
            title={content.pathways.title}
            titleAccent={content.pathways.titleAccent}
          />
          <motion.div
            className="reiki-pathways-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.article className="reiki-pathway" variants={rise}>
              <p className="reiki-pathway-eyebrow">Receive</p>
              <h3 className="reiki-pathway-title">{content.pathways.session.title}</h3>
              <p className="reiki-pathway-copy">{content.pathways.session.copy}</p>
              <BookSessionCta
                href={content.pathways.session.href}
                label={content.pathways.session.cta}
              />
            </motion.article>
            <motion.article className="reiki-pathway reiki-pathway-alt" variants={rise}>
              <p className="reiki-pathway-eyebrow">Learn</p>
              <h3 className="reiki-pathway-title">{content.pathways.courses.title}</h3>
              <p className="reiki-pathway-copy">{content.pathways.courses.copy}</p>
              <Link href={content.pathways.courses.href} className="reiki-pathway-ghost">
                {content.pathways.courses.cta}
              </Link>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section id="reiki-faq" className="reiki-faq">
        <div className="reiki-faq-inner">
          <SectionHead
            eyebrow={content.faq.eyebrow}
            title={content.faq.title}
            titleAccent={content.faq.titleAccent}
            description={content.faq.description}
          />
          <div className="reiki-faq-list">
            {content.faq.items.map((item) => {
              const open = openFaqId === item.id;
              return (
                <div key={item.id} className={["reiki-faq-item", open ? "reiki-faq-item-open" : ""].join(" ")}>
                  <button
                    type="button"
                    className="reiki-faq-trigger"
                    aria-expanded={open}
                    onClick={() => setOpenFaqId(open ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    <span className="reiki-faq-icon" aria-hidden>
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        key={`${item.id}-answer`}
                        className="reiki-faq-answer"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="reiki-close">
        <div className="reiki-close-veil" aria-hidden />
        <motion.div
          className="reiki-close-inner"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease }}
        >
          <h2 className="reiki-close-title">
            {content.close.title}
            <span> {content.close.titleAccent}</span>
          </h2>
          <p className="reiki-close-copy">{content.close.description}</p>
          <BookSessionCta href={content.close.cta.href} label={content.close.cta.label} />
        </motion.div>
      </section>
    </div>
  );
}
