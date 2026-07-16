"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeReikiBenefits,
  normalizeReikiChakras,
  normalizeReikiClose,
  normalizeReikiHero,
  normalizeReikiIntro,
  normalizeReikiPathways,
  type ReikiBenefits,
  type ReikiChakras,
  type ReikiClose,
  type ReikiHero,
  type ReikiIntro,
  type ReikiPathways,
  type ReikiSectionKey,
} from "@/lib/reiki-page";

function revalidateReiki() {
  revalidatePath("/reiki");
  revalidatePath("/admin/web");
  revalidatePath("/admin/web/reiki");
}

async function upsertReikiSection(sectionKey: ReikiSectionKey, label: string, content: unknown) {
  const id = `reiki-${sectionKey}`;
  await prisma.pageSection.upsert({
    where: {
      pageKey_sectionKey: { pageKey: "reiki", sectionKey },
    },
    create: {
      id,
      pageKey: "reiki",
      sectionKey,
      label,
      content: JSON.stringify(content),
    },
    update: {
      label,
      content: JSON.stringify(content),
    },
  });
}

export async function saveReikiHeroAction(input: ReikiHero) {
  await requireAdmin();
  const normalized = normalizeReikiHero(input);
  await upsertReikiSection("hero", "Reiki hero", normalized);
  revalidateReiki();
  return { ok: true as const };
}

export async function saveReikiIntroAction(input: ReikiIntro) {
  await requireAdmin();
  const normalized = normalizeReikiIntro(input);
  await upsertReikiSection("intro", "What is Reiki", normalized);
  revalidateReiki();
  return { ok: true as const };
}

export async function saveReikiBenefitsAction(input: ReikiBenefits) {
  await requireAdmin();
  const normalized = normalizeReikiBenefits(input);
  await upsertReikiSection("benefits", "Benefits of Reiki", normalized);
  revalidateReiki();
  return { ok: true as const };
}

export async function saveReikiChakrasAction(input: ReikiChakras) {
  await requireAdmin();
  const normalized = normalizeReikiChakras(input);
  await upsertReikiSection("chakras", "Chakras", normalized);
  revalidateReiki();
  return { ok: true as const };
}

export async function saveReikiPathwaysAction(input: ReikiPathways) {
  await requireAdmin();
  const normalized = normalizeReikiPathways(input);
  await upsertReikiSection("pathways", "Pathways", normalized);
  revalidateReiki();
  return { ok: true as const };
}

export async function saveReikiCloseAction(input: ReikiClose) {
  await requireAdmin();
  const normalized = normalizeReikiClose(input);
  await upsertReikiSection("close", "Closing CTA", normalized);
  revalidateReiki();
  return { ok: true as const };
}
