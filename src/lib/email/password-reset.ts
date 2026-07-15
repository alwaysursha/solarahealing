import { SITE_NAME } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import {
  emailCtaButton,
  escapeHtml,
  firstNameFrom,
  getEmailSiteUrl,
  mutedNote,
  paragraph,
  renderEmailShell,
} from "@/lib/email/layout";

export function buildPasswordResetEmail(input: {
  name: string;
  email: string;
  resetUrl: string;
}) {
  const firstName = firstNameFrom(input.name);
  const subject = `${SITE_NAME} · Reset your password`;
  const preheader = "Use this link to choose a new password.";

  const bodyHtml = `
    ${paragraph(`Dear ${escapeHtml(firstName)},`)}
    ${paragraph(
      `We received a request to reset the password for your <strong style="font-weight: 600;">${escapeHtml(SITE_NAME)}</strong> account.`,
    )}
    ${paragraph("This link expires in one hour and can only be used once.", true)}
    ${emailCtaButton("Choose a new password", input.resetUrl)}
    ${mutedNote(
      `If you didn’t ask for a reset, you can ignore this email. Your password will stay the same. Account: ${input.email}`,
    )}
    ${paragraph(`In care,<br/><em>${escapeHtml(SITE_NAME)}</em>`)}
  `;

  const text = [
    `Dear ${firstName},`,
    "",
    `Reset your ${SITE_NAME} password:`,
    input.resetUrl,
    "",
    "This link expires in one hour and can only be used once.",
    "If you didn’t ask for a reset, ignore this email.",
    "",
    SITE_NAME,
  ].join("\n");

  return {
    subject,
    html: renderEmailShell({
      preheader,
      eyebrow: "Account security",
      title: "Reset your password",
      bodyHtml,
      footerNote: `Security notice from ${SITE_NAME}.`,
    }),
    text,
  };
}

export async function sendPasswordResetEmail(input: {
  name: string;
  email: string;
  resetUrl: string;
}) {
  if (!input.email.trim()) {
    return { ok: false as const, error: "missing_email" };
  }

  const content = buildPasswordResetEmail(input);
  const result = await sendEmail({
    to: input.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (!result.ok) {
    console.error("[email] password-reset failed", input.email, result.error);
  }

  return result;
}
