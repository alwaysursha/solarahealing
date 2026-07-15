import { Suspense } from "react";
import { InnerPage } from "@/components/storefront/InnerPage";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return (
    <InnerPage
      title="Choose a new password"
      description="Enter a new password for your Soulara Healing Academy account."
    >
      <Suspense fallback={<p className="text-sm text-purple-deep/60">Loading…</p>}>
        <ResetPasswordForm token={token} />
      </Suspense>
    </InnerPage>
  );
}
