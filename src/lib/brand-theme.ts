export const BRAND_THEME_PREVIEW_OPTIONS = [1, 7, 8] as const;

export type BrandThemePreviewOption = (typeof BRAND_THEME_PREVIEW_OPTIONS)[number];

export const BRAND_THEME_PREVIEW_META: Record<
  BrandThemePreviewOption,
  { slug: string; title: string; summary: string }
> = {
  1: {
    slug: "option-1",
    title: "Option 1 — Jewel lift",
    summary: "Brighter amethyst purple, same textures and chakras as the live site.",
  },
  7: {
    slug: "option-7",
    title: "Option 7 — Midnight orchid",
    summary: "Darker orchid palette with mesh, shimmer, mandala, and floating chakras.",
  },
  8: {
    slug: "option-8",
    title: "Option 8 — Midnight orchid (clean)",
    summary: "Same colors as Option 7, with a clean gradient only (no textures or chakras).",
  },
};

export function isBrandThemePreviewOption(value: string): value is `${BrandThemePreviewOption}` {
  return value === "1" || value === "7" || value === "8";
}

export function brandThemeFromSlug(slug: string): BrandThemePreviewOption | null {
  const entry = Object.entries(BRAND_THEME_PREVIEW_META).find(([, meta]) => meta.slug === slug);
  return entry ? (Number(entry[0]) as BrandThemePreviewOption) : null;
}
