import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_THEME_PREVIEW_META, BRAND_THEME_PREVIEW_OPTIONS } from "@/lib/brand-theme";

export const metadata: Metadata = {
  title: "Brand theme previews",
  robots: { index: false, follow: false },
};

export default function BrandThemePreviewIndexPage() {
  return (
    <main className="site-scroll-main bg-canvas px-6 py-16 text-foreground md:px-10 lg:px-14">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-purple-mid uppercase">
            Internal preview
          </p>
          <h1 className="font-serif text-4xl text-purple-deep">Brand theme options</h1>
          <p className="text-sm leading-relaxed text-foreground/70">
            The live homepage stays on the original palette. Use these links to compare Option 1,
            Option 7, and Option 8 with reviewers.
          </p>
        </div>

        <ul className="space-y-4">
          {BRAND_THEME_PREVIEW_OPTIONS.map((option) => {
            const meta = BRAND_THEME_PREVIEW_META[option];
            return (
              <li key={option}>
                <Link
                  href={`/preview/${meta.slug}`}
                  className="block rounded-2xl border border-purple-deep/10 bg-white/70 px-5 py-4 transition hover:border-purple-mid/30 hover:bg-white"
                >
                  <p className="font-medium text-purple-deep">{meta.title}</p>
                  <p className="mt-1 text-sm text-foreground/65">{meta.summary}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/" className="inline-block text-sm text-purple-mid underline-offset-4 hover:underline">
          Back to original homepage
        </Link>
      </div>
    </main>
  );
}
