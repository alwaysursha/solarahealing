"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { OrderItemType, OrderStatus, Role } from "@prisma/client";
import { requireAdmin, requireUser } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createId } from "@/lib/id";
import { parseImageFocusValue } from "@/lib/image-focus";
import {
  formatWorkshopScheduleLabel,
  parseWorkshopScheduleInput,
} from "@/lib/admin/workshop-schedule";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/workshops");
  revalidatePath("/workshops");
  revalidatePath("/blog");
}

export async function updateStorefrontSectionVisibilityAction(
  section: "courses" | "workshops",
  visible: boolean,
) {
  await requireAdmin();

  const data =
    section === "courses"
      ? { showCoursesSection: visible }
      : { showWorkshopsSection: visible };

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: "Soulara Healing",
      tagline: "",
      sanskrit: "",
      sanskritMeaning: "",
      description: "",
      seoTitle: "Soulara Healing",
      metaDescription: "",
      phone: "",
      email: "",
      whatsapp: "",
      address: "",
      cta: "",
      showCoursesSection: section === "courses" ? visible : true,
      showWorkshopsSection: section === "workshops" ? visible : false,
    },
    update: data,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/courses");
  revalidatePath("/admin/workshops");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
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
    },
    update: {
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
    },
  });

  revalidateAll();
}

export async function upsertCourseAction(formData: FormData) {
  await requireAdmin();
  const existingId = formData.get("id")?.toString();
  const id = existingId || createId();

  const data = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    dateLabel: formData.get("dateLabel")?.toString() ?? "Start anytime",
    duration: formData.get("duration")?.toString() ?? "",
    badge: formData.get("badge")?.toString() ?? "On Demand",
    priceCad: Number(formData.get("priceCad") ?? 0),
    image: formData.get("image")?.toString() ?? "",
    imageAlt: formData.get("imageAlt")?.toString() ?? "",
    imageFocusX: parseImageFocusValue(formData.get("imageFocusX")),
    imageFocusY: parseImageFocusValue(formData.get("imageFocusY")),
    level: formData.get("level")?.toString() ?? "Foundations",
    published: formData.get("published") === "on",
  };

  if (existingId) {
    await prisma.onlineCourse.update({
      where: { id },
      data,
    });
  } else {
    const maxOrder = await prisma.onlineCourse.aggregate({ _max: { sortOrder: true } });
    await prisma.onlineCourse.create({
      data: {
        id,
        ...data,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
  }

  revalidateAll();
}

export async function reorderCoursesAction(courseIds: string[]) {
  await requireAdmin();
  if (courseIds.length === 0) return;

  await prisma.$transaction(
    courseIds.map((id, index) =>
      prisma.onlineCourse.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  revalidateAll();
}

export async function deleteCourseAction(id: string) {
  await requireAdmin();
  await prisma.onlineCourse.delete({ where: { id } });
  revalidateAll();
}

export async function deleteCourseFormAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteCourseAction(id);
}

export async function upsertWorkshopAction(formData: FormData) {
  await requireAdmin();
  const existingId = formData.get("id")?.toString();
  const id = existingId || createId();
  const scheduledAt = parseWorkshopScheduleInput(formData.get("scheduledAt")?.toString() ?? "");

  const data = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    scheduledAt,
    dateLabel: formatWorkshopScheduleLabel(scheduledAt),
    duration: formData.get("duration")?.toString() ?? "",
    badge: formData.get("badge")?.toString() ?? "Scheduled Live",
    priceCad: Number(formData.get("priceCad") ?? 0),
    seatsTotal: Number(formData.get("seatsTotal") ?? 20),
    image: formData.get("image")?.toString() ?? "",
    imageAlt: formData.get("imageAlt")?.toString() ?? "",
    imageFocusX: parseImageFocusValue(formData.get("imageFocusX")),
    imageFocusY: parseImageFocusValue(formData.get("imageFocusY")),
    published: formData.get("published") === "on",
  };

  if (existingId) {
    await prisma.workshop.update({
      where: { id },
      data,
    });
  } else {
    await prisma.workshop.create({
      data: { id, ...data },
    });
  }

  revalidateAll();
}

export async function deleteWorkshopAction(id: string) {
  await requireAdmin();
  await prisma.workshop.delete({ where: { id } });
  revalidateAll();
}

export async function deleteWorkshopFormAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteWorkshopAction(id);
}

export async function upsertArticleAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id")?.toString() || createId();

  await prisma.article.upsert({
    where: { id },
    create: {
      id,
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
    },
    update: {
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
    },
  });

  revalidateAll();
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidateAll();
}

export async function deleteArticleFormAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteArticleAction(id);
}

export async function updatePageSectionAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "{}";

  await prisma.pageSection.update({
    where: { id },
    data: { content },
  });

  revalidateAll();
}

const orderStatusMap: Record<string, OrderStatus> = {
  pending: OrderStatus.PENDING,
  paid: OrderStatus.PAID,
  cancelled: OrderStatus.CANCELLED,
  refunded: OrderStatus.REFUNDED,
  completed: OrderStatus.COMPLETED,
};

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdmin();
  const mapped = orderStatusMap[status];
  if (!mapped) {
    throw new Error("Invalid order status");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: mapped },
  });

  revalidatePath("/admin/orders");
}

export async function updateAdminProfileAction(formData: FormData) {
  const session = await requireUser();
  const name = formData.get("name")?.toString() ?? session.user.name;
  const phone = formData.get("phone")?.toString() ?? "";

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone },
  });

  revalidatePath("/admin/profile");
}

export async function updateAdminPasswordAction(formData: FormData) {
  const session = await requireUser();
  const current = formData.get("currentPassword")?.toString() ?? "";
  const next = formData.get("newPassword")?.toString() ?? "";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.password) {
    throw new Error("Password login is not enabled for this account.");
  }

  const valid = await bcrypt.compare(current, user.password);
  if (!valid) {
    throw new Error("Current password is incorrect.");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: await bcrypt.hash(next, 12) },
  });
}

export async function registerUserAction(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !name || password.length < 8) {
    return { ok: false, error: "Please provide name, email, and a password of at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 12),
      role: Role.USER,
    },
  });

  return { ok: true };
}

export async function createDemoOrderAction(formData: FormData) {
  await requireAdmin();
  const orderId = createId();
  const userId = formData.get("userId")?.toString() ?? "";
  const title = formData.get("title")?.toString() ?? "Healing session";
  const total = Number(formData.get("totalCad") ?? 0);

  await prisma.order.create({
    data: {
      id: orderId,
      userId,
      status: OrderStatus.PENDING,
      totalCad: total,
      customerName: formData.get("customerName")?.toString() ?? "",
      customerEmail: formData.get("customerEmail")?.toString() ?? "",
      notes: formData.get("notes")?.toString() ?? "",
      items: {
        create: {
          id: createId(),
          itemType: OrderItemType.COURSE,
          itemId: formData.get("itemId")?.toString() ?? "custom",
          title,
          quantity: 1,
          unitPriceCad: total,
        },
      },
    },
  });

  revalidatePath("/admin/orders");
}

