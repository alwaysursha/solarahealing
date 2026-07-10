import { getSiteSettingsFromDb } from "@/lib/content";
import { site } from "@/lib/site";

export type SiteSettings = {
  name: string;
  tagline: string;
  sanskrit: string;
  sanskritMeaning: string;
  description: string;
  nav: typeof site.nav;
  cta: string;
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
  };
  seoTitle: string;
  metaDescription: string;
  fetchedAt: string;
};

/** Server-only site content from database with static fallback */
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await getSiteSettingsFromDb();
  return {
    name: settings.name,
    tagline: settings.tagline,
    sanskrit: settings.sanskrit,
    sanskritMeaning: settings.sanskritMeaning,
    description: settings.description,
    nav: settings.nav,
    cta: settings.cta,
    contact: {
      email: settings.email,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      location: settings.address,
    },
    seoTitle: settings.seoTitle,
    metaDescription: settings.metaDescription,
    fetchedAt: settings.fetchedAt,
  };
}
