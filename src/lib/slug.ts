/** Normalize a public URL slug from free text. */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Build a slug from an explicit value, falling back to title then id. */
export function resolveSlugInput(options: {
  slug?: string | null;
  title?: string | null;
  fallback: string;
}): string {
  const fromSlug = normalizeSlug(options.slug ?? "");
  if (fromSlug) return fromSlug;

  const fromTitle = normalizeSlug(options.title ?? "");
  if (fromTitle) return fromTitle;

  const fromFallback = normalizeSlug(options.fallback);
  return fromFallback || options.fallback;
}

export async function ensureUniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const root = normalizeSlug(base) || "item";
  let candidate = root;
  let n = 2;

  while (await isTaken(candidate)) {
    candidate = `${root}-${n}`;
    n += 1;
  }

  return candidate;
}
