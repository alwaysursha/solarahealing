import { aboutContent, heroSlides, site } from "@/lib/site";

export type NavIconId = "reiki" | "healing" | "nutrition" | "transformation";

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
  { value: "healing", label: "Healing" },
  { value: "nutrition", label: "Nutrition" },
  { value: "transformation", label: "Transformation" },
];

export const DEFAULT_QUOTE_LABEL = "The heart of our practice";

export function defaultHeroButtons(ctaLabel: string = site.cta): HeroSlideButton[] {
  return [
    { id: "primary", label: ctaLabel, href: "#contact", style: "primary" },
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

  return raw
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const icon = row.icon;
      const validIcon =
        icon === "reiki" || icon === "healing" || icon === "nutrition" || icon === "transformation"
          ? icon
          : "reiki";
      const label = typeof row.label === "string" ? row.label.trim() : "";
      const href = typeof row.href === "string" ? row.href.trim() : "";
      if (!label || !href) return null;
      return {
        id: typeof row.id === "string" && row.id ? row.id : `nav-${index + 1}`,
        label,
        href,
        icon: validIcon,
      } satisfies SiteNavItem;
    })
    .filter((item): item is SiteNavItem => Boolean(item));
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
            const href = typeof b.href === "string" ? b.href.trim() : "";
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
    image: typeof row.image === "string" && row.image.trim() ? row.image : undefined,
    imageAlt: typeof row.imageAlt === "string" ? row.imageAlt : undefined,
    paragraphs,
  };
}
