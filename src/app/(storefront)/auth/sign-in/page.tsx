import { InnerPage } from "@/components/storefront/InnerPage";
import { GlowButton } from "@/components/ui/GlowButton";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <InnerPage
      title="Welcome back"
      description="Sign in to manage sessions, orders, and your healing journey."
    >
      <p className="rounded-2xl border border-purple-deep/10 bg-cream/40 p-6 text-sm text-purple-deep/60">
        Authentication will connect here (NextAuth + database), matching the theminiwear
        pattern.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <GlowButton href="/auth/sign-up" variant="outline">
          Create account
        </GlowButton>
        <GlowButton href="/" variant="primary">
          Back home
        </GlowButton>
      </div>
    </InnerPage>
  );
}
