import type { Order, OrderItem } from "@prisma/client";
import { SITE_NAME } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import {
  EMAIL_BRAND,
  emailCtaButton,
  escapeHtml,
  firstNameFrom,
  getEmailSiteUrl,
  mutedNote,
  paragraph,
  renderEmailShell,
} from "@/lib/email/layout";
import { orderItemTypeLabel as itemTypeLabel } from "@/lib/order-item-type";
import { formatCad } from "@/lib/site";

type OrderWithItems = Order & { items: OrderItem[] };

export function buildOrderConfirmationEmail(order: OrderWithItems) {
  const siteUrl = getEmailSiteUrl();
  const accountUrl = `${siteUrl}/account`;
  const firstName = firstNameFrom(order.customerName);
  const orderRef = order.id.slice(0, 10);

  const linesHtml = order.items
    .map((item) => {
      const lineTotal = formatCad(item.unitPriceCad * item.quantity);
      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid ${EMAIL_BRAND.border}; vertical-align: top;">
            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #a07820;">
              ${escapeHtml(itemTypeLabel(item.itemType))}
            </p>
            <p style="margin: 6px 0 0; font-size: 17px; line-height: 1.35; color: ${EMAIL_BRAND.text};">
              ${escapeHtml(item.title)}
            </p>
            <p style="margin: 4px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: ${EMAIL_BRAND.textSoft};">
              Qty ${item.quantity} · ${formatCad(item.unitPriceCad)} each
            </p>
          </td>
          <td style="padding: 14px 0; border-bottom: 1px solid ${EMAIL_BRAND.border}; text-align: right; vertical-align: top; white-space: nowrap; font-size: 16px; font-weight: 600; color: ${EMAIL_BRAND.text};">
            ${lineTotal}
          </td>
        </tr>
      `;
    })
    .join("");

  const linesText = order.items
    .map(
      (item) =>
        `- ${itemTypeLabel(item.itemType)}: ${item.title} × ${item.quantity} = ${formatCad(item.unitPriceCad * item.quantity)}`,
    )
    .join("\n");

  const subject = `${SITE_NAME} · Enrollment confirmed (#${orderRef})`;
  const preheader = `Payment received · ${formatCad(order.totalCad)} · Order #${orderRef}`;

  const bodyHtml = `
    ${paragraph(`Dear ${escapeHtml(firstName)},`)}
    ${paragraph(
      `Thank you for enrolling with <strong style="font-weight: 600;">${escapeHtml(SITE_NAME)}</strong>. Your payment is confirmed and your place is reserved.`,
    )}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0 4px; border-radius: 16px; background: linear-gradient(180deg, rgba(247, 242, 251, 0.95), #ffffff); border: 1px solid ${EMAIL_BRAND.border};">
      <tr>
        <td style="padding: 18px 18px 8px;">
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: ${EMAIL_BRAND.textSoft};">
            Order summary · #${escapeHtml(orderRef)}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 8px;">
            ${linesHtml}
            <tr>
              <td style="padding: 16px 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color: ${EMAIL_BRAND.text};">
                Total paid
              </td>
              <td style="padding: 16px 0 8px; text-align: right; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #a07820;">
                ${formatCad(order.totalCad)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ${paragraph(
      `Please watch for a WhatsApp message from our team. We’ll guide you through the next steps and help you prepare.`,
      true,
    )}
    ${emailCtaButton("View your account", accountUrl)}
    ${mutedNote("A copy of this order is also saved in your profile.")}
    ${paragraph(`With gratitude,<br/><em>${escapeHtml(SITE_NAME)}</em>`)}
  `;

  const text = [
    `Dear ${firstName},`,
    "",
    `Thank you for enrolling with ${SITE_NAME}. Your payment is confirmed.`,
    "",
    `Order #${orderRef}`,
    linesText,
    `Total paid: ${formatCad(order.totalCad)}`,
    "",
    "Please watch for a WhatsApp message from our team with next steps.",
    `Account: ${accountUrl}`,
    "",
    "With gratitude,",
    SITE_NAME,
  ].join("\n");

  return {
    subject,
    html: renderEmailShell({
      preheader,
      eyebrow: "Enrollment confirmed",
      title: "You’re officially in",
      bodyHtml,
      footerNote: `You’re receiving this because you completed a purchase at ${SITE_NAME}.`,
    }),
    text,
  };
}

export async function sendOrderConfirmationEmail(order: OrderWithItems) {
  if (!order.customerEmail.trim()) {
    console.error("[email] order confirmation skipped — missing customer email", order.id);
    return { ok: false as const, error: "missing_email" };
  }

  const content = buildOrderConfirmationEmail(order);
  const result = await sendEmail({
    to: order.customerEmail,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (!result.ok) {
    console.error("[email] order confirmation failed", order.id, result.error);
  }

  return result;
}
