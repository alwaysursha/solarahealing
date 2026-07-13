"use client";

import { useEffect } from "react";
import type { BrandThemePreviewOption } from "@/lib/brand-theme";
import { BRAND_THEME_PREVIEW_META } from "@/lib/brand-theme";

type BrandThemePreviewGateProps = {
  option: BrandThemePreviewOption;
};

/**
 * Applies a temporary brand palette on <html> for feedback preview pages.
 * Clears on leave so the real homepage stays on the original theme.
 */
export function BrandThemePreviewGate({ option }: BrandThemePreviewGateProps) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-brand-theme");
    root.setAttribute("data-brand-theme", String(option));
    root.setAttribute("data-brand-theme-label", BRAND_THEME_PREVIEW_META[option].title);

    return () => {
      if (previous) {
        root.setAttribute("data-brand-theme", previous);
      } else {
        root.removeAttribute("data-brand-theme");
      }
      root.removeAttribute("data-brand-theme-label");
    };
  }, [option]);

  return (
    <div className="brand-theme-preview-banner pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-3">
      <p className="rounded-full bg-black/55 px-4 py-1.5 text-center text-[11px] font-medium tracking-[0.14em] text-white uppercase backdrop-blur-sm">
        Preview · {BRAND_THEME_PREVIEW_META[option].title}
      </p>
    </div>
  );
}
