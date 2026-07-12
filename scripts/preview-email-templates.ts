import { config } from "dotenv";
import { OrderItemType, OrderStatus } from "@prisma/client";
import { Resend } from "resend";
import { buildAdminNewOrderEmail } from "../src/lib/email/admin-new-order";
import { buildOrderConfirmationEmail } from "../src/lib/email/order-confirmation";
import { buildPasswordChangedEmail } from "../src/lib/email/password-changed";
import { buildWelcomeEmail } from "../src/lib/email/welcome";

config({ path: ".env.local" });

async function main() {
  const apiKey = process.env.RESEND_API_KEY?.trim() ?? "";
  const from = process.env.EMAIL_FROM?.trim() ?? "";
  const to =
    process.env.EMAIL_TEST_TO?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    "admin@soularahealing.com";

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or EMAIL_FROM in .env.local");
  }

  const name = "Ali";
  const now = new Date();
  const order = {
    id: "previeworder01abcdefgh",
    userId: "preview-user",
    status: OrderStatus.PAID,
    totalCad: 449,
    customerName: name,
    customerEmail: to,
    notes: "WhatsApp: +12215550123",
    stripeCheckoutSessionId: "pi_preview",
    createdAt: now,
    updatedAt: now,
    items: [
      {
        id: "item1",
        orderId: "previeworder01abcdefgh",
        itemType: OrderItemType.COURSE,
        itemId: "course-1",
        title: "Chakra Mastery Program",
        quantity: 1,
        unitPriceCad: 329,
      },
      {
        id: "item2",
        orderId: "previeworder01abcdefgh",
        itemType: OrderItemType.WORKSHOP,
        itemId: "workshop-1",
        title: "Reiki Level I Intensive",
        quantity: 1,
        unitPriceCad: 120,
      },
    ],
  };

  const templates = [
    { id: "welcome", content: buildWelcomeEmail({ name, email: to }) },
    { id: "order", content: buildOrderConfirmationEmail(order) },
    { id: "admin-order", content: buildAdminNewOrderEmail(order) },
    { id: "password", content: buildPasswordChangedEmail({ name, email: to }) },
  ] as const;

  const resend = new Resend(apiKey);

  for (const template of templates) {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: `[Preview] ${template.content.subject}`,
      html: template.content.html,
      text: template.content.text,
    });

    if (error) {
      console.error(`FAILED ${template.id}:`, error.message);
      process.exit(1);
    }

    console.log(`OK ${template.id} → ${to} (${data?.id})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
