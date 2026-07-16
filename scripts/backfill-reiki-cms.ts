import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import {
  REIKI_SECTION_META,
  normalizeReikiBenefits,
  normalizeReikiChakras,
  normalizeReikiClose,
  normalizeReikiFaq,
  normalizeReikiHero,
  normalizeReikiIntro,
  normalizeReikiPathways,
  reikiPageDefaults,
  type ReikiSectionKey,
} from "../src/lib/reiki-page";

import { onlineCourses } from "../src/lib/site";
import { REIKI_INTRO_COURSE_ID } from "../src/lib/reiki-nav";

config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL missing");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const normalizers: Record<ReikiSectionKey, (value: unknown) => unknown> = {
  hero: normalizeReikiHero,
  intro: normalizeReikiIntro,
  benefits: normalizeReikiBenefits,
  chakras: normalizeReikiChakras,
  pathways: normalizeReikiPathways,
  faq: normalizeReikiFaq,
  close: normalizeReikiClose,
};

async function upsertIntroCourse() {
  const course = onlineCourses.find((item) => item.id === REIKI_INTRO_COURSE_ID);
  if (!course) {
    console.log("introduction-to-reiki: missing from static courses");
    return;
  }

  await prisma.onlineCourse.upsert({
    where: { id: course.id },
    create: {
      id: course.id,
      slug: course.id,
      title: course.title,
      description: course.description,
      dateLabel: course.date,
      duration: course.duration,
      badge: course.badge || "Free",
      category: course.category,
      priceCad: course.priceCad,
      image: course.image,
      imageAlt: course.imageAlt,
      level: course.level,
      published: true,
      sortOrder: 0,
    },
    update: {
      slug: course.id,
      title: course.title,
      description: course.description,
      dateLabel: course.date,
      duration: course.duration,
      badge: course.badge || "Free",
      category: course.category,
      priceCad: course.priceCad,
      image: course.image,
      imageAlt: course.imageAlt,
      level: course.level,
      published: true,
    },
  });
  console.log("introduction-to-reiki: upserted ($0)");
}

async function main() {
  for (const section of REIKI_SECTION_META) {
    const existing = await prisma.pageSection.findUnique({
      where: {
        pageKey_sectionKey: { pageKey: "reiki", sectionKey: section.sectionKey },
      },
    });

    const raw = existing
      ? (() => {
          try {
            return JSON.parse(existing.content);
          } catch {
            return reikiPageDefaults[section.sectionKey];
          }
        })()
      : reikiPageDefaults[section.sectionKey];

    const content = normalizers[section.sectionKey](raw);

    await prisma.pageSection.upsert({
      where: {
        pageKey_sectionKey: { pageKey: "reiki", sectionKey: section.sectionKey },
      },
      create: {
        id: `reiki-${section.sectionKey}`,
        pageKey: "reiki",
        sectionKey: section.sectionKey,
        label: section.label,
        content: JSON.stringify(content),
      },
      update: {
        label: section.label,
        content: JSON.stringify(content),
      },
    });

    console.log(`${section.sectionKey}: ${existing ? "updated" : "created"}`);
  }

  await upsertIntroCourse();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
