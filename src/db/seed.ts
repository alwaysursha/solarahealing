import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  articles,
  getDb,
  onlineCourses,
  pageSections,
  siteSettings,
  users,
  workshops,
} from "@/db";
import { createId, nowIso } from "@/lib/id";
import {
  aboutContent,
  articlesFeatured,
  articlesIntro,
  articlesList,
  articlesSecondary,
  coursesIntro,
  heroSlides,
  onlineCourses as staticCourses,
  scheduleBooking,
  site,
  testimonials,
  testimonialsIntro,
  workshops as staticWorkshops,
  workshopsIntro,
} from "@/lib/site";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

async function seedArticlesFromSite() {
  const db = await getDb();
  const blogBodies: Record<string, string> = {
    "sacred-art-of-reiki":
      "Reiki is a gentle yet powerful practice of channeling universal life energy. In this guide, we explore its origins, principles, and how you can begin your own healing journey with intention and grace.",
    "energy-healing-basics":
      "Energy healing restores flow through the body’s natural channels. Learn foundational techniques for sensing, clearing, and balancing your field.",
    "mindful-nutrition":
      "Mindful living aligns daily rituals with healing energy — from conscious eating to morning practices that keep you grounded.",
    transformation:
      "Reiki supports deep personal change by releasing old patterns and creating space for renewal.",
    "test-your-aura":
      "Your aura reflects emotional and spiritual states. This guide helps you sense and interpret your energy field.",
    "chakra-wisdom":
      "An introduction to the seven chakras and practices to bring each center into balance.",
    "distance-healing":
      "Energy transcends space. Learn how remote Reiki sessions deliver profound results.",
    "daily-practice":
      "Simple morning and evening rituals to stay clear, grounded, and aligned.",
    "what-is-reiki":
      "Reiki is a Japanese healing art that channels universal life force energy through the hands of a trained practitioner.",
    "chakra-balancing":
      "Chakra balancing aligns your seven energy centers for greater harmony in body, mind, and spirit.",
  };

  const rows = [
    {
      id: createId(),
      slug: articlesFeatured.slug,
      title: articlesFeatured.title,
      excerpt: articlesFeatured.excerpt,
      body: blogBodies[articlesFeatured.slug] ?? articlesFeatured.excerpt,
      category: articlesFeatured.category,
      image: articlesFeatured.image,
      imageAlt: articlesFeatured.imageAlt,
      featured: true,
      published: true,
      sortOrder: 0,
      updatedAt: nowIso(),
    },
    ...articlesSecondary.map((item, index) => ({
      id: createId(),
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      body: blogBodies[item.slug] ?? item.excerpt,
      category: item.category,
      image: item.image,
      imageAlt: item.imageAlt,
      featured: true,
      published: true,
      sortOrder: index + 1,
      updatedAt: nowIso(),
    })),
    ...articlesList.map((item, index) => ({
      id: createId(),
      slug: item.slug,
      title: item.title,
      excerpt: item.description,
      body: blogBodies[item.slug] ?? item.description,
      category: "Insights",
      image: item.image,
      imageAlt: item.imageAlt,
      featured: false,
      published: true,
      sortOrder: index + 10,
      updatedAt: nowIso(),
    })),
  ];

  for (const row of rows) {
    await db.insert(articles).values(row).onConflictDoNothing();
  }
}

function sectionEntries() {
  const ts = nowIso();
  return [
    {
      id: "home-hero",
      pageKey: "home",
      sectionKey: "hero",
      label: "Hero carousel",
      content: JSON.stringify(heroSlides),
      updatedAt: ts,
    },
    {
      id: "home-about",
      pageKey: "home",
      sectionKey: "about",
      label: "About section",
      content: JSON.stringify(aboutContent),
      updatedAt: ts,
    },
    {
      id: "home-courses-intro",
      pageKey: "home",
      sectionKey: "coursesIntro",
      label: "Courses intro",
      content: JSON.stringify(coursesIntro),
      updatedAt: ts,
    },
    {
      id: "home-articles-intro",
      pageKey: "home",
      sectionKey: "articlesIntro",
      label: "Articles intro",
      content: JSON.stringify(articlesIntro),
      updatedAt: ts,
    },
    {
      id: "home-workshops-intro",
      pageKey: "home",
      sectionKey: "workshopsIntro",
      label: "Workshops intro",
      content: JSON.stringify(workshopsIntro),
      updatedAt: ts,
    },
    {
      id: "home-schedule",
      pageKey: "home",
      sectionKey: "scheduleBooking",
      label: "Schedule booking",
      content: JSON.stringify(scheduleBooking),
      updatedAt: ts,
    },
    {
      id: "home-testimonials-intro",
      pageKey: "home",
      sectionKey: "testimonialsIntro",
      label: "Testimonials intro",
      content: JSON.stringify(testimonialsIntro),
      updatedAt: ts,
    },
    {
      id: "home-testimonials",
      pageKey: "home",
      sectionKey: "testimonials",
      label: "Testimonials",
      content: JSON.stringify(testimonials),
      updatedAt: ts,
    },
  ];
}

export async function seedDatabase() {
  const db = await getDb();
  const ts = nowIso();

  await db
    .insert(siteSettings)
    .values({
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
      updatedAt: ts,
    })
    .onConflictDoNothing();

  for (const [index, course] of staticCourses.entries()) {
    await db
      .insert(onlineCourses)
      .values({
        id: course.id,
        title: course.title,
        description: course.description,
        dateLabel: course.date,
        duration: course.duration,
        badge: course.badge,
        priceCad: course.priceCad,
        image: course.image,
        imageAlt: course.imageAlt,
        level: course.level,
        published: true,
        sortOrder: index,
        updatedAt: ts,
      })
      .onConflictDoNothing();
  }

  for (const [index, workshop] of staticWorkshops.entries()) {
    await db
      .insert(workshops)
      .values({
        id: workshop.id,
        title: workshop.title,
        description: workshop.description,
        dateLabel: workshop.date,
        duration: workshop.duration,
        badge: workshop.badge,
        priceCad: workshop.priceCad,
        seatsTotal: 24,
        seatsBooked: 0,
        image: workshop.image,
        imageAlt: workshop.imageAlt,
        published: true,
        sortOrder: index,
        updatedAt: ts,
      })
      .onConflictDoNothing();
  }

  for (const section of sectionEntries()) {
    await db.insert(pageSections).values(section).onConflictDoNothing();
  }

  await seedArticlesFromSite();

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@solarahealing.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "SolaraAdmin2026!";
  const existing = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      id: createId(),
      email: adminEmail,
      name: "Site Admin",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      createdAt: ts,
      updatedAt: ts,
    });
  }
}
