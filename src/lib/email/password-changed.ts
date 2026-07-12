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

export function buildPasswordChangedEmail(input: { name: string; email: string }) {
  const siteUrl = getEmailSiteUrl();
  const accountUrl = `${siteUrl}/account`;
  const firstName = firstNameFrom(input.name);

  const subject = `${SITE_NAME} · Your password was changed`;
  const preheader = "If this wasn’t you, contact us right away.";

  const bodyHtml = `
    ${paragraph(`Dear ${escapeHtml(firstName)},`)}
    ${paragraph(
      `This is a confirmation that the password for your <strong style="font-weight: 600;">${escapeHtml(SITE_NAME)}</strong> account was changed successfully.`,
    )}
    ${paragraph(
      `If you made this change, no further action is needed. If you did not, please sign in to secure your account or contact us immediately.`,
      true,
    )}
    ${emailCtaButton("Go to your account", accountUrl)}
    ${mutedNote(`Account email: ${input.email}`)}
    ${paragraph(`In care,<br/><em>${escapeHtml(SITE_NAME)}</em>`)}
  `;

  const text = [
    `Dear ${firstName},`,
    "",
    `Your ${SITE_NAME} password was changed.`,
    "If this wasn’t you, contact us right away.",
    "",
    accountUrl,
    "",
    SITE_NAME,
  ].join("\n");

  return {
    subject,
    html: renderEmailShell({
      preheader,
      eyebrow: "Account security",
      title: "Password updated",
      bodyHtml,
      footerNote: `Security notice from ${SITE_NAME}.`,
    }),
    text,
  };
}

export async function sendPasswordChangedEmail(input: { name: string; email: string }) {
  if (!input.email.trim()) {
    return { ok: false as const, error: "missing_email" };
  }

  const content = buildPasswordChangedEmail(input);
  const result = await sendEmail({
    to: input.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (!result.ok) {
    console.error("[email] password-changed failed", input.email, result.error);
  }

  return result;
}
