import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return (
    <AuthPageShell
      eyebrow="Account recovery"
      title="Choose a"
      titleAccent="new password"
      description="Enter a new password for your Soulara Healing Academy account."
    >
      <Suspense fallback={<p className="auth-page-loading">Loading…</p>}>
        <ResetPasswordForm token={token} />
      </Suspense>
    </AuthPageShell>
  );
}
