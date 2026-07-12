import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { OrderItemType, OrderStatus, Role } from "@prisma/client";
import { auth } from "@/auth";
import { InvoiceActions } from "@/components/admin/orders/InvoiceActions";
import { LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH } from "@/components/ui/Logo";
import { formatCad } from "@/lib/admin/catalog-stats";
import { getOrderWithItems } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

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

function formatInvoiceDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function AdminOrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/auth/sign-in?callbackUrl=/admin/orders");
  }

  const { id } = await params;
  const [order, settings] = await Promise.all([getOrderWithItems(id), getSiteSettings()]);

  if (!order) {
    notFound();
  }

  const invoiceNumber = `INV-${order.id.slice(0, 10).toUpperCase()}`;
  const whatsapp = order.user.whatsapp ? `+${order.user.whatsapp}` : null;

  return (
    <div className="invoice-page">
      <InvoiceActions orderId={order.id} />

      <article id="invoice-document" className="invoice-document">
        <header className="invoice-letterhead">
          <div className="invoice-letterhead-glow" aria-hidden />
          <div className="invoice-letterhead-top">
            <div className="invoice-logo-wrap">
              <Image
                src={LOGO_SRC}
                alt={settings.name}
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                className="invoice-logo"
                priority
              />
            </div>
            <div className="invoice-letterhead-brand">
              <p className="invoice-letterhead-eyebrow">Official invoice</p>
              <h1 className="invoice-letterhead-name">{settings.name}</h1>
              <p className="invoice-letterhead-tagline">{settings.tagline}</p>
            </div>
          </div>
          <div className="invoice-letterhead-contact">
            <span>{settings.contact.email}</span>
            <span aria-hidden>·</span>
            <span>{settings.contact.location}</span>
            {settings.contact.whatsapp ? (
              <>
                <span aria-hidden>·</span>
                <span>WhatsApp +{settings.contact.whatsapp.replace(/\D/g, "")}</span>
              </>
            ) : null}
          </div>
        </header>

        <section className="invoice-meta">
          <div>
            <p className="invoice-kicker">Invoice</p>
            <p className="invoice-number">{invoiceNumber}</p>
            <p className="invoice-meta-line">Issued {formatInvoiceDate(order.createdAt)}</p>
            <p className="invoice-meta-line">Status: {statusLabel(order.status)}</p>
          </div>
          <div className="invoice-bill-to">
            <p className="invoice-kicker">Bill to</p>
            <p className="invoice-customer-name">{order.customerName}</p>
            <p className="invoice-meta-line">{order.customerEmail}</p>
            {whatsapp ? <p className="invoice-meta-line">{whatsapp}</p> : null}
          </div>
        </section>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="invoice-item-title">{item.title}</span>
                </td>
                <td>{itemTypeLabel(item.itemType)}</td>
                <td>{item.quantity}</td>
                <td>{formatCad(item.unitPriceCad)}</td>
                <td>{formatCad(item.unitPriceCad * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="invoice-total-row">
            <span>Subtotal</span>
            <strong>{formatCad(order.totalCad)}</strong>
          </div>
          <div className="invoice-total-row invoice-total-due">
            <span>Total</span>
            <strong>{formatCad(order.totalCad)}</strong>
          </div>
          <p className="invoice-currency-note">All amounts in CAD</p>
        </div>

        {order.notes ? (
          <section className="invoice-notes">
            <p className="invoice-kicker">Notes</p>
            <p>{order.notes}</p>
          </section>
        ) : null}

        <footer className="invoice-footer">
          <p>Thank you for choosing Soulara Healing Academy.</p>
          <p>
            This invoice was generated from your order record
            {order.stripeCheckoutSessionId ? " and Stripe payment." : "."}
          </p>
        </footer>
      </article>
    </div>
  );
}
