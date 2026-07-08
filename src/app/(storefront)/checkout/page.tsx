import { InnerPage } from "@/components/storefront/InnerPage";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <InnerPage
      title="Book a session"
      description="Secure checkout for Reiki sessions and attunement courses."
    >
      <p className="rounded-2xl border border-purple-deep/10 bg-cream/40 p-6 text-sm text-purple-deep/60">
        Stripe checkout, cart state, and session booking will render here — server-rendered
        on every request.
      </p>
    </InnerPage>
  );
}
