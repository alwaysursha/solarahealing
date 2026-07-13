import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePageView } from "@/components/storefront/HomePageView";
import {
  brandThemeFromSlug,
  BRAND_THEME_PREVIEW_META,
  BRAND_THEME_PREVIEW_OPTIONS,
} from "@/lib/brand-theme";

export const dynamic = "force-dynamic";

type PreviewPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BRAND_THEME_PREVIEW_OPTIONS.map((option) => ({
    slug: BRAND_THEME_PREVIEW_META[option].slug,
  }));
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const option = brandThemeFromSlug(slug);
  if (!option) {
    return { title: "Theme preview", robots: { index: false, follow: false } };
  }

  return {
    title: `${BRAND_THEME_PREVIEW_META[option].title} · Preview`,
    description: BRAND_THEME_PREVIEW_META[option].summary,
    robots: { index: false, follow: false },
  };
}

export default async function BrandThemePreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  if (!brandThemeFromSlug(slug)) notFound();

  return <HomePageView />;
}
