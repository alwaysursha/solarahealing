import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import { normalizeNavItems, parseNavJson } from "../src/lib/frontpage-content";

config({ path: ".env.local", override: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL missing");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const current = parseNavJson(row?.navJson);
  const next = normalizeNavItems(current.length ? current : null);

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: { navJson: JSON.stringify(next) },
  });

  console.log("Updated nav:");
  for (const item of next) {
    console.log(`- ${item.label} → ${item.href} [${item.icon}]`);
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
