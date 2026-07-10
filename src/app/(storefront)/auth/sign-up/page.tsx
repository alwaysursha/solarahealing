import { InnerPage } from "@/components/storefront/InnerPage";
import { SignUpForm } from "@/components/auth/AuthForms";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <InnerPage title="Create your account" description="Join Soulara Healing to book sessions and track your journey.">
      <SignUpForm />
    </InnerPage>
  );
}
