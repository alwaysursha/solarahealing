"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CatalogDetailCta } from "@/components/catalog/CatalogDetailCta";
import { toImageObjectPosition } from "@/lib/image-focus";
import { formatCad } from "@/lib/site";
import type { CartItemType } from "@/lib/cart/types";

export type CatalogDetailItem = {
  id: string;
  slug?: string;
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
  category?: string;
};

const courseHighlights = [
  "Self-paced modules you can revisit anytime",
  "Guided practices for daily energy alignment",
  "Certification-ready foundations and techniques",
  "Lifetime access after enrollment",
];

const workshopHighlights = [
  "Live facilitator guidance in real time",
  "Interactive practice with a supportive circle",
  "Limited seats for an intimate experience",
  "Clear next steps after your session",
];

const privateSessionHighlights = [
  "One-to-one attention tailored to your intention",
  "Purchase a session credit through secure checkout",
  "Scheduling arranged after purchase by WhatsApp or email",
  "A calm, private space for deep guidance",
];

function catalogKindCopy(type: CartItemType) {
  switch (type) {
    case "course":
      return {
        highlights: courseHighlights,
        backHref: "/#courses",
        backLabel: "Back to courses",
        kindLabel: "Online course",
        feeLabel: "Course Fee",
        sectionTitle: "Inside this course",
        asideTitle: "Enroll and start whenever you are ready.",
        asideCopy: "Add this course to your cart, then continue browsing or proceed to payment when you feel ready.",
      };
    case "workshop":
      return {
        highlights: workshopHighlights,
        backHref: "/#workshops",
        backLabel: "Back to workshops",
        kindLabel: "Live workshop",
        feeLabel: "Workshop Fee",
        sectionTitle: "Inside this workshop",
        asideTitle: "Reserve your seat while spots remain.",
        asideCopy: "Add this workshop to your cart, then continue browsing or proceed to payment when you feel ready.",
      };
    case "private_session":
      return {
        highlights: privateSessionHighlights,
        backHref: "/#sessions",
        backLabel: "Back to private sessions",
        kindLabel: "Private session",
        feeLabel: "Session Fee",
        sectionTitle: "Inside this session",
        asideTitle: "Book your session credit today.",
        asideCopy:
          "Add this private session to your cart. After payment, we’ll help you schedule a time that works for you.",
      };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function CatalogDetailView({
  type,
  item,
}: {
  type: CartItemType;
  item: CatalogDetailItem;
}) {
  const reduceMotion = useReducedMotion();
  const copy = catalogKindCopy(type);
  const objectPosition = toImageObjectPosition(item.imageFocusX ?? 50, item.imageFocusY ?? 50);

  return (
    <div className="catalog-detail">
      <div className="catalog-detail-aura" aria-hidden />

      <div className="catalog-detail-inner">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link href={copy.backHref} className="catalog-detail-back">
            ← {copy.backLabel}
          </Link>
        </motion.div>

        <motion.section
          className="catalog-detail-hero"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          <div className="catalog-detail-media">
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              style={{ objectPosition }}
            />
            <div className="catalog-detail-media-veil" aria-hidden />
            <div className="catalog-detail-media-badges">
              <span className="catalog-detail-badge">{item.badge}</span>
              {type === "workshop" ? <span className="catalog-detail-live">Live</span> : null}
            </div>
          </div>

          <div className="catalog-detail-hero-copy">
            <p className="catalog-detail-eyebrow">{copy.kindLabel}</p>
            <h1 className="catalog-detail-title">{item.title}</h1>
            <p className="catalog-detail-lead">{item.description}</p>

            <div className="catalog-detail-meta">
              {type === "workshop" ? (
                <div>
                  <p className="catalog-detail-meta-label">Schedule</p>
                  <p className="catalog-detail-meta-value">{item.date}</p>
                </div>
              ) : null}
              <div>
                <p className="catalog-detail-meta-label">Duration</p>
                <p className="catalog-detail-meta-value">{item.duration}</p>
              </div>
              {item.level ? (
                <div>
                  <p className="catalog-detail-meta-label">Pathway</p>
                  <p className="catalog-detail-meta-value">{item.level}</p>
                </div>
              ) : null}
            </div>

            <div className="catalog-detail-invest">
              <div>
                <p className="catalog-detail-meta-label">{copy.feeLabel}</p>
                <p className="catalog-detail-price">{formatCad(item.priceCad)}</p>
              </div>
              <CatalogDetailCta
                type={type}
                item={{
                  id: item.id,
                  title: item.title,
                  priceCad: item.priceCad,
                  image: item.image,
                }}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="catalog-detail-panel"
          initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <div>
            <p className="catalog-detail-eyebrow">What awaits you</p>
            <h2 className="catalog-detail-section-title">{copy.sectionTitle}</h2>
            <ul className="catalog-detail-highlights">
              {copy.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <aside className="catalog-detail-aside">
            <p className="catalog-detail-aside-eyebrow">Begin gently</p>
            <p className="catalog-detail-aside-title">{copy.asideTitle}</p>
            <p className="catalog-detail-aside-copy">{copy.asideCopy}</p>
            <CatalogDetailCta
              type={type}
              item={{
                id: item.id,
                title: item.title,
                priceCad: item.priceCad,
                image: item.image,
              }}
            />
          </aside>
        </motion.section>
      </div>
    </div>
  );
}
