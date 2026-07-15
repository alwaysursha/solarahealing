"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeAboutContent,
  normalizeHeroSlides,
  normalizeNavItems,
  htmlToParagraphs,
  paragraphsToHtml,
  type AboutContent,
  type HeroSlide,
  type SiteNavItem,
} from "@/lib/frontpage-content";
import { site } from "@/lib/site";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

function revalidateFrontpage() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/web");
  revalidatePath("/admin/web/frontpage");
}

async function ensureSiteSettingsRow() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (existing) return;

  await prisma.siteSettings.create({
    data: {
      id: 1,
      name: SITE_NAME,
      tagline: site.tagline,
      sanskrit: site.sanskrit,
      sanskritMeaning: site.sanskritMeaning,
      description: SITE_DESCRIPTION,
      seoTitle: SITE_NAME,
      metaDescription: SITE_DESCRIPTION,
      phone: site.contact.phone,
      email: site.contact.email,
      whatsapp: site.contact.whatsapp,
      address: site.contact.location,
      cta: site.cta,
      navJson: JSON.stringify(normalizeNavItems(null)),
      showCoursesSection: true,
      showWorkshopsSection: false,
      showPrivateSessionsSection: true,
    },
  });
}

async function upsertHomeSection(sectionKey: string, label: string, content: unknown) {
  const id = `home-${sectionKey}`;
  await prisma.pageSection.upsert({
    where: {
      pageKey_sectionKey: { pageKey: "home", sectionKey },
    },
    create: {
      id,
      pageKey: "home",
      sectionKey,
      label,
      content: JSON.stringify(content),
    },
    update: {
      label,
      content: JSON.stringify(content),
    },
  });
}

export async function saveSiteMenuAction(items: SiteNavItem[]) {
  await requireAdmin();
  const nav = normalizeNavItems(items);
  await ensureSiteSettingsRow();
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: { navJson: JSON.stringify(nav) },
  });
  revalidateFrontpage();
  return { ok: true as const };
}

export async function saveHeroSlidesAction(slides: HeroSlide[]) {
  await requireAdmin();
  const normalized = normalizeHeroSlides(slides);
  await upsertHomeSection("hero", "Hero carousel", normalized);
  revalidateFrontpage();
  return { ok: true as const };
}

export async function saveAboutQuoteAction(input: { quote: string; quoteLabel: string }) {
  await requireAdmin();
  const existing = await prisma.pageSection.findUnique({
    where: { pageKey_sectionKey: { pageKey: "home", sectionKey: "about" } },
  });
  const current = normalizeAboutContent(existing ? JSON.parse(existing.content) : undefined);
  const next: AboutContent = {
    ...current,
    quote: input.quote.trim() || current.quote,
    quoteLabel: input.quoteLabel.trim() || current.quoteLabel,
  };
  await upsertHomeSection("about", "About section", next);
  revalidateFrontpage();
  return { ok: true as const };
}

export async function saveAboutContentAction(input: {
  bodyHtml: string;
  image?: string;
  imageAlt?: string;
}) {
  await requireAdmin();
  const existing = await prisma.pageSection.findUnique({
    where: { pageKey_sectionKey: { pageKey: "home", sectionKey: "about" } },
  });
  const current = normalizeAboutContent(existing ? JSON.parse(existing.content) : undefined);
  const bodyHtml = input.bodyHtml.trim() || current.bodyHtml;
  const paragraphs = htmlToParagraphs(bodyHtml);
  const next: AboutContent = {
    ...current,
    bodyHtml: bodyHtml || paragraphsToHtml(paragraphs.length ? paragraphs : current.paragraphs ?? []),
    paragraphs: paragraphs.length > 0 ? paragraphs : current.paragraphs,
    image: input.image?.trim() || undefined,
    imageAlt: input.imageAlt?.trim() || undefined,
  };
  await upsertHomeSection("about", "About section", next);
  revalidateFrontpage();
  return { ok: true as const };
}
