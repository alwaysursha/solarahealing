import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import { normalizeSlug } from "../src/lib/slug";

config();
config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DIRECT_URL or DATABASE_URL in .env.local before backfilling.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function uniqueAmong(used: Set<string>, base: string): Promise<string> {
  const root = normalizeSlug(base) || "item";
  let candidate = root;
  let n = 2;
  while (used.has(candidate)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  used.add(candidate);
  return candidate;
}

async function backfill() {
  const usedCourse = new Set<string>();
  for (const course of await prisma.onlineCourse.findMany({ orderBy: { sortOrder: "asc" } })) {
    const slug = await uniqueAmong(usedCourse, course.id || course.title);
    if (slug !== course.slug) {
      await prisma.onlineCourse.update({ where: { id: course.id }, data: { slug } });
      console.log(`  ~ course ${course.id} → ${slug}`);
    } else {
      console.log(`  = course ${course.id}`);
    }
  }

  const usedWorkshop = new Set<string>();
  for (const workshop of await prisma.workshop.findMany({ orderBy: { sortOrder: "asc" } })) {
    const slug = await uniqueAmong(usedWorkshop, workshop.id || workshop.title);
    if (slug !== workshop.slug) {
      await prisma.workshop.update({ where: { id: workshop.id }, data: { slug } });
      console.log(`  ~ workshop ${workshop.id} → ${slug}`);
    } else {
      console.log(`  = workshop ${workshop.id}`);
    }
  }

  const usedSession = new Set<string>();
  for (const session of await prisma.privateSession.findMany({ orderBy: { sortOrder: "asc" } })) {
    const slug = await uniqueAmong(usedSession, session.id || session.title);
    if (slug !== session.slug) {
      await prisma.privateSession.update({ where: { id: session.id }, data: { slug } });
      console.log(`  ~ session ${session.id} → ${slug}`);
    } else {
      console.log(`  = session ${session.id}`);
    }
  }
}

backfill()
  .then(async () => {
    console.log("Catalog slug backfill complete.");
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
