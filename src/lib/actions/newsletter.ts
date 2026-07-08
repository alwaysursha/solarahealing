import { connection } from "next/server";

export const dynamic = "force-dynamic";

/** Ensures newsletter subscriptions are handled per-request when wired to DB */
export async function subscribeToNewsletter(email: string) {
  await connection();
  if (!email?.includes("@")) {
    return { ok: false as const, error: "Invalid email" };
  }
  return { ok: true as const, email };
}
