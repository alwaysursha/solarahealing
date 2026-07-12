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

export function buildWelcomeEmail(input: { name: string; email: string }) {
  const siteUrl = getEmailSiteUrl();
  const firstName = firstNameFrom(input.name);
  const accountUrl = `${siteUrl}/account`;
  const coursesUrl = `${siteUrl}/courses`;

  const subject = `Welcome to ${SITE_NAME}`;
  const preheader = `Your healing journey begins here, ${firstName}.`;

  const bodyHtml = `
    ${paragraph(`Dear ${escapeHtml(firstName)},`)}
    ${paragraph(
      `Welcome to <strong style="font-weight: 600;">${escapeHtml(SITE_NAME)}</strong>. We’re honored you’ve joined our community of seekers, healers, and students walking the path of Reiki.`,
    )}
    ${paragraph(
      `Your account is ready. From here you can enroll in live workshops, explore on-demand courses, and manage your profile — including the WhatsApp number we use for gentle course updates.`,
      true,
    )}
    ${emailCtaButton("Browse courses", coursesUrl)}
    <p style="margin: 1rem 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px;">
      <a href="${escapeHtml(accountUrl)}" style="color: #9D4DAE; text-decoration: underline;">Visit your account</a>
    </p>
    ${mutedNote("If you didn’t create this account, you can ignore this email.")}
    ${paragraph(`With warmth,<br/><em>${escapeHtml(SITE_NAME)}</em>`)}
  `;

  const text = [
    `Dear ${firstName},`,
    "",
    `Welcome to ${SITE_NAME}. Your account is ready.`,
    "",
    `Browse courses: ${coursesUrl}`,
    `Your account: ${accountUrl}`,
    "",
    `With warmth,`,
    SITE_NAME,
  ].join("\n");

  return {
    subject,
    html: renderEmailShell({
      preheader,
      eyebrow: "Welcome",
      title: "Your journey begins",
      bodyHtml,
    }),
    text,
  };
}

export async function sendWelcomeEmail(input: { name: string; email: string }) {
  if (!input.email.trim()) {
    return { ok: false as const, error: "missing_email" };
  }

  const content = buildWelcomeEmail(input);
  const result = await sendEmail({
    to: input.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (!result.ok) {
    console.error("[email] welcome failed", input.email, result.error);
  }

  return result;
}
