import { InnerPage } from "@/components/storefront/InnerPage";
import { SignInForm } from "@/components/auth/AuthForms";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <InnerPage title="Welcome back" description="Sign in to manage sessions, orders, and your healing journey.">
      <Suspense fallback={<p className="text-sm text-purple-deep/60">Loading…</p>}>
        <SignInForm />
      </Suspense>
    </InnerPage>
  );
}
