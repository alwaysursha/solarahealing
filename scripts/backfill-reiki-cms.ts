import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import {
  REIKI_SECTION_META,
  normalizeReikiBenefits,
  normalizeReikiChakras,
  normalizeReikiClose,
  normalizeReikiHero,
  normalizeReikiIntro,
  normalizeReikiPathways,
  reikiPageDefaults,
  type ReikiSectionKey,
} from "../src/lib/reiki-page";

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
  close: normalizeReikiClose,
};

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
