export type CropAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageAdjustments = {
  brightness: number;
  contrast: number;
  saturate: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Could not load image for editing.")));
    // Blob/data URLs are same-origin; skip CORS mode for those.
    if (!src.startsWith("blob:") && !src.startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.src = src;
  });
}

function createRotatedCanvas(image: HTMLImageElement, rotation: number) {
  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * cos + height * sin);
  canvas.height = Math.round(width * sin + height * cos);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image canvas.");
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -width / 2, -height / 2);
  return canvas;
}

export async function getEditedImageBlob({
  imageSrc,
  pixelCrop,
  rotation = 0,
  adjustments,
  mimeType = "image/jpeg",
  quality = 0.9,
}: {
  imageSrc: string;
  pixelCrop: CropAreaPixels;
  rotation?: number;
  adjustments: ImageAdjustments;
  mimeType?: string;
  quality?: number;
}): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const rotated = createRotatedCanvas(image, rotation);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not export edited image.");

  ctx.filter = [
    `brightness(${adjustments.brightness}%)`,
    `contrast(${adjustments.contrast}%)`,
    `saturate(${adjustments.saturate}%)`,
  ].join(" ");

  ctx.drawImage(
    rotated,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, quality),
  );
  if (!blob) throw new Error("Could not encode edited image.");
  return blob;
}
