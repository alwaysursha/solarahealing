import { auth } from "@/auth";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  let initialWhatsApp = "";

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { whatsapp: true },
    });
    initialWhatsApp = user?.whatsapp ?? "";
  }

  return (
    <CheckoutClient
      initialWhatsApp={initialWhatsApp}
      isAuthenticated={Boolean(session?.user)}
      canceled={params.canceled === "1"}
    />
  );
}
