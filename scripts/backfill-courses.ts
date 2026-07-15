import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import { onlineCourses } from "../src/lib/site";

config();
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local before backfilling.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  let created = 0;
  let updated = 0;

  for (const [index, course] of onlineCourses.entries()) {
    const existing = await prisma.onlineCourse.findUnique({ where: { id: course.id } });

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

    if (existing) {
      updated += 1;
      console.log(`  ~ ${course.title}`);
    } else {
      created += 1;
      console.log(`  + ${course.title}`);
    }
  }

  console.log(`\n✅ Courses sync complete — ${created} created, ${updated} updated.`);
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
