import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in environment.");
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getEmailFrom(): string {
  const from = process.env.EMAIL_FROM?.trim() ?? "";
  if (!from) {
    throw new Error(
      'Missing EMAIL_FROM in environment. Example: Soulara Healing Academy <hello@soularahealing.com>',
    );
  }
  return from;
}

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

/** Send a transactional email via Resend. */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getResend();
  const from = getEmailFrom();

  const { data, error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  if (error) {
    console.error("[email] send failed", error);
    return { ok: false, error: error.message };
  }

  if (!data?.id) {
    return { ok: false, error: "Resend did not return a message id." };
  }

  return { ok: true, id: data.id };
}
