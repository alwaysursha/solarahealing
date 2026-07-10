import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export type AppDb = DrizzleD1Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  db?: AppDb;
};

type D1Binding = Parameters<typeof drizzle>[0];

async function resolveD1Binding(): Promise<D1Binding | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv).DB ?? null;
  } catch {
    return null;
  }
}

export async function getDb(): Promise<AppDb> {
  if (globalForDb.db) {
    return globalForDb.db;
  }

  const d1 = await resolveD1Binding();
  if (!d1) {
    throw new Error(
      "D1 database binding DB is not available. Add d1_databases to wrangler.jsonc and run pnpm db:setup.",
    );
  }

  const db = drizzle(d1, { schema });
  globalForDb.db = db;
  return db;
}

export async function getDbOrNull(): Promise<AppDb | null> {
  try {
    return await getDb();
  } catch {
    return null;
  }
}

export * from "@/db/schema";
