import { OrderItemType, OrderStatus } from "@prisma/client";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { buildAdminNewOrderEmail } from "@/lib/email/admin-new-order";
import { buildOrderConfirmationEmail } from "@/lib/email/order-confirmation";
import { buildPasswordChangedEmail } from "@/lib/email/password-changed";
import { buildWelcomeEmail } from "@/lib/email/welcome";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

type TemplateId = "welcome" | "order" | "admin-order" | "password";

function sampleOrder(email: string, name: string) {
  const now = new Date();
  return {
    id: "previeworder01abcdefgh",
    userId: "preview-user",
    status: OrderStatus.PAID,
    totalCad: 449,
    customerName: name || "Soulara Member",
    customerEmail: email,
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
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== Role.ADMIN) {
    return Response.json({ ok: false, error: "Admin only." }, { status: 401 });
  }

  let template: TemplateId = "welcome";
  let to = session.user.email;

  try {
    const body = (await request.json()) as { to?: unknown; template?: unknown };
    if (typeof body.to === "string" && body.to.trim().includes("@")) {
      to = body.to.trim().toLowerCase();
    }
    if (
      body.template === "welcome" ||
      body.template === "order" ||
      body.template === "admin-order" ||
      body.template === "password"
    ) {
      template = body.template;
    }
  } catch {
    // optional body
  }

  const name = session.user.name || "Soulara Member";
  const order = sampleOrder(to, name);

  const content =
    template === "order"
      ? buildOrderConfirmationEmail(order)
      : template === "admin-order"
        ? buildAdminNewOrderEmail(order)
        : template === "password"
          ? buildPasswordChangedEmail({ name, email: to })
          : buildWelcomeEmail({ name, email: to });

  const result = await sendEmail({
    to,
    subject: `[Preview] ${content.subject}`,
    html: content.html,
    text: content.text,
  });

  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  return Response.json({ ok: true, id: result.id, to, template });
}
