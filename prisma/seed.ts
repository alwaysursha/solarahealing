import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { Pool } from "pg";
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
} from "../src/lib/site";
import { WORKSHOP_SCHEDULE_SEEDS } from "../src/lib/admin/workshop-schedule";
import { SITE_DESCRIPTION, SITE_NAME } from "../src/lib/constants";

config();
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local before seeding.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const blogBodies: Record<string, string> = {
  "sacred-art-of-reiki":
    "Reiki is a gentle yet powerful practice of channeling universal life energy. In this guide, we explore its origins, principles, and how you can begin your own healing journey with intention and grace.",
  "energy-healing-basics":
    "Energy healing restores flow through the body's natural channels. Learn foundational techniques for sensing, clearing, and balancing your field.",
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

function sectionEntries() {
  return [
    {
      id: "home-hero",
      pageKey: "home",
      sectionKey: "hero",
      label: "Hero carousel",
      content: JSON.stringify(heroSlides),
    },
    {
      id: "home-about",
      pageKey: "home",
      sectionKey: "about",
      label: "About section",
      content: JSON.stringify(aboutContent),
    },
    {
      id: "home-courses-intro",
      pageKey: "home",
      sectionKey: "coursesIntro",
      label: "Courses intro",
      content: JSON.stringify(coursesIntro),
    },
    {
      id: "home-articles-intro",
      pageKey: "home",
      sectionKey: "articlesIntro",
      label: "Articles intro",
      content: JSON.stringify(articlesIntro),
    },
    {
      id: "home-workshops-intro",
      pageKey: "home",
      sectionKey: "workshopsIntro",
      label: "Workshops intro",
      content: JSON.stringify(workshopsIntro),
    },
    {
      id: "home-schedule",
      pageKey: "home",
      sectionKey: "scheduleBooking",
      label: "Schedule booking",
      content: JSON.stringify(scheduleBooking),
    },
    {
      id: "home-testimonials-intro",
      pageKey: "home",
      sectionKey: "testimonialsIntro",
      label: "Testimonials intro",
      content: JSON.stringify(testimonialsIntro),
    },
    {
      id: "home-testimonials",
      pageKey: "home",
      sectionKey: "testimonials",
      label: "Testimonials",
      content: JSON.stringify(testimonials),
    },
  ];
}

async function seedArticles() {
  const rows = [
    {
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
    },
    ...articlesSecondary.map((item, index) => ({
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
    })),
    ...articlesList.map((item, index) => ({
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
    })),
  ];

  for (const row of rows) {
    await prisma.article.upsert({
      where: { slug: row.slug },
      create: row,
      update: row,
    });
  }
}

async function main() {
  const forceSeed =
    process.argv.includes("--force") || process.env.ALLOW_DB_SEED === "yes";

  const existingCourses = await prisma.onlineCourse.count();
  if (!forceSeed && existingCourses > 0) {
    console.error(
      "Refusing to seed: database already has data.",
      "Use pnpm db:seed -- --force only if you intend to overwrite content.",
    );
    process.exit(1);
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
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
      showCoursesSection: true,
      showWorkshopsSection: false,
    },
    update: {},
  });

  for (const [index, course] of staticCourses.entries()) {
    await prisma.onlineCourse.upsert({
      where: { id: course.id },
      create: {
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
      },
      update: {
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
      },
    });
  }

  for (const [index, workshop] of staticWorkshops.entries()) {
    const scheduledAt = new Date(WORKSHOP_SCHEDULE_SEEDS[workshop.id] ?? Date.now() + index * 86_400_000);

    await prisma.workshop.upsert({
      where: { id: workshop.id },
      create: {
        id: workshop.id,
        title: workshop.title,
        description: workshop.description,
        dateLabel: workshop.date,
        scheduledAt,
        duration: workshop.duration,
        badge: workshop.badge,
        priceCad: workshop.priceCad,
        seatsTotal: 24,
        seatsBooked: 0,
        image: workshop.image,
        imageAlt: workshop.imageAlt,
        published: true,
        sortOrder: index,
      },
      update: {
        title: workshop.title,
        description: workshop.description,
        dateLabel: workshop.date,
        scheduledAt,
        duration: workshop.duration,
        badge: workshop.badge,
        priceCad: workshop.priceCad,
        image: workshop.image,
        imageAlt: workshop.imageAlt,
        published: true,
        sortOrder: index,
      },
    });
  }

  for (const section of sectionEntries()) {
    await prisma.pageSection.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: section.pageKey,
          sectionKey: section.sectionKey,
        },
      },
      create: section,
      update: {
        label: section.label,
        content: section.content,
      },
    });
  }

  await seedArticles();

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@soularahealing.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Soularahealing123!";
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Site Admin",
      password: hashed,
      role: Role.ADMIN,
    },
    update: {
      name: "Site Admin",
      role: Role.ADMIN,
    },
  });

  console.log("\n✅ Seed complete!");
  console.log(`  Admin: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
