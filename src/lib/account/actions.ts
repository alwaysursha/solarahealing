"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidWhatsAppNumber, normalizeWhatsAppNumber } from "@/lib/whatsapp";

export type AccountActionResult =
  | { ok: true; whatsapp: string }
  | { ok: false; error: string };

export async function updateAccountProfileAction(
  _prev: AccountActionResult | null,
  formData: FormData,
): Promise<AccountActionResult> {
  try {
    const session = await requireUser();
    const name = formData.get("name")?.toString().trim() ?? "";
    const whatsappRaw = formData.get("whatsapp")?.toString().trim() ?? "";

    if (!name) {
      return { ok: false, error: "Name is required." };
    }

    if (whatsappRaw && !isValidWhatsAppNumber(whatsappRaw)) {
      return { ok: false, error: "Enter a valid WhatsApp number with country code (8–15 digits)." };
    }

    const whatsapp = whatsappRaw ? normalizeWhatsAppNumber(whatsappRaw) : null;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, whatsapp },
    });

    revalidatePath("/account");
    revalidatePath("/checkout");
    revalidatePath("/admin/profile");
    revalidatePath("/admin/customers");

    return { ok: true, whatsapp: whatsapp ?? "" };
  } catch {
    return { ok: false, error: "Please sign in to update your profile." };
  }
}

export async function saveCheckoutWhatsAppAction(whatsappRaw: string): Promise<AccountActionResult> {
  try {
    const session = await requireUser();
    const trimmed = whatsappRaw.trim();

    if (!trimmed || !isValidWhatsAppNumber(trimmed)) {
      return { ok: false, error: "Enter a valid WhatsApp number with country code (8–15 digits)." };
    }

    const whatsapp = normalizeWhatsAppNumber(trimmed);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { whatsapp },
    });

    revalidatePath("/account");
    revalidatePath("/checkout");
    revalidatePath("/admin/customers");

    return { ok: true, whatsapp };
  } catch {
    return { ok: false, error: "Please sign in to save your WhatsApp number." };
  }
}
