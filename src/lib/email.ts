import { getEmailFrom } from "@/lib/email-config";
import { getRuntimeEnv } from "@/lib/runtime-env";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function getResendApiKey(): string {
  const apiKey = getRuntimeEnv("RESEND_API_KEY") ?? "";
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in environment.");
  }
  return apiKey;
}

/** Send a transactional email via Resend HTTP API (no heavy SDK). */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = getResendApiKey();
  const from = getEmailFrom();
  const to = Array.isArray(input.to) ? input.to : [input.to];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string; name?: string }
    | null;

  if (!response.ok) {
    const error =
      payload?.message ||
      payload?.name ||
      `Resend request failed (${response.status})`;
    console.error("[email] send failed", error);
    return { ok: false, error };
  }

  if (!payload?.id) {
    return { ok: false, error: "Resend did not return a message id." };
  }

  return { ok: true, id: payload.id };
}

export { getEmailFrom } from "@/lib/email-config";
