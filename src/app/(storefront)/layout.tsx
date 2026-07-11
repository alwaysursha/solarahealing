import { auth } from "@/auth";
import { StorefrontShell } from "@/components/storefront/StorefrontShell";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <StorefrontShell session={session}>{children}</StorefrontShell>;
}
