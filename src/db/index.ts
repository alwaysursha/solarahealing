import { createClient } from "@libsql/client";
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

export type AppDb = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  db?: AppDb;
};

function isBuildTime(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-export"
  );
}

function resolveLibsqlUrl(): string {
  const configured = process.env.DATABASE_URL?.trim();
  if (configured) {
    return configured;
  }

  if (isBuildTime() || process.env.CI === "true") {
    return "file::memory:?cache=shared";
  }

  return "file:./data/solara.db";
}

function createLibsqlDb(): AppDb {
  const client = createClient({ url: resolveLibsqlUrl() });
  return drizzleLibsql(client, { schema });
}

async function createD1Db(): Promise<AppDb | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const d1 = (env as { DB?: Parameters<typeof drizzleD1>[0] }).DB;
    if (!d1) {
      return null;
    }

    return drizzleD1(d1, { schema }) as unknown as AppDb;
  } catch {
    return null;
  }
}

export async function getDb(): Promise<AppDb> {
  if (globalForDb.db) {
    return globalForDb.db;
  }

  const d1Db = await createD1Db();
  if (d1Db) {
    globalForDb.db = d1Db;
    return d1Db;
  }

  const libsqlDb = createLibsqlDb();
  if (process.env.NODE_ENV !== "production") {
    globalForDb.db = libsqlDb;
  }

  return libsqlDb;
}

export * from "@/db/schema";
