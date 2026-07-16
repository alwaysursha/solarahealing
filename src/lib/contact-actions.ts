"use server";

import { sendEmail } from "@/lib/email";
import { getEmailAdminTo } from "@/lib/email-config";
import { escapeHtml, paragraph, renderEmailShell } from "@/lib/email/layout";
import { getSiteSettings } from "@/lib/site-settings";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

export async function submitContactFormAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  if (!name || !email || !message) {
    return { ok: false, error: "Please complete all fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const settings = await getSiteSettings();
  const contactTo = settings.contact.email.trim();
  const adminTo = getEmailAdminTo();
  const recipients = Array.from(
    new Set([contactTo, adminTo].filter((value): value is string => Boolean(value?.includes("@")))),
  );
  if (recipients.length === 0) {
    return { ok: false, error: "Contact email is not configured yet." };
  }

  const subject = `New contact message from ${name}`;
  const bodyHtml = `
    ${paragraph(`You received a new message from the website contact form.`)}
    ${paragraph(`<strong>Name:</strong> ${escapeHtml(name)}<br/><strong>Email:</strong> ${escapeHtml(email)}`)}
    ${paragraph(escapeHtml(message).replaceAll("\n", "<br/>"))}
  `;

  const html = renderEmailShell({
    preheader: `${name} sent a message via ${settings.name}`,
    title: "New contact message",
    eyebrow: "Website contact",
    bodyHtml,
    footerNote: `Sent to ${recipients.join(", ")} from the Contact Us form.`,
  });

  const text = [
    `New contact message from ${name}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  try {
    const result = await sendEmail({
      to: recipients,
      subject,
      html,
      text,
      replyTo: email,
    });

    if (!result.ok) {
      console.error("[contact] email failed", result.error);
      return { ok: false, error: "Unable to send your message right now. Please try again." };
    }

    return { ok: true };
  } catch (error) {
    console.error("[contact] email exception", error);
    return { ok: false, error: "Unable to send your message right now. Please try again." };
  }
}
