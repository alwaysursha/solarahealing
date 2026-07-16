export const REIKI_INTRO_COURSE_ID = "introduction-to-reiki";

export const reikiNavLinks = [
  {
    id: "what",
    label: "What's Reiki?",
    href: "/reiki#reiki-what",
    blurb: "Universal energy, gentle presence",
  },
  {
    id: "benefits",
    label: "Benefits of Reiki",
    href: "/reiki#reiki-benefits",
    blurb: "Mind, body, and soul",
  },
  {
    id: "faq",
    label: "FAQs",
    href: "/reiki#reiki-faq",
    blurb: "Common questions, clear answers",
  },
] as const;

export type ReikiMenuCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  priceCad: number;
};

export function isReikiNavItem(item: { label: string; href: string }) {
  const label = item.label.trim().toUpperCase();
  const href = item.href.trim().toLowerCase();
  return label === "REIKI" || href === "/reiki" || href.startsWith("/reiki#");
}
