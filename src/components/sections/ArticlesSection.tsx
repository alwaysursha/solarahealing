"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  articlesFeatured,
  articlesIntro,
  articlesList,
  articlesSecondary,
} from "@/lib/site";

type FeaturedArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  cta: string;
};

type SecondaryArticle = FeaturedArticle;

type ListArticle = {
  slug: string;
  title: string;
  description: string;
  linkLabel: string;
  image: string;
  imageAlt: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const listItemReveal = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease } },
};

function ReadLink({ label }: { label: string }) {
  return (
    <span className="article-read-link inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-purple-mid transition-colors group-hover:text-gold">
      <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
      {label}
    </span>
  );
}

function FeaturedArticleCard({ article }: { article: FeaturedArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="article-featured group relative z-0 block min-h-[26rem] overflow-hidden rounded-[1.75rem] md:min-h-[30rem]"
    >
      <Image
        src={article.image}
        alt={article.imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 42vw"
        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        priority
      />
      <div className="article-featured-overlay absolute inset-0" />
      <div className="article-featured-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-end p-7 md:p-9">
        <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/85 backdrop-blur-md">
          {article.category}
        </span>
        <h3 className="font-serif mt-5 max-w-md text-[2rem] font-normal leading-[1.08] tracking-[-0.02em] text-white md:text-[2.35rem]">
          {article.title}
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/72 md:text-[0.95rem]">
          {article.excerpt}
        </p>
        <span className="article-featured-cta mt-7 inline-flex w-fit items-center rounded-full border border-white/30 bg-white/12 px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-md transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-purple-deep group-hover:shadow-[0_10px_28px_-14px_rgba(0,0,0,0.45)]">
          {article.cta}
        </span>
      </div>
    </Link>
  );
}

function SecondaryArticleCard({
  article,
}: {
  article: SecondaryArticle;
}) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="article-secondary group block overflow-hidden rounded-[1.35rem] border border-purple-deep/6 bg-white shadow-[0_8px_40px_-20px_rgba(45,27,78,0.12)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_20px_50px_-20px_rgba(75,0,130,0.18)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="p-5 md:p-6">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold">
          {article.category}
        </p>
        <h3 className="font-serif mt-2 text-xl font-normal tracking-[-0.01em] text-purple-deep">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-purple-deep/60">
          {article.excerpt}
        </p>
        <span className="mt-4 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-purple-mid transition-colors group-hover:text-gold">
          {article.cta} →
        </span>
      </div>
    </Link>
  );
}

function ArticleListItem({
  article,
  index,
}: {
  article: ListArticle;
  index: number;
}) {
  return (
    <motion.li variants={listItemReveal}>
      <Link
        href={`/blog/${article.slug}`}
        className="article-list-item group grid grid-cols-[1fr_auto] items-center gap-5 py-8 md:grid-cols-[1fr_9.5rem] md:gap-8 md:py-9"
      >
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-purple-deep/45">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="font-serif mt-2 text-xl font-normal tracking-[-0.01em] text-purple-deep transition-colors group-hover:text-purple-mid md:text-[1.35rem]">
            {article.title}
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-purple-deep/58 md:text-[0.92rem]">
            {article.description}
          </p>
          <div className="mt-5">
            <ReadLink label={article.linkLabel} />
          </div>
        </div>

        <div className="article-list-thumb relative h-[4.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-xl md:h-[5.75rem] md:w-[9.5rem] md:rounded-2xl">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="152px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-purple-deep/8 transition-colors duration-300 group-hover:ring-gold/30" />
        </div>
      </Link>
    </motion.li>
  );
}

export function ArticlesSection({
  intro = articlesIntro,
  featured = articlesFeatured,
  secondary = [...articlesSecondary],
  list = [...articlesList],
}: {
  intro?: typeof articlesIntro;
  featured?: FeaturedArticle;
  secondary?: SecondaryArticle[];
  list?: ListArticle[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="insights" className="article-section relative bg-canvas px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 md:mb-16 lg:mb-20"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-gold">
            {intro.eyebrow}
          </p>
          <h2 className="font-serif mt-4 text-[2.2rem] font-normal leading-[1.06] tracking-[-0.02em] text-purple-deep md:text-5xl">
            {intro.title}
            <span className="mt-1 block bg-gradient-to-r from-purple-mid via-gold to-purple-mid bg-clip-text italic text-transparent">
              {intro.titleAccent}
            </span>
          </h2>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold/70 to-transparent" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-purple-deep/65 md:text-[1.02rem]">
            {intro.description}
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
          <motion.div
            className="space-y-5 lg:col-span-5"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.85, ease }}
          >
            <FeaturedArticleCard article={featured} />
            <div className="grid gap-5 sm:grid-cols-2">
              {secondary.map((article) => (
                <SecondaryArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            {reduceMotion ? (
              <ul className="article-list divide-y divide-purple-deep/8">
                {list.map((article, index) => (
                  <li key={article.slug}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="article-list-item group grid grid-cols-[1fr_auto] items-center gap-5 py-8 md:grid-cols-[1fr_9.5rem] md:gap-8 md:py-9"
                    >
                      <div className="min-w-0">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-purple-deep/45">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-serif mt-2 text-xl font-normal text-purple-deep md:text-[1.35rem]">
                          {article.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-purple-deep/58">
                          {article.description}
                        </p>
                        <div className="mt-5">
                          <ReadLink label={article.linkLabel} />
                        </div>
                      </div>
                      <div className="article-list-thumb relative h-[4.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-xl md:h-[5.75rem] md:w-[9.5rem] md:rounded-2xl">
                        <Image
                          src={article.image}
                          alt={article.imageAlt}
                          fill
                          sizes="152px"
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <motion.ul
                className="article-list divide-y divide-purple-deep/8"
                variants={listStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15, margin: "-40px" }}
              >
                {list.map((article, index) => (
                  <ArticleListItem key={article.slug} article={article} index={index} />
                ))}
              </motion.ul>
            )}

            <motion.div
              className="mt-10 flex justify-end md:mt-12"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-purple-mid transition-colors hover:text-gold"
              >
                View all articles
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-deep/12 transition-all duration-300 group-hover:border-gold/40 group-hover:bg-gold/8">
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
          </div>
        </div>
      </div>
    </section>
  );
}
