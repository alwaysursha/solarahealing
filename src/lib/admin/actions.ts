"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  articles,
  getDb,
  onlineCourses,
  orderItems,
  orders,
  pageSections,
  siteSettings,
  users,
  workshops,
} from "@/db";
import { requireAdmin, requireUser } from "@/auth";
import { createId, nowIso } from "@/lib/id";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/workshops");
  revalidatePath("/blog");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const ts = nowIso();

  await db
    .update(siteSettings)
    .set({
      name: formData.get("name")?.toString() ?? "",
      tagline: formData.get("tagline")?.toString() ?? "",
      sanskrit: formData.get("sanskrit")?.toString() ?? "",
      sanskritMeaning: formData.get("sanskritMeaning")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      seoTitle: formData.get("seoTitle")?.toString() ?? "",
      metaDescription: formData.get("metaDescription")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      whatsapp: formData.get("whatsapp")?.toString() ?? "",
      address: formData.get("address")?.toString() ?? "",
      cta: formData.get("cta")?.toString() ?? "",
      updatedAt: ts,
    })
    .where(eq(siteSettings.id, 1));

  revalidateAll();
}

export async function upsertCourseAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const id = formData.get("id")?.toString() || createId();
  const ts = nowIso();
  const payload = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    dateLabel: formData.get("dateLabel")?.toString() ?? "Start anytime",
    duration: formData.get("duration")?.toString() ?? "",
    badge: formData.get("badge")?.toString() ?? "On Demand",
    priceCad: Number(formData.get("priceCad") ?? 0),
    image: formData.get("image")?.toString() ?? "",
    imageAlt: formData.get("imageAlt")?.toString() ?? "",
    level: formData.get("level")?.toString() ?? "Foundations",
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    updatedAt: ts,
  };

  const existing = await db.select().from(onlineCourses).where(eq(onlineCourses.id, id)).limit(1);
  if (existing[0]) {
    await db.update(onlineCourses).set(payload).where(eq(onlineCourses.id, id));
  } else {
    await db.insert(onlineCourses).values({ id, ...payload });
  }

  revalidateAll();
}

export async function deleteCourseAction(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(onlineCourses).where(eq(onlineCourses.id, id));
  revalidateAll();
}

export async function upsertWorkshopAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const id = formData.get("id")?.toString() || createId();
  const ts = nowIso();
  const payload = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    dateLabel: formData.get("dateLabel")?.toString() ?? "",
    duration: formData.get("duration")?.toString() ?? "",
    badge: formData.get("badge")?.toString() ?? "Scheduled Live",
    priceCad: Number(formData.get("priceCad") ?? 0),
    seatsTotal: Number(formData.get("seatsTotal") ?? 20),
    image: formData.get("image")?.toString() ?? "",
    imageAlt: formData.get("imageAlt")?.toString() ?? "",
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    updatedAt: ts,
  };

  const existing = await db.select().from(workshops).where(eq(workshops.id, id)).limit(1);
  if (existing[0]) {
    await db.update(workshops).set(payload).where(eq(workshops.id, id));
  } else {
    await db.insert(workshops).values({ id, seatsBooked: 0, ...payload });
  }

  revalidateAll();
}

export async function deleteWorkshopAction(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(workshops).where(eq(workshops.id, id));
  revalidateAll();
}

export async function upsertArticleAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const id = formData.get("id")?.toString() || createId();
  const ts = nowIso();
  const payload = {
    slug: formData.get("slug")?.toString() ?? createId(),
    title: formData.get("title")?.toString() ?? "",
    excerpt: formData.get("excerpt")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "Insights",
    image: formData.get("image")?.toString() ?? "",
    imageAlt: formData.get("imageAlt")?.toString() ?? "",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    updatedAt: ts,
  };

  const existing = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (existing[0]) {
    await db.update(articles).set(payload).where(eq(articles.id, id));
  } else {
    await db.insert(articles).values({ id, ...payload });
  }

  revalidateAll();
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(articles).where(eq(articles.id, id));
  revalidateAll();
}

export async function updatePageSectionAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const id = formData.get("id")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "{}";
  const ts = nowIso();

  await db.update(pageSections).set({ content, updatedAt: ts }).where(eq(pageSections.id, id));
  revalidateAll();
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdmin();
  const db = await getDb();
  await db
    .update(orders)
    .set({ status: status as "pending" | "paid" | "cancelled" | "refunded" | "completed", updatedAt: nowIso() })
    .where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
}

export async function updateAdminProfileAction(formData: FormData) {
  const session = await requireUser();
  const db = await getDb();
  const ts = nowIso();
  const name = formData.get("name")?.toString() ?? session.user.name;
  const phone = formData.get("phone")?.toString() ?? "";

  await db
    .update(users)
    .set({ name, phone, updatedAt: ts })
    .where(eq(users.id, session.user.id));

  revalidatePath("/admin/profile");
}

export async function updateAdminPasswordAction(formData: FormData) {
  const session = await requireUser();
  const db = await getDb();
  const current = formData.get("currentPassword")?.toString() ?? "";
  const next = formData.get("newPassword")?.toString() ?? "";

  const rows = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const user = rows[0];
  if (!user?.passwordHash) {
    throw new Error("Password login is not enabled for this account.");
  }

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) {
    throw new Error("Current password is incorrect.");
  }

  await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(next, 12), updatedAt: nowIso() })
    .where(eq(users.id, session.user.id));
}

export async function registerUserAction(formData: FormData) {
  const db = await getDb();
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !name || password.length < 8) {
    return { ok: false, error: "Please provide name, email, and a password of at least 8 characters." };
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const ts = nowIso();
  await db.insert(users).values({
    id: createId(),
    email,
    name,
    passwordHash: await bcrypt.hash(password, 12),
    role: "user",
    createdAt: ts,
    updatedAt: ts,
  });

  return { ok: true };
}

export async function createDemoOrderAction(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const ts = nowIso();
  const orderId = createId();
  const userId = formData.get("userId")?.toString() ?? "";
  const title = formData.get("title")?.toString() ?? "Healing session";
  const total = Number(formData.get("totalCad") ?? 0);

  await db.insert(orders).values({
    id: orderId,
    userId,
    status: "pending",
    totalCad: total,
    customerName: formData.get("customerName")?.toString() ?? "",
    customerEmail: formData.get("customerEmail")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
    createdAt: ts,
    updatedAt: ts,
  });

  await db.insert(orderItems).values({
    id: createId(),
    orderId,
    itemType: "course",
    itemId: formData.get("itemId")?.toString() ?? "custom",
    title,
    quantity: 1,
    unitPriceCad: total,
  });

  revalidatePath("/admin/orders");
}
