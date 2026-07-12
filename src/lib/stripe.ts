/** Lightweight Stripe helpers via fetch — avoids the heavy Node SDK in the Worker. */

export type StripePaymentIntent = {
  id: string;
  object: "payment_intent";
  status: string;
  client_secret: string | null;
  amount: number;
  currency: string;
  metadata: Record<string, string>;
};

export type StripeCheckoutSession = {
  id: string;
  object: "checkout.session";
  status: string | null;
  payment_status: string;
  payment_intent: string | { id: string } | null;
  metadata: Record<string, string> | null;
};

export type StripeEvent = {
  id: string;
  type: string;
  data: { object: StripePaymentIntent | StripeCheckoutSession | Record<string, unknown> };
};

function getStripeSecretKey(): string {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment.");
  }
  return secretKey;
}

export function getStripePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in environment.");
  }
  return key;
}

/** Convert CAD dollars to Stripe’s smallest unit (cents). */
export function cadToStripeAmount(priceCad: number): number {
  return Math.round(priceCad * 100);
}

async function stripeRequest<T>(
  path: string,
  init?: { method?: string; form?: Record<string, string> },
): Promise<T> {
  const secretKey = getStripeSecretKey();
  const method = init?.method ?? "GET";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey}`,
  };

  let body: string | undefined;
  if (init?.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(init.form).toString();
  }

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers,
    body,
  });

  const payload = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(payload.error?.message ?? `Stripe request failed (${response.status})`);
  }

  return payload;
}

export async function createPaymentIntent(input: {
  amount: number;
  currency: string;
  receiptEmail: string;
  description: string;
  metadata: Record<string, string>;
}): Promise<StripePaymentIntent> {
  return stripeRequest<StripePaymentIntent>("payment_intents", {
    method: "POST",
    form: {
      amount: String(input.amount),
      currency: input.currency,
      "automatic_payment_methods[enabled]": "true",
      receipt_email: input.receiptEmail,
      description: input.description,
      ...Object.fromEntries(
        Object.entries(input.metadata).map(([key, value]) => [`metadata[${key}]`, value]),
      ),
    },
  });
}

export async function retrievePaymentIntent(id: string): Promise<StripePaymentIntent> {
  return stripeRequest<StripePaymentIntent>(`payment_intents/${encodeURIComponent(id)}`);
}

export async function retrieveCheckoutSession(id: string): Promise<StripeCheckoutSession> {
  return stripeRequest<StripeCheckoutSession>(`checkout/sessions/${encodeURIComponent(id)}`);
}

function parseStripeSignatureHeader(header: string): { timestamp: string; signatures: string[] } {
  const parts = header.split(",").map((part) => part.trim());
  let timestamp = "";
  const signatures: string[] = [];

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key === "t" && value) {
      timestamp = value;
    }
    if (key === "v1" && value) {
      signatures.push(value);
    }
  }

  if (!timestamp || signatures.length === 0) {
    throw new Error("Invalid Stripe signature header.");
  }

  return { timestamp, signatures };
}

function decodeWebhookSecret(secret: string): ArrayBuffer {
  const raw = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret;
  const binary = atob(raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Verify Stripe webhook signatures with Web Crypto (Workers-safe). */
export async function constructStripeEvent(
  payload: string,
  signatureHeader: string,
  webhookSecret: string,
  toleranceSeconds = 300,
): Promise<StripeEvent> {
  const { timestamp, signatures } = parseStripeSignatureHeader(signatureHeader);
  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(age) || Math.abs(age) > toleranceSeconds) {
    throw new Error("Stripe webhook timestamp outside tolerance.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    decodeWebhookSecret(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signedPayload = `${timestamp}.${payload}`;
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expected = toHex(digest);
  const valid = signatures.some((signature) => timingSafeEqual(signature, expected));
  if (!valid) {
    throw new Error("Stripe webhook signature mismatch.");
  }

  return JSON.parse(payload) as StripeEvent;
}
