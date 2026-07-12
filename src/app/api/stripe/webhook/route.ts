import {
  constructStripeEvent,
  type StripeCheckoutSession,
  type StripePaymentIntent,
} from "@/lib/stripe";
import {
  fulfillPaidCheckoutSession,
  fulfillPaidPaymentIntent,
} from "@/lib/stripe/fulfill-checkout";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
  if (!webhookSecret) {
    console.error("[stripe webhook] Missing STRIPE_WEBHOOK_SECRET");
    return Response.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = await constructStripeEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe webhook] Signature verification failed", error);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as StripePaymentIntent;
        const result = await fulfillPaidPaymentIntent(paymentIntent);
        if (!result.ok && result.reason !== "not_paid") {
          console.error("[stripe webhook] PaymentIntent fulfillment issue", result);
        }
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as StripeCheckoutSession;
        const result = await fulfillPaidCheckoutSession(session);
        if (!result.ok && result.reason !== "not_paid") {
          console.error("[stripe webhook] Fulfillment issue", result);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as StripeCheckoutSession;
        await fulfillPaidCheckoutSession(session);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("[stripe webhook] Handler error", error);
    return Response.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
