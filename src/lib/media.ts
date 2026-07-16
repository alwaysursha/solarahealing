import { AwsClient } from "aws4fetch";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES } from "@/lib/media-limits";

export { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES };

type R2BucketLike = {
  put: (
    key: string,
    value: ArrayBuffer | ArrayBufferView | string | Blob | null,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } },
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
    process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    ""
  );
}

function r2BucketName() {
  return process.env.R2_BUCKET_NAME?.trim() || "soulara-media";
}

function hasR2S3Credentials() {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim(),
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

async function putViaR2S3Api(key: string, bytes: Uint8Array, contentType: string) {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing R2 S3 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY).");
  }

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${r2BucketName()}/${key}`;
  // Node's fetch may use chunked encoding for some body types; R2 requires Content-Length.
  const body = Buffer.from(bytes);
  const response = await client.fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `R2 upload failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }
}

async function putViaLocalDisk(key: string, bytes: Uint8Array, folder: string) {
  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const publicDir = path.join(process.cwd(), "public", "media", folder);
  await mkdir(publicDir, { recursive: true });
  const filename = path.basename(key);
  await writeFile(path.join(publicDir, filename), bytes);
  return `/media/${folder}/${filename}`;
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

  // Prefer S3 API credentials in local Next.js so uploads land in the real public bucket.
  // Workers binding is used when credentials are not set (typical production Worker deploy).
  if (hasR2S3Credentials()) {
    await putViaR2S3Api(key, bytes, file.type);
  } else {
    const bucket = await getMediaBucket();
    if (bucket) {
      await bucket.put(key, bytes, {
        httpMetadata: {
          contentType: file.type,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    } else {
      return putViaLocalDisk(key, bytes, folder);
    }
  }

  const base = publicBaseUrl();
  if (!base) {
    throw new Error(
      "Set R2_PUBLIC_BASE_URL to your public R2 URL (e.g. https://pub-xxxx.r2.dev).",
    );
  }
  return `${base}/${key}`;
}
