import { InnerPage } from "@/components/storefront/InnerPage";
import { GlowButton } from "@/components/ui/GlowButton";

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  return (
    <InnerPage
      title="Thank you"
      description="Your booking is confirmed. We will be in touch shortly."
    >
      <GlowButton href="/" variant="primary">
        Return home
      </GlowButton>
    </InnerPage>
  );
}
