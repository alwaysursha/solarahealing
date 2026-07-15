import { OrderItemType } from "@prisma/client";
import type { Order, OrderItem } from "@prisma/client";
import { SITE_NAME } from "@/lib/constants";
import { sendEmail } from "@/lib/email";
import { getEmailFrom } from "@/lib/email-config";
import {
  EMAIL_BRAND,
  emailCtaButton,
  escapeHtml,
  getEmailSiteUrl,
  paragraph,
  renderEmailShell,
} from "@/lib/email/layout";
import { orderItemTypeLabel as itemTypeLabel } from "@/lib/order-item-type";
import { formatCad } from "@/lib/site";

type OrderWithItems = Order & { items: OrderItem[] };

function resolveAdminInbox(): string | null {
  const explicit = process.env.EMAIL_ADMIN_TO?.trim();
  if (explicit?.includes("@")) {
    return explicit;
  }

  try {
    const from = getEmailFrom();
    const match = from.match(/<([^>]+)>/)?.[1] ?? from;
    if (match.includes("@")) {
      return match.trim();
    }
  } catch {
    return null;
  }

  return null;
}

export function buildAdminNewOrderEmail(order: OrderWithItems) {
  const siteUrl = getEmailSiteUrl();
  const orderUrl = `${siteUrl}/admin/orders`;
  const orderRef = order.id.slice(0, 10);
  const whatsapp =
    order.notes
      ?.split("\n")
      .find((line) => line.toLowerCase().startsWith("whatsapp:"))
      ?.replace(/^whatsapp:\s*/i, "")
      .trim() ?? "—";

  const linesHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid ${EMAIL_BRAND.border}; color: ${EMAIL_BRAND.text};">
          ${escapeHtml(itemTypeLabel(item.itemType))} · ${escapeHtml(item.title)}
          <span style="color: ${EMAIL_BRAND.textSoft};"> × ${item.quantity}</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid ${EMAIL_BRAND.border}; text-align: right; color: ${EMAIL_BRAND.text};">
          ${formatCad(item.unitPriceCad * item.quantity)}
        </td>
      </tr>
    `,
    )
    .join("");

  const subject = `New paid order · ${formatCad(order.totalCad)} · #${orderRef}`;
  const preheader = `${order.customerName} · ${order.customerEmail}`;

  const bodyHtml = `
    ${paragraph("A customer just completed payment on the storefront.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0.5rem 0 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.textSoft}; width: 7rem;">Customer</td>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.text};"><strong>${escapeHtml(order.customerName)}</strong></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.textSoft};">Email</td>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.text};">${escapeHtml(order.customerEmail)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.textSoft};">WhatsApp</td>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.text};">${escapeHtml(whatsapp)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.textSoft};">Order</td>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.text};">#${escapeHtml(orderRef)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: ${EMAIL_BRAND.textSoft};">Total</td>
        <td style="padding: 6px 0; font-family: Georgia, serif; font-size: 20px; color: #a07820;">${formatCad(order.totalCad)}</td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 0.5rem;">
      ${linesHtml}
    </table>
    ${emailCtaButton("Open orders", orderUrl)}
  `;

  const text = [
    "New paid order",
    `Customer: ${order.customerName}`,
    `Email: ${order.customerEmail}`,
    `WhatsApp: ${whatsapp}`,
    `Order: #${orderRef}`,
    `Total: ${formatCad(order.totalCad)}`,
    "",
    ...order.items.map(
      (item) =>
        `- ${itemTypeLabel(item.itemType)}: ${item.title} × ${item.quantity} = ${formatCad(item.unitPriceCad * item.quantity)}`,
    ),
    "",
    orderUrl,
  ].join("\n");

  return {
    subject,
    html: renderEmailShell({
      preheader,
      eyebrow: "Admin alert",
      title: "New paid order",
      bodyHtml,
      footerNote: `Internal notification from ${SITE_NAME}.`,
    }),
    text,
  };
}

export async function sendAdminNewOrderEmail(order: OrderWithItems) {
  const to = resolveAdminInbox();
  if (!to) {
    console.error("[email] admin new-order skipped — no EMAIL_ADMIN_TO / EMAIL_FROM");
    return { ok: false as const, error: "missing_admin_inbox" };
  }

  const content = buildAdminNewOrderEmail(order);
  const result = await sendEmail({
    to,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (!result.ok) {
    console.error("[email] admin new-order failed", order.id, result.error);
  }

  return result;
}
