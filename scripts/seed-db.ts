import { closeDb } from "../src/db";
import { seedDatabase } from "../src/db/seed";

async function main() {
  await seedDatabase();
  await closeDb();
  console.log("Database seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
