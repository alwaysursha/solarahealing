export const ARTICLE_CATEGORIES = [
  "Insights",
  "Healing",
  "Wellness",
  "Reiki",
  "Practice",
  "Nutrition",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

/** Convert legacy plain-text bodies into TipTap-friendly HTML. */
export function articleBodyToEditorHtml(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return "";
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return body;
  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function articleBodyLooksLikeHtml(body: string): boolean {
  return /<[a-z][\s\S]*>/i.test(body.trim());
}
