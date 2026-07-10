import { seedDatabase } from "../src/db/seed";

async function main() {
  await seedDatabase();
  console.log("Database seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
