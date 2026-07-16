import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Read a string env var from process.env, then Cloudflare Worker bindings. */
export function getRuntimeEnv(name: string): string | undefined {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) {
    return fromProcess;
  }

  try {
    const { env } = getCloudflareContext();
    const value = (env as unknown as Record<string, unknown>)[name];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  } catch {
    // Outside Cloudflare runtime (local build, tests, etc.)
  }

  return undefined;
}
