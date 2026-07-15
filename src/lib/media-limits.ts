/** Shared client/server media limits (no Node/Cloudflare imports). */
export const MEDIA_MAX_BYTES = 2 * 1024 * 1024;
export const MEDIA_ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
