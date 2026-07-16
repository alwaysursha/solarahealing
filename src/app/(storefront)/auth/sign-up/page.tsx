import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { SignUpForm } from "@/components/auth/AuthForms";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <AuthPageShell
      eyebrow="Join Soulara Healing Academy"
      title="Create your"
      titleAccent="account"
      description="Book private sessions, enroll in courses, and keep your healing path in one place."
    >
      <Suspense fallback={<p className="auth-page-loading">Loading…</p>}>
        <SignUpForm />
      </Suspense>
    </AuthPageShell>
  );
}
