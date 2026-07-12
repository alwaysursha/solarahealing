import { OrderItemType, OrderStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cadToStripeAmount, getStripe, getStripePublishableKey } from "@/lib/stripe";
import { isValidWhatsAppNumber, normalizeWhatsAppNumber } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type CheckoutRequestItem = {
  id?: unknown;
  type?: unknown;
  quantity?: unknown;
};

type ResolvedLine = {
  itemId: string;
  itemType: OrderItemType;
  title: string;
  quantity: number;
  unitPriceCad: number;
};

function parseItems(raw: unknown): { id: string; type: "course" | "workshop"; quantity: number }[] | null {
  if (!Array.isArray(raw) || raw.length === 0) {
    return null;
  }

  const items: { id: string; type: "course" | "workshop"; quantity: number }[] = [];

  for (const entry of raw as CheckoutRequestItem[]) {
    const id = typeof entry.id === "string" ? entry.id.trim() : "";
    const type = entry.type === "course" || entry.type === "workshop" ? entry.type : null;
    const quantity = Math.floor(Number(entry.quantity));

    if (!id || !type || !Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
      return null;
    }

    items.push({ id, type, quantity });
  }

  return items;
}

async function resolveCatalogLines(
  items: { id: string; type: "course" | "workshop"; quantity: number }[],
): Promise<{ ok: true; lines: ResolvedLine[] } | { ok: false; error: string }> {
  const lines: ResolvedLine[] = [];

  for (const item of items) {
    if (item.type === "course") {
      const course = await prisma.onlineCourse.findFirst({
        where: { id: item.id, published: true },
      });
      if (!course) {
        return { ok: false, error: "One of the courses in your cart is no longer available." };
      }
      lines.push({
        itemId: course.id,
        itemType: OrderItemType.COURSE,
        title: course.title,
        quantity: item.quantity,
        unitPriceCad: course.priceCad,
      });
      continue;
    }

    const workshop = await prisma.workshop.findFirst({
      where: { id: item.id, published: true },
    });
    if (!workshop) {
      return { ok: false, error: "One of the workshops in your cart is no longer available." };
    }

    const seatsLeft = workshop.seatsTotal - workshop.seatsBooked;
    if (item.quantity > seatsLeft) {
      return {
        ok: false,
        error: `"${workshop.title}" only has ${Math.max(0, seatsLeft)} seat${seatsLeft === 1 ? "" : "s"} left.`,
      };
    }

    lines.push({
      itemId: workshop.id,
      itemType: OrderItemType.WORKSHOP,
      title: workshop.title,
      quantity: item.quantity,
      unitPriceCad: workshop.priceCad,
    });
  }

  return { ok: true, lines };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return Response.json({ ok: false, error: "Please sign in to continue to payment." }, { status: 401 });
  }

  let body: { items?: unknown; whatsapp?: unknown };
  try {
    body = (await request.json()) as { items?: unknown; whatsapp?: unknown };
  } catch {
    return Response.json({ ok: false, error: "Invalid checkout request." }, { status: 400 });
  }

  const whatsappRaw = typeof body.whatsapp === "string" ? body.whatsapp : "";
  if (!isValidWhatsAppNumber(whatsappRaw)) {
    return Response.json(
      { ok: false, error: "Enter a valid WhatsApp number with country code (8–15 digits)." },
      { status: 400 },
    );
  }

  const cartItems = parseItems(body.items);
  if (!cartItems) {
    return Response.json({ ok: false, error: "Your cart is empty or invalid." }, { status: 400 });
  }

  const resolved = await resolveCatalogLines(cartItems);
  if (!resolved.ok) {
    return Response.json({ ok: false, error: resolved.error }, { status: 400 });
  }

  const whatsapp = normalizeWhatsAppNumber(whatsappRaw);
  const totalCad = resolved.lines.reduce((sum, line) => sum + line.unitPriceCad * line.quantity, 0);
  if (totalCad <= 0) {
    return Response.json({ ok: false, error: "Checkout total must be greater than zero." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { whatsapp },
  });

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: OrderStatus.PENDING,
      totalCad,
      customerName: session.user.name,
      customerEmail: session.user.email,
      notes: `WhatsApp: +${whatsapp}`,
      items: {
        create: resolved.lines.map((line) => ({
          itemType: line.itemType,
          itemId: line.itemId,
          title: line.title,
          quantity: line.quantity,
          unitPriceCad: line.unitPriceCad,
        })),
      },
    },
  });

  let stripe: ReturnType<typeof getStripe>;
  let publishableKey: string;
  try {
    stripe = getStripe();
    publishableKey = getStripePublishableKey();
  } catch (error) {
    console.error("[stripe] missing configuration", error);
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CANCELLED,
        notes: `${order.notes ?? ""}\nStripe is not configured on the server.`.trim(),
      },
    });
    return Response.json(
      {
        ok: false,
        error: "Payments are not configured yet. Please try again shortly.",
      },
      { status: 503 },
    );
  }

  const description =
    resolved.lines.length === 1
      ? resolved.lines[0]!.title
      : `Soulara Healing Academy · ${resolved.lines.length} items`;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cadToStripeAmount(totalCad),
      currency: "cad",
      automatic_payment_methods: { enabled: true },
      receipt_email: session.user.email,
      description,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        whatsapp,
      },
    });

    if (!paymentIntent.client_secret) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          notes: `${order.notes ?? ""}\nStripe PaymentIntent missing client secret.`.trim(),
        },
      });
      return Response.json({ ok: false, error: "Could not start payment." }, { status: 502 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeCheckoutSessionId: paymentIntent.id },
    });

    return Response.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      publishableKey,
      orderId: order.id,
      paymentIntentId: paymentIntent.id,
      totalCad,
    });
  } catch (error) {
    console.error("[stripe] create payment intent failed", error);
    const stripeMessage =
      error && typeof error === "object" && "message" in error && typeof error.message === "string"
        ? error.message
        : null;
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CANCELLED,
        notes: `${order.notes ?? ""}\nStripe payment failed to start${stripeMessage ? `: ${stripeMessage}` : ""}.`.trim(),
      },
    });
    return Response.json(
      {
        ok: false,
        error: "Could not start payment. Please try again.",
      },
      { status: 502 },
    );
  }
}
