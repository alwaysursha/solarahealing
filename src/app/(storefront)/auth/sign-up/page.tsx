import { InnerPage } from "@/components/storefront/InnerPage";
import { SignUpForm } from "@/components/auth/AuthForms";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <InnerPage title="Create your account" description="Join Soulara Healing Academy to book sessions and track your journey.">
      <Suspense fallback={<p className="text-sm text-purple-deep/60">Loading…</p>}>
        <SignUpForm />
      </Suspense>
    </InnerPage>
  );
}
