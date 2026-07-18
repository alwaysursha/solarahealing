import Image from "next/image";
import { site } from "@/lib/site";

export const LOGO_SRC = "/brand/Soulara-logo-transparent.png";
export const HEADER_LOGO_SRC = "/brand/Soulara-logo-header.png";
export const FOOTER_LOGO_SRC = "/brand/Soulara-logo-footer.png";
export const LOGO_WIDTH = 972;
export const LOGO_HEIGHT = 312;
export const FOOTER_LOGO_WIDTH = 958;
export const FOOTER_LOGO_HEIGHT = 312;

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const isLight = variant === "light";
  const src = isLight ? HEADER_LOGO_SRC : FOOTER_LOGO_SRC;
  const width = isLight ? LOGO_WIDTH : FOOTER_LOGO_WIDTH;
  const height = isLight ? LOGO_HEIGHT : FOOTER_LOGO_HEIGHT;

  return (
    <a
      href="/"
      className={`inline-flex shrink-0 items-center overflow-visible transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src={src}
        alt={`${site.name} — Heal, Align, Awaken`}
        width={width}
        height={height}
        priority={isLight}
        className={[
          "w-auto origin-left object-contain object-left",
          isLight
            ? "h-12 scale-[1.15] sm:scale-[1.28] md:scale-[1.55] lg:scale-[1.62] xl:scale-[1.68] opacity-100"
            : "h-14 scale-100 opacity-95 saturate-110 sm:h-16",
        ].join(" ")}
      />
    </a>
  );
}
