import { OrderItemType, OrderStatus } from "@prisma/client";
import Link from "next/link";
import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { AdminSubmit } from "@/components/admin/AdminSubmit";
import { GenerateInvoiceButton } from "@/components/admin/orders/InvoiceActions";
import { updateOrderStatusAction } from "@/lib/admin/actions";
import { formatCad } from "@/lib/admin/catalog-stats";

type OrderItemRow = {
  id: string;
  itemType: OrderItemType;
  itemId: string;
  title: string;
  quantity: number;
  unitPriceCad: number;
};

type OrderRow = {
  id: string;
  status: OrderStatus;
  totalCad: number;
  customerName: string;
  customerEmail: string;
  notes: string | null;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  items: OrderItemRow[];
  user: {
    id: string;
    name: string;
    email: string;
    whatsapp: string | null;
  };
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
] as const;

function statusToSelectValue(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "pending";
    case OrderStatus.PAID:
      return "paid";
    case OrderStatus.COMPLETED:
      return "completed";
    case OrderStatus.CANCELLED:
      return "cancelled";
    case OrderStatus.REFUNDED:
      return "refunded";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.PAID:
      return "Paid";
    case OrderStatus.COMPLETED:
      return "Completed";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    case OrderStatus.REFUNDED:
      return "Refunded";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function statusTone(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "pending";
    case OrderStatus.PAID:
      return "paid";
    case OrderStatus.COMPLETED:
      return "completed";
    case OrderStatus.CANCELLED:
      return "cancelled";
    case OrderStatus.REFUNDED:
      return "refunded";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function itemTypeLabel(type: OrderItemType): string {
  switch (type) {
    case OrderItemType.COURSE:
      return "Course";
    case OrderItemType.WORKSHOP:
      return "Workshop";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

function whatsappFromOrder(order: OrderRow): string | null {
  if (order.user.whatsapp) {
    return `+${order.user.whatsapp}`;
  }
  const match = order.notes?.match(/WhatsApp:\s*(\+?\d+)/i);
  return match?.[1] ?? null;
}

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function updateStatusFormAction(formData: FormData) {
  "use server";
  await updateOrderStatusAction(
    formData.get("orderId")?.toString() ?? "",
    formData.get("status")?.toString() ?? "pending",
  );
}

export function AdminOrdersManager({ orders }: { orders: OrderRow[] }) {
  const paidStatuses = new Set<OrderStatus>([OrderStatus.PAID, OrderStatus.COMPLETED]);
  const paidOrders = orders.filter((order) => paidStatuses.has(order.status));
  const pendingOrders = orders.filter((order) => order.status === OrderStatus.PENDING);
  const revenue = paidOrders.reduce((sum, order) => sum + order.totalCad, 0);
  const unitsSold = paidOrders.reduce(
    (sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + item.quantity, 0),
    0,
  );

  return (
    <div className="admin-orders space-y-6">
      <AdminCatalogHero
        eyebrow="Commerce"
        title="Orders"
        description="Review every checkout — customer contact, line items, Stripe session, and fulfillment status."
        accent="gold"
        stats={[
          {
            label: "Orders",
            value: orders.length,
            detail: `${pendingOrders.length} awaiting payment`,
          },
          {
            label: "Paid",
            value: paidOrders.length,
            detail: `${unitsSold} units sold`,
          },
          {
            label: "Revenue",
            value: revenue,
            detail: "Paid + completed totals",
          },
          {
            label: "Pending value",
            value: formatCad(pendingOrders.reduce((sum, order) => sum + order.totalCad, 0)),
            detail: "Open Stripe checkouts",
          },
        ]}
      />

      {orders.length === 0 ? (
        <section className="admin-orders-empty rounded-[1.4rem] p-8 text-center sm:p-10">
          <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
            Quiet queue
          </p>
          <h3 className="admin-catalog-card-title mt-2 font-serif text-[1.7rem]">No orders yet</h3>
          <p className="admin-catalog-copy mx-auto mt-2 max-w-md text-sm leading-relaxed">
            When a customer completes Stripe Checkout, the order appears here with line items and
            payment status.
          </p>
        </section>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const whatsapp = whatsappFromOrder(order);
            const tone = statusTone(order.status);
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <details key={order.id} className="admin-order-card admin-order-accordion relative overflow-hidden rounded-[1.4rem]">
                <summary className="admin-order-summary relative z-[1]">
                  <div className="admin-order-card-glow pointer-events-none absolute inset-0" aria-hidden />
                  <div className="relative z-[1] flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`admin-order-status admin-order-status-${tone}`}>
                          {statusLabel(order.status)}
                        </span>
                        <span className="admin-order-meta-chip">
                          {formatOrderDate(order.createdAt)}
                        </span>
                        <span className="admin-order-meta-chip">
                          {itemCount} item{itemCount === 1 ? "" : "s"}
                        </span>
                      </div>
                      <h3 className="admin-catalog-card-title mt-2.5 font-serif text-[1.35rem] leading-tight sm:text-[1.5rem]">
                        <Link href={`/admin/customers/${order.user.id}`} className="admin-customers-name-link">
                          {order.customerName}
                        </Link>
                      </h3>
                      <p className="admin-catalog-copy mt-1 truncate text-sm">{order.customerEmail}</p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="admin-catalog-stat-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                        Total
                      </p>
                      <p className="admin-catalog-stat-value mt-1 font-serif text-[1.7rem] leading-none tracking-[-0.03em]">
                        {formatCad(order.totalCad)}
                      </p>
                    </div>

                    <span className="admin-order-chevron" aria-hidden />
                  </div>
                </summary>

                <div className="admin-order-panel relative z-[1] border-t border-[var(--admin-border-soft)] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 sm:hidden">
                    <p className="admin-catalog-stat-label text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
                      Order total
                    </p>
                    <p className="admin-catalog-stat-value font-serif text-[1.7rem] leading-none">
                      {formatCad(order.totalCad)}
                    </p>
                  </div>

                  <div className="admin-order-details mt-1 grid gap-3 sm:mt-0 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="admin-order-detail">
                      <p className="admin-order-detail-label">WhatsApp</p>
                      <p className="admin-order-detail-value">{whatsapp ?? "—"}</p>
                    </div>
                    <div className="admin-order-detail">
                      <p className="admin-order-detail-label">Order ID</p>
                      <p className="admin-order-detail-value admin-order-detail-mono">{order.id}</p>
                    </div>
                    <div className="admin-order-detail sm:col-span-2">
                      <p className="admin-order-detail-label">Stripe session</p>
                      <p className="admin-order-detail-value admin-order-detail-mono">
                        {order.stripeCheckoutSessionId ?? "Not started"}
                      </p>
                    </div>
                  </div>

                  <div className="admin-order-items mt-5">
                    <div className="admin-order-items-head">
                      <p className="admin-order-detail-label">Line items</p>
                    </div>
                    <ul className="admin-order-item-list">
                      {order.items.map((item) => (
                        <li key={item.id} className="admin-order-item">
                          <div className="min-w-0">
                            <p className="admin-order-item-type">{itemTypeLabel(item.itemType)}</p>
                            <p className="admin-order-item-title">{item.title}</p>
                            <p className="admin-order-item-id">{item.itemId}</p>
                          </div>
                          <div className="admin-order-item-pricing">
                            <p>
                              {item.quantity} × {formatCad(item.unitPriceCad)}
                            </p>
                            <p className="admin-order-item-line-total">
                              {formatCad(item.unitPriceCad * item.quantity)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.notes ? (
                    <p className="admin-order-notes mt-4 text-sm leading-relaxed">{order.notes}</p>
                  ) : null}

                  <form action={updateStatusFormAction} className="admin-order-status-form mt-5">
                    <input type="hidden" name="orderId" value={order.id} />
                    <label className="admin-order-status-label">
                      <span>Update status</span>
                      <select
                        name="status"
                        defaultValue={statusToSelectValue(order.status)}
                        className="admin-order-status-select"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <AdminSubmit label="Update order" />
                    <GenerateInvoiceButton orderId={order.id} />
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
