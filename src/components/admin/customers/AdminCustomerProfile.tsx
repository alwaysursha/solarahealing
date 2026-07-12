import Link from "next/link";
import { OrderItemType, OrderStatus } from "@prisma/client";
import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { GenerateInvoiceButton } from "@/components/admin/orders/InvoiceActions";
import { formatCad } from "@/lib/admin/catalog-stats";

type CustomerOrderItem = {
  id: string;
  title: string;
  itemType: OrderItemType;
  quantity: number;
  unitPriceCad: number;
};

type CustomerOrder = {
  id: string;
  status: OrderStatus;
  totalCad: number;
  createdAt: Date;
  stripeCheckoutSessionId: string | null;
  notes: string | null;
  items: CustomerOrderItem[];
};

type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  orders: CustomerOrder[];
};

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

function formatDate(date: Date, withTime = false) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" as const } : {}),
  }).format(date);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminCustomerProfile({ customer }: { customer: CustomerProfile }) {
  const paidStatuses = new Set<OrderStatus>([OrderStatus.PAID, OrderStatus.COMPLETED]);
  const paidOrders = customer.orders.filter((order) => paidStatuses.has(order.status));
  const spend = paidOrders.reduce((sum, order) => sum + order.totalCad, 0);
  const units = paidOrders.reduce(
    (sum, order) => sum + order.items.reduce((line, item) => line + item.quantity, 0),
    0,
  );

  return (
    <div className="admin-customer-profile space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/customers" className="admin-customer-back">
          <span aria-hidden>←</span>
          Back to customers
        </Link>
      </div>

      <AdminCatalogHero
        eyebrow="Customer profile"
        title={customer.name}
        description="Contact details, account timeline, and complete past order history for this member."
        accent="purple"
        stats={[
          {
            label: "Orders",
            value: customer.orders.length,
            detail: `${paidOrders.length} paid`,
          },
          {
            label: "Lifetime spend",
            value: formatCad(spend),
            detail: "Paid + completed",
          },
          {
            label: "Units bought",
            value: units,
            detail: "Courses & workshop seats",
          },
          {
            label: "Member since",
            value: formatDate(customer.createdAt),
            detail: "Account created",
          },
        ]}
      />

      <div className="admin-customer-layout grid gap-5 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
        <aside className="admin-customer-card rounded-[1.4rem] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="admin-customer-avatar" aria-hidden>
              {initials(customer.name) || "S"}
            </div>
            <div className="min-w-0">
              <p className="admin-catalog-eyebrow text-[0.58rem] font-semibold uppercase tracking-[0.22em]">
                Member
              </p>
              <h3 className="admin-catalog-card-title mt-1 font-serif text-[1.45rem] leading-tight">
                {customer.name}
              </h3>
            </div>
          </div>

          <dl className="admin-customer-meta mt-5">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${customer.email}`}>{customer.email}</a>
              </dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>
                {customer.whatsapp ? (
                  <a
                    href={`https://wa.me/${customer.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +{customer.whatsapp}
                  </a>
                ) : (
                  "Not saved"
                )}
              </dd>
            </div>
            <div>
              <dt>Customer ID</dt>
              <dd className="admin-customer-mono">{customer.id}</dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>{formatDate(customer.createdAt, true)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDate(customer.updatedAt, true)}</dd>
            </div>
          </dl>
        </aside>

        <section className="admin-customer-card rounded-[1.4rem] p-5 sm:p-6">
          <div className="mb-5">
            <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
              History
            </p>
            <h3 className="admin-catalog-card-title mt-1 font-serif text-[1.6rem]">Past orders</h3>
            <p className="admin-catalog-copy mt-2 text-sm">
              Every checkout this customer has started or completed.
            </p>
          </div>

          {customer.orders.length === 0 ? (
            <div className="admin-customer-empty rounded-[1.1rem] p-6 text-center">
              <p className="admin-catalog-copy text-sm">No orders yet for this customer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {customer.orders.map((order) => (
                <details key={order.id} className="admin-customer-order rounded-[1.15rem]">
                  <summary className="admin-customer-order-summary">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`admin-order-status admin-order-status-${statusTone(order.status)}`}>
                          {statusLabel(order.status)}
                        </span>
                        <span className="admin-order-meta-chip">{formatDate(order.createdAt)}</span>
                      </div>
                      <p className="admin-customer-order-titles mt-2">
                        {order.items.map((item) => item.title).join(" · ") || "No line items"}
                      </p>
                    </div>
                    <p className="admin-customer-order-total">{formatCad(order.totalCad)}</p>
                    <span className="admin-order-chevron" aria-hidden />
                  </summary>

                  <div className="admin-customer-order-panel">
                    <div className="admin-order-details grid gap-3 sm:grid-cols-2">
                      <div className="admin-order-detail">
                        <p className="admin-order-detail-label">Order ID</p>
                        <p className="admin-order-detail-value admin-order-detail-mono">{order.id}</p>
                      </div>
                      <div className="admin-order-detail">
                        <p className="admin-order-detail-label">Stripe session</p>
                        <p className="admin-order-detail-value admin-order-detail-mono">
                          {order.stripeCheckoutSessionId ?? "Not started"}
                        </p>
                      </div>
                    </div>

                    <ul className="admin-order-item-list mt-4">
                      {order.items.map((item) => (
                        <li key={item.id} className="admin-order-item">
                          <div className="min-w-0">
                            <p className="admin-order-item-type">{itemTypeLabel(item.itemType)}</p>
                            <p className="admin-order-item-title">{item.title}</p>
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

                    {order.notes ? (
                      <p className="admin-order-notes mt-4 text-sm leading-relaxed">{order.notes}</p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <GenerateInvoiceButton orderId={order.id} />
                      <Link href="/admin/orders" className="admin-customer-order-link">
                        Open in Orders
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
