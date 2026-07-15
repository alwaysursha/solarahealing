import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import {
  normalizeAboutContent,
  normalizeHeroSlides,
  parseNavJson,
} from "../src/lib/frontpage-content";
import { aboutContent, heroSlides, site } from "../src/lib/site";

config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL missing");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (settings) {
    const nav =
      settings.navJson && settings.navJson !== "[]"
        ? settings.navJson
        : JSON.stringify(parseNavJson(null));
    await prisma.siteSettings.update({ where: { id: 1 }, data: { navJson: nav } });
    console.log("navJson ready");
  }

  const hero = await prisma.pageSection.findUnique({
    where: { pageKey_sectionKey: { pageKey: "home", sectionKey: "hero" } },
  });
  if (hero) {
    const normalized = normalizeHeroSlides(JSON.parse(hero.content), site.cta);
    await prisma.pageSection.update({
      where: { id: hero.id },
      data: { content: JSON.stringify(normalized) },
    });
    console.log("hero normalized");
  } else {
    await prisma.pageSection.create({
      data: {
        id: "home-hero",
        pageKey: "home",
        sectionKey: "hero",
        label: "Hero carousel",
        content: JSON.stringify(normalizeHeroSlides(heroSlides, site.cta)),
      },
    });
    console.log("hero created");
  }

  const about = await prisma.pageSection.findUnique({
    where: { pageKey_sectionKey: { pageKey: "home", sectionKey: "about" } },
  });
  if (about) {
    const normalized = normalizeAboutContent(JSON.parse(about.content));
    await prisma.pageSection.update({
      where: { id: about.id },
      data: { content: JSON.stringify(normalized) },
    });
    console.log("about normalized");
  } else {
    await prisma.pageSection.create({
      data: {
        id: "home-about",
        pageKey: "home",
        sectionKey: "about",
        label: "About section",
        content: JSON.stringify(normalizeAboutContent(aboutContent)),
      },
    });
    console.log("about created");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
