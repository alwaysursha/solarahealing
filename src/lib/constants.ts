export const SITE_NAME = "Soulara Healing";

export const SITE_DESCRIPTION =
  "Experience transformative Reiki healing rooted in Indian spiritual wisdom. In-person and distance sessions available.";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return "http://127.0.0.1:3000";
}
