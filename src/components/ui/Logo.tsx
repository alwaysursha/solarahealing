import Image from "next/image";
import { site } from "@/lib/site";

export const LOGO_SRC = "/brand/Soulara-logo-transparent.png";
export const LOGO_WIDTH = 972;
export const LOGO_HEIGHT = 312;

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Logo({ variant = "light", className = "" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <a
      href="/"
      className={`inline-flex shrink-0 items-center overflow-visible transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src={LOGO_SRC}
        alt={`${site.name} — Heal, Align, Awaken`}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
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
