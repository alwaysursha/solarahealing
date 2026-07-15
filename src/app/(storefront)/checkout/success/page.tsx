import { OrderItemType, OrderStatus } from "@prisma/client";
import { orderItemTypeLabel as itemTypeLabel } from "@/lib/order-item-type";
import { auth } from "@/auth";
import {
  CheckoutSuccessActions,
  CheckoutSuccessClearCart,
} from "@/components/checkout/CheckoutSuccessClient";
import { prisma } from "@/lib/prisma";
import { formatCad } from "@/lib/site";
import { retrieveCheckoutSession, retrievePaymentIntent } from "@/lib/stripe";
import {
  fulfillPaidCheckoutSession,
  fulfillPaidPaymentIntent,
} from "@/lib/stripe/fulfill-checkout";

export const dynamic = "force-dynamic";

type SuccessItem = {
  id: string;
  title: string;
  quantity: number;
  unitPriceCad: number;
  itemType: OrderItemType;
};

function formatEnrollmentNames(titles: string[]): string {
  if (titles.length === 0) {
    return "your program";
  }
  if (titles.length === 1) {
    return titles[0]!;
  }
  if (titles.length === 2) {
    return `${titles[0]} and ${titles[1]}`;
  }
  const head = titles.slice(0, -1).join(", ");
  return `${head}, and ${titles[titles.length - 1]}`;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; payment_intent?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim() ?? "";
  const paymentIntentId = params.payment_intent?.trim() ?? "";
  const userSession = await auth();

  let confirmed = false;
  let verifying = false;
  let orderSummary: {
    id: string;
    totalCad: number;
    status: OrderStatus;
    email: string;
    createdAt: Date;
    items: SuccessItem[];
  } | null = null;

  try {
    if (paymentIntentId) {
      const paymentIntent = await retrievePaymentIntent(paymentIntentId);
      await fulfillPaidPaymentIntent(paymentIntent);
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (order && (!userSession?.user?.id || order.userId === userSession.user.id)) {
          orderSummary = {
            id: order.id,
            totalCad: order.totalCad,
            status: order.status,
            email: order.customerEmail,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              unitPriceCad: item.unitPriceCad,
              itemType: item.itemType,
            })),
          };
          confirmed =
            order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED;
        }
      } else {
        verifying = true;
      }
    } else if (sessionId) {
      const checkoutSession = await retrieveCheckoutSession(sessionId);
      await fulfillPaidCheckoutSession(checkoutSession);
      const orderId = checkoutSession.metadata?.orderId;

      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (order && (!userSession?.user?.id || order.userId === userSession.user.id)) {
          orderSummary = {
            id: order.id,
            totalCad: order.totalCad,
            status: order.status,
            email: order.customerEmail,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              unitPriceCad: item.unitPriceCad,
              itemType: item.itemType,
            })),
          };
          confirmed =
            order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED;
        }
      } else {
        verifying = true;
      }
    }
  } catch (error) {
    console.error("[checkout success] Could not verify payment", error);
    verifying = Boolean(paymentIntentId || sessionId);
  }

  const enrollmentNames = formatEnrollmentNames(orderSummary?.items.map((item) => item.title) ?? []);

  return (
    <div className="checkout-page">
      <div className="checkout-page-aura" aria-hidden />
      <CheckoutSuccessClearCart />
      <div className="checkout-page-inner checkout-success-inner">
        {confirmed && orderSummary ? (
          <div className="checkout-success-layout">
            <div className="checkout-success-main">
              <p className="checkout-hero-eyebrow">Soulara Healing Academy</p>
              <h1 className="checkout-hero-title">Welcome to your Reiki journey</h1>
              <p className="checkout-hero-copy checkout-success-lead">
                Your enrollment is confirmed.
              </p>

              <div className="checkout-success-message">
                <p>
                  Thank you for enrolling in <strong>{enrollmentNames}</strong>.
                </p>
                <p>We&apos;ve received your payment, and your receipt has been sent to your email.</p>
                <p>
                  Please watch for a WhatsApp message from our team. We&apos;ll be in touch shortly to
                  guide you through the next steps and help you prepare for your course.
                </p>
                <p>
                  A copy of your order has also been saved in your profile for your reference.
                </p>
              </div>

              <CheckoutSuccessActions />
            </div>

            <aside className="checkout-success-aside">
              <section className="checkout-success-card" aria-label="Order summary">
                <div className="checkout-success-card-glow" aria-hidden />
                <div className="checkout-success-card-top">
                  <div>
                    <p className="checkout-success-card-eyebrow">Order confirmed</p>
                    <p className="checkout-success-card-id">#{orderSummary.id.slice(0, 10)}</p>
                  </div>
                  <div className="checkout-success-card-total-wrap">
                    <p className="checkout-success-card-total-label">Total paid</p>
                    <p className="checkout-success-card-total">{formatCad(orderSummary.totalCad)}</p>
                  </div>
                </div>

                <dl className="checkout-success-meta">
                  <div>
                    <dt>Email</dt>
                    <dd>{orderSummary.email}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>
                      {new Intl.DateTimeFormat("en-CA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(orderSummary.createdAt)}
                    </dd>
                  </div>
                </dl>

                <ul className="checkout-success-card-items">
                  {orderSummary.items.map((item) => (
                    <li key={item.id}>
                      <div className="min-w-0">
                        <p className="checkout-success-item-type">{itemTypeLabel(item.itemType)}</p>
                        <p className="checkout-success-item-title">{item.title}</p>
                      </div>
                      <div className="checkout-success-item-pricing">
                        <span>
                          {item.quantity} × {formatCad(item.unitPriceCad)}
                        </span>
                        <strong>{formatCad(item.unitPriceCad * item.quantity)}</strong>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        ) : (
          <div className="checkout-success-fallback">
            <p className="checkout-hero-eyebrow">Soulara Healing Academy</p>
            {verifying ? (
              <>
                <h1 className="checkout-hero-title">Thanks — we&apos;re confirming your payment</h1>
                <p className="checkout-hero-copy">
                  If you completed checkout, your order will appear in your account shortly. Contact
                  us if it doesn&apos;t.
                </p>
              </>
            ) : (
              <>
                <h1 className="checkout-hero-title">Thank you</h1>
                <p className="checkout-hero-copy">
                  Your booking is confirmed. We will be in touch shortly.
                </p>
              </>
            )}
            <CheckoutSuccessActions />
          </div>
        )}
      </div>
    </div>
  );
}
