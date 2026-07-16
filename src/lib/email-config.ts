import { getRuntimeEnv } from "@/lib/runtime-env";

export function getEmailFrom(): string {
  const from = getRuntimeEnv("EMAIL_FROM") ?? "";
  if (!from) {
    throw new Error(
      'Missing EMAIL_FROM in environment. Example: Soulara Healing Academy <hello@soularahealing.com>',
    );
  }
  return from;
}

export function getEmailAdminTo(): string | undefined {
  return getRuntimeEnv("EMAIL_ADMIN_TO");
}
