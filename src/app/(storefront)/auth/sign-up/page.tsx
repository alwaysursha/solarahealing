import { InnerPage } from "@/components/storefront/InnerPage";
import { GlowButton } from "@/components/ui/GlowButton";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <InnerPage
      title="Create your account"
      description="Join to book sessions, subscribe to healing insights, and manage your profile."
    >
      <p className="rounded-2xl border border-purple-deep/10 bg-cream/40 p-6 text-sm text-purple-deep/60">
        Sign-up form and server actions will be added with Prisma + NextAuth.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <GlowButton href="/auth/sign-in" variant="outline">
          Sign in instead
        </GlowButton>
        <GlowButton href="/" variant="primary">
          Back home
        </GlowButton>
      </div>
    </InnerPage>
  );
}
