/**
 * Capture course slides for PDF export.
 * Prefer modern-screenshot — html2canvas crashes on modern CSS `color(...)`.
 */
export async function captureElementToCanvas(element: HTMLElement) {
  await inlineImagesForCapture(element);
  await waitForImages(element);

  const width = Math.max(element.offsetWidth, element.scrollWidth, 1920);
  const height = Math.max(element.offsetHeight, element.scrollHeight, 1080);

  try {
    const { domToCanvas } = await import("modern-screenshot");
    return await domToCanvas(element, {
      width,
      height,
      scale: 1.5,
      backgroundColor: "#efe4f6",
      style: {
        width: `${width}px`,
        height: `${height}px`,
        maxHeight: `${height}px`,
        overflow: "hidden",
        transform: "none",
      },
    });
  } catch (primaryError) {
    console.warn("[course-material] modern-screenshot failed, trying html2canvas fallback", primaryError);
    return captureWithHtml2CanvasFallback(element, width, height);
  }
}

async function captureWithHtml2CanvasFallback(
  element: HTMLElement,
  width: number,
  height: number,
) {
  const { default: html2canvas } = await import("html2canvas");

  return html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#efe4f6",
    logging: false,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    foreignObjectRendering: false,
    imageTimeout: 15000,
    onclone: (_doc, cloned) => {
      flattenResolvedStyles(element, cloned);
      cloned.style.width = `${width}px`;
      cloned.style.height = `${height}px`;
      cloned.style.maxHeight = `${height}px`;
      cloned.style.overflow = "hidden";
      cloned.querySelectorAll("img").forEach((img) => {
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
      });
    },
  });
}

export async function saveLandscapePdfFromCanvases(
  canvases: HTMLCanvasElement[],
  filename: string,
) {
  if (canvases.length === 0) {
    throw new Error("No slides to export.");
  }

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (const [index, canvas] of canvases.entries()) {
    if (index > 0) pdf.addPage();

    let imgData: string;
    try {
      imgData = canvas.toDataURL("image/jpeg", 0.92);
    } catch (err) {
      throw new Error(
        `Slide ${index + 1} could not be encoded (likely a blocked image). ${String(err)}`,
      );
    }

    if (!imgData || imgData === "data:,") {
      throw new Error(`Slide ${index + 1} captured as an empty image.`);
    }

    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
  }

  pdf.save(filename);
}

export function coursePdfFilename(deckTitle: string, from: number, to: number) {
  const slug = deckTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (from === to) return `${slug}-slide-${from}.pdf`;
  return `${slug}-slides-${from}-to-${to}.pdf`;
}

/** Copy browser-resolved styles and remove CSS that still contains color(). */
function flattenResolvedStyles(originalRoot: HTMLElement, clonedRoot: HTMLElement) {
  const doc = clonedRoot.ownerDocument;
  doc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => node.remove());

  const originals = [originalRoot, ...Array.from(originalRoot.querySelectorAll<HTMLElement>("*"))];
  const clones = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>("*"))];

  const count = Math.min(originals.length, clones.length);
  for (let i = 0; i < count; i += 1) {
    const src = originals[i]!;
    const dst = clones[i]!;
    const computed = window.getComputedStyle(src);
    let cssText = "";
    for (let j = 0; j < computed.length; j += 1) {
      const prop = computed.item(j);
      if (!prop) continue;
      const value = computed.getPropertyValue(prop);
      if (!value) continue;
      if (/\bcolor\s*\(/i.test(value) || /\bcolor-mix\s*\(/i.test(value)) continue;
      cssText += `${prop}:${value};`;
    }
    dst.style.cssText = cssText;
  }
}

async function inlineImagesForCapture(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(async (img) => {
      const src = img.currentSrc || img.src;
      if (!src || src.startsWith("data:")) return;

      try {
        const response = await fetch(src, {
          mode: "cors",
          credentials: "same-origin",
          cache: "force-cache",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const dataUrl = await blobToDataUrl(blob);
        img.src = dataUrl;
        img.removeAttribute("srcset");
        img.removeAttribute("sizes");
      } catch {
        img.style.visibility = "hidden";
      }
    }),
  );
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.style.visibility === "hidden") {
            resolve();
            return;
          }
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          window.setTimeout(done, 5000);
        }),
    ),
  ).then(() => {
    return new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve());
      });
    });
  });
}
