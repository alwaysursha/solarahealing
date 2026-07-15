import { getCloudflareContext } from "@opennextjs/cloudflare";
import { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES } from "@/lib/media-limits";

export { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES };

type R2BucketLike = {
  put: (
    key: string,
    value: ArrayBuffer | ArrayBufferView | string | Blob | null,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>;
};

function extensionForType(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
    default:
      return "jpg";
  }
}

function publicBaseUrl() {
  return (
    process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    ""
  );
}

async function getMediaBucket(): Promise<R2BucketLike | null> {
  try {
    const { env } = getCloudflareContext();
    const media = (env as { MEDIA?: R2BucketLike }).MEDIA;
    return media ?? null;
  } catch {
    return null;
  }
}

export async function storeMediaObject(file: File, folder: "hero" | "about" | "general") {
  if (!MEDIA_ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }
  if (file.size > MEDIA_MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller to stay on Cloudflare free tier.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extensionForType(file.type)}`;
  const bucket = await getMediaBucket();

  if (bucket) {
    await bucket.put(key, bytes, {
      httpMetadata: { contentType: file.type },
    });
    const base = publicBaseUrl();
    if (!base) {
      throw new Error("Set R2_PUBLIC_BASE_URL to your public R2 URL (e.g. https://pub-xxxx.r2.dev).");
    }
    return `${base}/${key}`;
  }

  // Local Next.js dev only — not used on Cloudflare Workers
  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const publicDir = path.join(process.cwd(), "public", "media", folder);
  await mkdir(publicDir, { recursive: true });
  const filename = path.basename(key);
  await writeFile(path.join(publicDir, filename), bytes);
  return `/media/${folder}/${filename}`;
}
