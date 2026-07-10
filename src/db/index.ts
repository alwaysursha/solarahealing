import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "@/db/schema";

export type AppDb = DrizzleD1Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  db?: AppDb;
  disposeProxy?: () => Promise<void>;
};

type D1Binding = Parameters<typeof drizzle>[0];

async function resolveD1Binding(): Promise<D1Binding | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv).DB ?? null;
  } catch {
    // Next.js / Workers runtime not available — fall back to wrangler local proxy.
  }

  try {
    const { getPlatformProxy } = await import("wrangler");
    const proxy = await getPlatformProxy<CloudflareEnv>({
      configPath: "wrangler.jsonc",
    });
    globalForDb.disposeProxy = proxy.dispose;
    return proxy.env.DB ?? null;
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
      "D1 database binding DB is not available. Run: pnpm db:init && pnpm db:setup:local",
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

export async function closeDb(): Promise<void> {
  globalForDb.db = undefined;
  if (globalForDb.disposeProxy) {
    await globalForDb.disposeProxy();
    globalForDb.disposeProxy = undefined;
  }
}

export * from "@/db/schema";
