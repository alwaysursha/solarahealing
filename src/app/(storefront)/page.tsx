import type { Metadata } from "next";
import { HomePageView } from "@/components/storefront/HomePageView";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle || settings.name,
    description: settings.metaDescription || settings.description,
  };
}

export default async function HomePage() {
  return <HomePageView />;
}
