import { auth } from "@/auth";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
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
    />
  );
}
