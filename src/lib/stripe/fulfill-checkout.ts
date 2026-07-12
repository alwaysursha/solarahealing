import { OrderItemType, OrderStatus } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

/**
 * Marks a pending order paid and books workshop seats.
 * Safe to call more than once for the same Stripe session.
 */
export async function fulfillPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { ok: false as const, reason: "not_paid" as const };
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return { ok: false as const, reason: "missing_order" as const };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { ok: false as const, reason: "order_not_found" as const };
  }

  if (order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED) {
    if (!order.stripeCheckoutSessionId && session.id) {
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeCheckoutSessionId: session.id },
      });
    }
    return { ok: true as const, alreadyFulfilled: true, orderId: order.id };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        stripeCheckoutSessionId: session.id,
      },
    });

    for (const item of order.items) {
      if (item.itemType !== OrderItemType.WORKSHOP) {
        continue;
      }

      await tx.workshop.update({
        where: { id: item.itemId },
        data: {
          seatsBooked: { increment: item.quantity },
        },
      });
    }
  });

  return { ok: true as const, alreadyFulfilled: false, orderId: order.id };
}
