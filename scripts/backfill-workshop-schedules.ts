import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Pool } from "pg";
import {
  formatWorkshopScheduleLabel,
  WORKSHOP_SCHEDULE_SEEDS,
} from "../src/lib/admin/workshop-schedule";

config();
config({ path: ".env.local", override: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const workshops = await prisma.workshop.findMany({ orderBy: { sortOrder: "asc" } });

  for (const [index, workshop] of workshops.entries()) {
    const seeded = WORKSHOP_SCHEDULE_SEEDS[workshop.id];
    const scheduledAt = seeded
      ? new Date(seeded)
      : new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);

    await prisma.workshop.update({
      where: { id: workshop.id },
      data: {
        scheduledAt,
        dateLabel: formatWorkshopScheduleLabel(scheduledAt),
      },
    });

    console.log(`  ✓ ${workshop.title} → ${formatWorkshopScheduleLabel(scheduledAt)}`);
  }

  console.log(`\n✅ Backfilled ${workshops.length} workshop schedule(s).`);
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
