import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import {
  inferCourseCategory,
} from "../src/lib/course-taxonomy";
import { onlineCourses, privateSessions } from "../src/lib/site";

config();
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local before backfilling.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function backfillCourses() {
  let created = 0;
  let updated = 0;

  for (const [index, course] of onlineCourses.entries()) {
    const existing = await prisma.onlineCourse.findUnique({ where: { id: course.id } });
    const category = course.category;
    const level = course.level;

    await prisma.onlineCourse.upsert({
      where: { id: course.id },
      create: {
        id: course.id,
        slug: course.id,
        title: course.title,
        description: course.description,
        dateLabel: course.date,
        duration: course.duration,
        badge: "",
        category,
        priceCad: course.priceCad,
        image: course.image,
        imageAlt: course.imageAlt,
        level,
        published: true,
        sortOrder: index,
      },
      update: {
        title: course.title,
        description: course.description,
        dateLabel: course.date,
        duration: course.duration,
        badge: "",
        category,
        priceCad: course.priceCad,
        image: course.image,
        imageAlt: course.imageAlt,
        level,
        published: true,
        sortOrder: index,
      },
    });

    if (existing) {
      updated += 1;
      console.log(`  ~ course ${course.title} → ${category} / ${level}`);
    } else {
      created += 1;
      console.log(`  + course ${course.title} → ${category} / ${level}`);
    }
  }

  // Heal any courses not in the static seed list.
  const all = await prisma.onlineCourse.findMany();
  for (const row of all) {
    if (onlineCourses.some((course) => course.id === row.id)) continue;
    const category = inferCourseCategory(row.title);
    await prisma.onlineCourse.update({
      where: { id: row.id },
      data: { category, badge: "" },
    });
    console.log(`  ~ orphan course ${row.title} → ${category} / ${row.level}`);
  }

  return { created, updated };
}

async function backfillPrivateSessions() {
  let created = 0;
  let updated = 0;

  for (const [index, session] of privateSessions.entries()) {
    const existing = await prisma.privateSession.findUnique({ where: { id: session.id } });

    await prisma.privateSession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        slug: session.id,
        title: session.title,
        description: session.description,
        duration: session.duration,
        priceCad: session.priceCad,
        image: session.image,
        imageAlt: session.imageAlt,
        published: true,
        sortOrder: index,
      },
      update: {
        title: session.title,
        description: session.description,
        duration: session.duration,
        priceCad: session.priceCad,
        image: session.image,
        imageAlt: session.imageAlt,
        published: true,
        sortOrder: index,
      },
    });

    if (existing) {
      updated += 1;
      console.log(`  ~ session ${session.title}`);
    } else {
      created += 1;
      console.log(`  + session ${session.title}`);
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: "Soulara Healing Academy",
      tagline: "",
      sanskrit: "",
      sanskritMeaning: "",
      description: "",
      seoTitle: "Soulara Healing Academy",
      metaDescription: "",
      phone: "",
      email: "",
      whatsapp: "",
      address: "",
      cta: "",
      navJson: "[]",
      showCoursesSection: true,
      showWorkshopsSection: false,
      showPrivateSessionsSection: true,
    },
    update: {
      showPrivateSessionsSection: true,
    },
  });

  return { created, updated };
}

async function main() {
  console.log("Backfilling course taxonomy…");
  const courses = await backfillCourses();
  console.log(`Courses: ${courses.created} created, ${courses.updated} updated.`);

  console.log("\nBackfilling private sessions…");
  const sessions = await backfillPrivateSessions();
  console.log(`Sessions: ${sessions.created} created, ${sessions.updated} updated.`);

  console.log("\n✅ Taxonomy + private sessions sync complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
