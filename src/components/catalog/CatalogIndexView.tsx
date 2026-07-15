"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CatalogDetailCta } from "@/components/catalog/CatalogDetailCta";
import type { CatalogDetailItem } from "@/components/catalog/CatalogDetailView";
import { toImageObjectPosition } from "@/lib/image-focus";
import { formatCad } from "@/lib/site";
import type { CartItemType } from "@/lib/cart/types";

type CatalogIndexViewProps = {
  type: CartItemType;
  items: CatalogDetailItem[];
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
};

function IndexCard({ type, item }: { type: CartItemType; item: CatalogDetailItem }) {
  const detailHref =
    type === "course"
      ? `/courses/${item.id}`
      : type === "workshop"
        ? `/workshops/${item.id}`
        : `/sessions/${item.id}`;
  const objectPosition = toImageObjectPosition(item.imageFocusX ?? 50, item.imageFocusY ?? 50);
  const detailsLabel =
    type === "course"
      ? "View Course Details"
      : type === "workshop"
        ? "View Workshop Details"
        : "View Session Details";

  return (
    <article
      className={[
        "catalog-index-card",
        type === "workshop" ? "catalog-index-card-workshop" : "",
        type === "private_session" ? "catalog-index-card-session" : "",
      ].join(" ")}
    >
      <Link href={detailHref} className="catalog-index-card-media">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover"
          style={{ objectPosition }}
        />
        <span className="catalog-index-card-veil" aria-hidden />
        <span className="catalog-index-card-badge">{item.badge}</span>
        {type === "workshop" ? <span className="catalog-index-card-live">Live</span> : null}
      </Link>

      <div className="catalog-index-card-body">
        <p className="catalog-index-card-meta">
          {type === "workshop" ? (
            <>
              {item.date}
              <span aria-hidden>·</span>
            </>
          ) : null}
          {item.duration}
        </p>
        <h2 className="catalog-index-card-title">
          <Link href={detailHref}>{item.title}</Link>
        </h2>
        {item.level ? <p className="catalog-index-card-level">{item.level}</p> : null}
        <p className="catalog-index-card-copy">{item.description}</p>

        <div className="catalog-index-card-footer">
          <p className="catalog-index-card-price">{formatCad(item.priceCad)}</p>
          <div className="catalog-index-card-actions">
            <CatalogDetailCta
              type={type}
              item={{
                id: item.id,
                title: item.title,
                priceCad: item.priceCad,
                image: item.image,
              }}
            />
            <Link href={detailHref} className="catalog-index-card-details">
              {detailsLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CatalogIndexView({
  type,
  items,
  eyebrow,
  title,
  titleAccent,
  description,
}: CatalogIndexViewProps) {
  const reduceMotion = useReducedMotion();
  const countLabel =
    type === "course"
      ? "online programs"
      : type === "workshop"
        ? "upcoming sessions"
        : "private sessions";

  return (
    <div className="catalog-index">
      <div className="catalog-index-aura" aria-hidden />
      <div className="catalog-index-inner">
        <motion.header
          className="catalog-index-hero"
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="catalog-index-eyebrow">{eyebrow}</p>
          <h1 className="catalog-index-title">
            {title}
            <span>{titleAccent}</span>
          </h1>
          <p className="catalog-index-copy">{description}</p>
          <div className="catalog-index-count">
            <span className="catalog-index-count-number">{String(items.length).padStart(2, "0")}</span>
            <span className="catalog-index-count-label">{countLabel}</span>
          </div>
        </motion.header>

        {items.length === 0 ? (
          <div className="catalog-index-empty">
            <p className="catalog-index-empty-title">Nothing published yet</p>
            <p className="catalog-index-empty-copy">
              Check back soon for new{" "}
              {type === "course" ? "courses" : type === "workshop" ? "workshops" : "private sessions"}.
            </p>
            <Link href="/" className="catalog-index-empty-link">
              Back to home →
            </Link>
          </div>
        ) : (
          <motion.div
            className="catalog-index-grid"
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 }}
          >
            {items.map((item) => (
              <IndexCard key={item.id} type={type} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
