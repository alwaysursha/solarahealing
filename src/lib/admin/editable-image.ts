/**
 * Resolve an image URL into a same-origin blob URL so canvas export
 * is never blocked by CDN/R2 CORS.
 */
export async function resolveEditableImageSrc(src: string): Promise<string> {
  const trimmed = src.trim();
  if (!trimmed) {
    throw new Error("No image to edit.");
  }
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  const proxyUrl = `/api/admin/image-proxy?url=${encodeURIComponent(trimmed)}`;
  const response = await fetch(proxyUrl, { cache: "no-store" });
  if (!response.ok) {
    let detail = "Could not load image for editing.";
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) detail = payload.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(detail);
  }

  const blob = await response.blob();
  if (!blob.type.startsWith("image/") && blob.size === 0) {
    throw new Error("Could not load image for editing.");
  }
  return URL.createObjectURL(blob);
}
