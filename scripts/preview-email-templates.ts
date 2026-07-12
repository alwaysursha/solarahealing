import { config } from "dotenv";
import { OrderItemType, OrderStatus } from "@prisma/client";
import { sendEmail } from "../src/lib/email";
import { buildAdminNewOrderEmail } from "../src/lib/email/admin-new-order";
import { buildOrderConfirmationEmail } from "../src/lib/email/order-confirmation";
import { buildPasswordChangedEmail } from "../src/lib/email/password-changed";
import { buildWelcomeEmail } from "../src/lib/email/welcome";

config({ path: ".env.local" });

async function main() {
  const to =
    process.env.EMAIL_TEST_TO?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.EMAIL_ADMIN_TO?.trim() ||
    "admin@soularahealing.com";

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

  for (const template of templates) {
    const result = await sendEmail({
      to,
      subject: `[Preview] ${template.content.subject}`,
      html: template.content.html,
      text: template.content.text,
    });

    if (!result.ok) {
      console.error(`FAILED ${template.id}:`, result.error);
      process.exit(1);
    }

    console.log(`OK ${template.id} → ${to} (${result.id})`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
