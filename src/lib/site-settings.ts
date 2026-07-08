import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { site } from "@/lib/site";

export type SiteSettings = {
  name: string;
  tagline: string;
  sanskrit: string;
  sanskritMeaning: string;
  description: string;
  nav: typeof site.nav;
  cta: string;
  contact: typeof site.contact;
  fetchedAt: string;
};

/** Server-only site content — replace with DB/CMS reads as features grow */
export async function getSiteSettings(): Promise<SiteSettings> {
  return {
    name: SITE_NAME,
    tagline: site.tagline,
    sanskrit: site.sanskrit,
    sanskritMeaning: site.sanskritMeaning,
    description: SITE_DESCRIPTION,
    nav: site.nav,
    cta: site.cta,
    contact: site.contact,
    fetchedAt: new Date().toISOString(),
  };
}
