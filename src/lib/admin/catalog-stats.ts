import { OrderItemType, OrderStatus, type OnlineCourse, type Workshop } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const PAID_STATUSES = new Set<OrderStatus>([OrderStatus.PAID, OrderStatus.COMPLETED]);

export function formatCad(cents: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(cents);
}

type OrderItemWithStatus = {
  itemId: string;
  quantity: number;
  unitPriceCad: number;
  order: { status: OrderStatus };
};

function summarizeOrderItems(items: OrderItemWithStatus[]) {
  const paid = items.filter((item) => PAID_STATUSES.has(item.order.status));
  const pending = items.filter((item) => item.order.status === OrderStatus.PENDING);

  return {
    paidOrders: new Set(paid.map((item) => item.itemId)).size,
    paidUnits: paid.reduce((sum, item) => sum + item.quantity, 0),
    pendingUnits: pending.reduce((sum, item) => sum + item.quantity, 0),
    revenueCad: paid.reduce((sum, item) => sum + item.unitPriceCad * item.quantity, 0),
  };
}

function countByItemId(items: OrderItemWithStatus[]) {
  const counts = new Map<string, { sold: number; revenueCad: number }>();

  for (const item of items) {
    if (!PAID_STATUSES.has(item.order.status)) continue;
    const current = counts.get(item.itemId) ?? { sold: 0, revenueCad: 0 };
    current.sold += item.quantity;
    current.revenueCad += item.unitPriceCad * item.quantity;
    counts.set(item.itemId, current);
  }

  return counts;
}

export type CourseWithSales = OnlineCourse & {
  sold: number;
  revenueCad: number;
};

export type WorkshopWithSales = Workshop & {
  sold: number;
  revenueCad: number;
  seatsRemaining: number;
  fillPercent: number;
};

export async function getCourseAdminOverview() {
  const [courses, orderItems] = await Promise.all([
    prisma.onlineCourse.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
    prisma.orderItem.findMany({
      where: { itemType: OrderItemType.COURSE },
      include: { order: { select: { status: true } } },
    }),
  ]);

  const summary = summarizeOrderItems(orderItems);
  const salesByCourse = countByItemId(orderItems);
  const published = courses.filter((course) => course.published).length;

  const coursesWithSales: CourseWithSales[] = courses.map((course) => {
    const sales = salesByCourse.get(course.id) ?? { sold: 0, revenueCad: 0 };
    return { ...course, sold: sales.sold, revenueCad: sales.revenueCad };
  });

  return {
    courses: coursesWithSales,
    stats: {
      total: courses.length,
      published,
      draft: courses.length - published,
      revenueCad: summary.revenueCad,
      unitsSold: summary.paidUnits,
      pendingUnits: summary.pendingUnits,
    },
  };
}

export async function getWorkshopAdminOverview() {
  const [workshops, orderItems] = await Promise.all([
    prisma.workshop.findMany({ orderBy: { scheduledAt: "asc" } }),
    prisma.orderItem.findMany({
      where: { itemType: OrderItemType.WORKSHOP },
      include: { order: { select: { status: true } } },
    }),
  ]);

  const summary = summarizeOrderItems(orderItems);
  const salesByWorkshop = countByItemId(orderItems);
  const published = workshops.filter((workshop) => workshop.published).length;
  const seatsTotal = workshops.reduce((sum, workshop) => sum + workshop.seatsTotal, 0);
  const seatsBooked = workshops.reduce((sum, workshop) => sum + workshop.seatsBooked, 0);

  const workshopsWithSales: WorkshopWithSales[] = workshops.map((workshop) => {
    const sales = salesByWorkshop.get(workshop.id) ?? { sold: 0, revenueCad: 0 };
    const seatsRemaining = Math.max(workshop.seatsTotal - workshop.seatsBooked, 0);
    const fillPercent =
      workshop.seatsTotal > 0 ? Math.min(100, Math.round((workshop.seatsBooked / workshop.seatsTotal) * 100)) : 0;

    return {
      ...workshop,
      sold: sales.sold,
      revenueCad: sales.revenueCad,
      seatsRemaining,
      fillPercent,
    };
  });

  return {
    workshops: workshopsWithSales,
    stats: {
      total: workshops.length,
      published,
      draft: workshops.length - published,
      seatsTotal,
      seatsBooked,
      seatsRemaining: Math.max(seatsTotal - seatsBooked, 0),
      revenueCad: summary.revenueCad,
      spotsSold: summary.paidUnits,
      pendingSpots: summary.pendingUnits,
    },
  };
}
