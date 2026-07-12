import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in environment.");
  }
  return key;
}

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment.");
  }

  if (!stripeClient) {
    // Cloudflare Workers do not implement node:https — use Fetch.
    stripeClient = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  return stripeClient;
}

/** Convert CAD dollars to Stripe’s smallest unit (cents). */
export function cadToStripeAmount(priceCad: number): number {
  return Math.round(priceCad * 100);
}
