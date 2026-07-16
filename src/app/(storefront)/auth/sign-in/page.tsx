import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { SignInForm } from "@/components/auth/AuthForms";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <AuthPageShell
      eyebrow="Welcome back"
      title="Sign in"
      titleAccent="to continue"
      description="Manage sessions, courses, and your healing journey with Soulara Healing Academy."
    >
      <Suspense fallback={<p className="auth-page-loading">Loading…</p>}>
        <SignInForm />
      </Suspense>
    </AuthPageShell>
  );
}
