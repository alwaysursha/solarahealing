import { aboutContent, heroSlides, site } from "@/lib/site";
import type { NavIconId } from "@/components/sections/nav/NavIcon";

export type { NavIconId };

export type SiteNavItem = {
  id: string;
  label: string;
  href: string;
  icon: NavIconId;
};

export type HeroButtonStyle = "primary" | "secondary";

export type HeroSlideButton = {
  id: string;
  label: string;
  href: string;
  style: HeroButtonStyle;
};

export type HeroSlide = {
  id: string;
  variant: "illustrated" | "photo";
  image: string;
  imageAlt: string;
  imagePosition?: string;
  eyebrow: string;
  eyebrowSub: string;
  title: string;
  titleAccent: string;
  description: string;
  caption?: string;
  captionSub?: string;
  buttons: HeroSlideButton[];
};

export type AboutContent = {
  opener?: string;
  quote: string;
  quoteLabel: string;
  bodyHtml: string;
  image?: string;
  imageAlt?: string;
  paragraphs?: string[];
};

export const NAV_ICON_OPTIONS: { value: NavIconId; label: string }[] = [
  { value: "reiki", label: "Reiki" },
  { value: "courses", label: "Courses" },
  { value: "sessions", label: "Book a Session" },
  { value: "blog", label: "Articles" },
  { value: "contact", label: "Contact Us" },
];

const NAV_ICON_IDS: NavIconId[] = ["reiki", "courses", "sessions", "blog", "contact"];

const LEGACY_NAV_BY_LABEL: Record<
  string,
  { label: string; href: string; icon: NavIconId }
> = {
  HEALING: { label: "COURSES", href: "/courses", icon: "courses" },
  NUTRITION: { label: "BOOK A SESSION", href: "/sessions", icon: "sessions" },
  TRANSFORM: { label: "ARTICLES", href: "/articles", icon: "blog" },
  TRANSFORMATIONATION: { label: "ARTICLES", href: "/articles", icon: "blog" },
  BLOG: { label: "ARTICLES", href: "/articles", icon: "blog" },
};

const LEGACY_ICON_MAP: Record<string, NavIconId> = {
  healing: "courses",
  nutrition: "sessions",
  transformation: "blog",
};

function isNavIconId(value: unknown): value is NavIconId {
  return typeof value === "string" && NAV_ICON_IDS.includes(value as NavIconId);
}

function resolveNavIcon(value: unknown): NavIconId {
  if (isNavIconId(value)) return value;
  if (typeof value === "string" && value in LEGACY_ICON_MAP) {
    return LEGACY_ICON_MAP[value];
  }
  return "reiki";
}

function resolveLegacyNav(labelRaw: string, hrefRaw: string, iconRaw: unknown) {
  const byLabel = LEGACY_NAV_BY_LABEL[labelRaw.toUpperCase()];
  if (byLabel) return byLabel;

  // Catch leftover admin edits that changed casing/wording but kept old destinations.
  if (hrefRaw === "#testimonials" || hrefRaw === "/#testimonials" || iconRaw === "transformation") {
    return LEGACY_NAV_BY_LABEL.TRANSFORM;
  }
  if (hrefRaw === "#insights" || hrefRaw === "/#insights" || iconRaw === "nutrition") {
    return LEGACY_NAV_BY_LABEL.NUTRITION;
  }
  if (hrefRaw === "#schedule" || hrefRaw === "/#schedule" || iconRaw === "healing") {
    return LEGACY_NAV_BY_LABEL.HEALING;
  }

  return null;
}

export const DEFAULT_QUOTE_LABEL = "The heart of our practice";

export function defaultHeroButtons(ctaLabel: string = site.cta): HeroSlideButton[] {
  return [
    { id: "primary", label: ctaLabel, href: "#sessions", style: "primary" },
    { id: "secondary", label: "Explore Sessions", href: "#sessions", style: "secondary" },
  ];
}

export function htmlToParagraphs(html: string): string[] {
  const matches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  const fromTags = matches
    .map((match) =>
      match[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);

  if (fromTags.length > 0) return fromTags;

  const stripped = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h\d|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+\n/g, "\n")
    .trim();

  return stripped
    .split(/\n+/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function normalizeNavItems(raw: unknown): SiteNavItem[] {
  if (!Array.isArray(raw)) {
    return site.nav.map((item, index) => ({
      id: `nav-${index + 1}`,
      label: item.label,
      href: item.href,
      icon: item.icon,
    }));
  }

  const items = raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const labelRaw = typeof row.label === "string" ? row.label.trim() : "";
      const hrefRaw = typeof row.href === "string" ? row.href.trim() : "";
      if (!labelRaw || !hrefRaw) return null;

      const legacy = resolveLegacyNav(labelRaw, hrefRaw, row.icon);
      const label = legacy?.label ?? labelRaw;
      let href = legacy?.href ?? hrefRaw;
      const icon = legacy?.icon ?? resolveNavIcon(row.icon);

      if (label.toUpperCase() === "REIKI" && (href === "#courses" || href === "/#courses")) {
        href = "/reiki";
      }

      if (href === "/blog" || href.startsWith("/blog/") || href.startsWith("/blog#")) {
        href = href.replace(/^\/blog/, "/articles");
      }

      return {
        id: typeof row.id === "string" && row.id ? row.id : `nav-${index + 1}`,
        label,
        href,
        icon,
      } satisfies SiteNavItem;
    })
    .filter((item): item is SiteNavItem => Boolean(item));

  const hasContact = items.some((item) => {
    const label = item.label.toUpperCase();
    return label.includes("CONTACT") || item.href.includes("contact");
  });

  if (!hasContact) {
    items.push({
      id: `nav-${items.length + 1}`,
      label: "CONTACT US",
      href: "/#contact",
      icon: "contact",
    });
  }

  return items.length > 0
    ? items
    : site.nav.map((item, index) => ({
        id: `nav-${index + 1}`,
        label: item.label,
        href: item.href,
        icon: item.icon,
      }));
}

export function parseNavJson(navJson: string | null | undefined): SiteNavItem[] {
  if (!navJson?.trim()) {
    return normalizeNavItems(null);
  }
  try {
    return normalizeNavItems(JSON.parse(navJson));
  } catch {
    return normalizeNavItems(null);
  }
}

export function normalizeHeroSlides(raw: unknown, ctaLabel: string = site.cta): HeroSlide[] {
  const source = Array.isArray(raw) ? raw : heroSlides;
  return source.map((item, index) => {
    const row = item as Record<string, unknown>;
    const buttonsRaw = row.buttons;
    const buttons = Array.isArray(buttonsRaw)
      ? buttonsRaw
          .map((button, buttonIndex) => {
            if (!button || typeof button !== "object") return null;
            const b = button as Record<string, unknown>;
            const style = b.style === "secondary" ? "secondary" : "primary";
            const label = typeof b.label === "string" ? b.label.trim() : "";
            let href = typeof b.href === "string" ? b.href.trim() : "";
            // Keep the primary "Book a Session" CTA pointed at private sessions.
            if (style === "primary" && /session/i.test(label || ctaLabel)) {
              href = "#sessions";
            }
            if (!label || !href) return null;
            return {
              id: typeof b.id === "string" && b.id ? b.id : `btn-${buttonIndex + 1}`,
              label,
              href,
              style,
            } satisfies HeroSlideButton;
          })
          .filter((button): button is HeroSlideButton => Boolean(button))
      : defaultHeroButtons(ctaLabel);

    return {
      id: typeof row.id === "string" && row.id ? row.id : `slide-${index + 1}`,
      variant: row.variant === "photo" ? "photo" : "illustrated",
      image: typeof row.image === "string" ? row.image : "",
      imageAlt: typeof row.imageAlt === "string" ? row.imageAlt : "",
      imagePosition: typeof row.imagePosition === "string" ? row.imagePosition : undefined,
      eyebrow: typeof row.eyebrow === "string" ? row.eyebrow : "",
      eyebrowSub: typeof row.eyebrowSub === "string" ? row.eyebrowSub : "",
      title: typeof row.title === "string" ? row.title : "",
      titleAccent: typeof row.titleAccent === "string" ? row.titleAccent : "",
      description: typeof row.description === "string" ? row.description : "",
      caption: typeof row.caption === "string" ? row.caption : undefined,
      captionSub: typeof row.captionSub === "string" ? row.captionSub : undefined,
      buttons: buttons.length > 0 ? buttons : defaultHeroButtons(ctaLabel),
    };
  });
}

export function normalizeAboutContent(raw: unknown): AboutContent {
  const row =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : (aboutContent as unknown as Record<string, unknown>);

  const paragraphs = Array.isArray(row.paragraphs)
    ? row.paragraphs.filter((p): p is string => typeof p === "string")
    : [...aboutContent.paragraphs];

  const bodyHtml =
    typeof row.bodyHtml === "string" && row.bodyHtml.trim()
      ? row.bodyHtml
      : paragraphsToHtml(paragraphs);

  return {
    opener: typeof row.opener === "string" ? row.opener : aboutContent.opener,
    quote: typeof row.quote === "string" && row.quote.trim() ? row.quote : aboutContent.quote,
    quoteLabel:
      typeof row.quoteLabel === "string" && row.quoteLabel.trim()
        ? row.quoteLabel
        : DEFAULT_QUOTE_LABEL,
    bodyHtml,
    image:
      typeof row.image === "string" && row.image.trim()
        ? row.image
        : "image" in aboutContent && typeof aboutContent.image === "string"
          ? aboutContent.image
          : undefined,
    imageAlt:
      typeof row.imageAlt === "string" && row.imageAlt.trim()
        ? row.imageAlt
        : "imageAlt" in aboutContent && typeof aboutContent.imageAlt === "string"
          ? aboutContent.imageAlt
          : undefined,
    paragraphs,
  };
}
