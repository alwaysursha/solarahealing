import { OrderStatus, Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountProfileForm } from "@/components/account/AccountProfileForm";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getOrdersForUser } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { formatCad } from "@/lib/site";
import { formatWhatsAppDisplay } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function orderStatusLabel(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.PAID:
      return "Paid";
    case OrderStatus.CANCELLED:
      return "Cancelled";
    case OrderStatus.REFUNDED:
      return "Refunded";
    case OrderStatus.COMPLETED:
      return "Completed";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const [orders, profile] = await Promise.all([
    getOrdersForUser(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, whatsapp: true },
    }),
  ]);

  const name = profile?.name ?? session.user.name;
  const email = profile?.email ?? session.user.email;
  const whatsapp = profile?.whatsapp ?? "";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="account-page">
      <div className="account-page-aura" aria-hidden />
      <div className="account-page-inner">
        <header className="account-hero">
          <p className="account-hero-eyebrow">Soulara Healing Academy</p>
          <h1 className="account-hero-title">Your sanctuary</h1>
          <p className="account-hero-copy">
            Manage your profile, WhatsApp details, and past course or workshop orders in one place.
          </p>
        </header>

        <div className="account-layout">
          <aside className="account-identity">
            <div className="account-identity-glow" aria-hidden />
            <div className="account-identity-top">
              <div className="account-avatar" aria-hidden>
                {initials || "S"}
              </div>
              <div className="min-w-0">
                <p className="account-identity-eyebrow">Signed in as</p>
                <h2 className="account-identity-name">{name}</h2>
                <p className="account-identity-email truncate">{email}</p>
              </div>
            </div>

            <dl className="account-identity-meta">
              <div>
                <dt>Role</dt>
                <dd>{session.user.role === Role.ADMIN ? "Admin" : "Member"}</dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>{whatsapp ? formatWhatsAppDisplay(whatsapp) : "Not saved yet"}</dd>
              </div>
              <div>
                <dt>Orders</dt>
                <dd>
                  {orders.length} {orders.length === 1 ? "purchase" : "purchases"}
                </dd>
              </div>
            </dl>

            <div className="account-identity-actions">
              {session.user.role === Role.ADMIN ? (
                <Link href="/admin" className="account-cta-primary">
                  Open admin dashboard
                </Link>
              ) : (
                <Link href="/courses" className="account-cta-primary">
                  Browse Courses
                </Link>
              )}
              {session.user.role === Role.ADMIN ? (
                <Link href="/courses" className="account-cta-ghost">
                  Browse Courses
                </Link>
              ) : null}
              <SignOutButton className="account-cta-ghost" />
              <Link href="/" className="account-cta-text">
                Back home
                <span aria-hidden>→</span>
              </Link>
            </div>
          </aside>

          <div className="account-main">
            <AccountProfileForm name={name} email={email} whatsapp={whatsapp} />

            <section id="orders" className="account-orders">
              <div className="account-orders-header">
                <div>
                  <p className="account-section-eyebrow">History</p>
                  <h2 className="account-section-title">Past orders</h2>
                </div>
                <p className="account-section-copy">
                  Your course and workshop purchases appear here once checkout is complete.
                </p>
              </div>

              {orders.length > 0 ? (
                <ul className="account-order-list">
                  {orders.map((order) => (
                    <li key={order.id} className="account-order-card">
                      <div className="account-order-top">
                        <div>
                          <p className="account-order-id">Order {order.id.slice(0, 8)}…</p>
                          <p className="account-order-date">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="account-order-total-wrap">
                          <p className="account-order-total">{formatCad(order.totalCad)}</p>
                          <p className="account-order-status">{orderStatusLabel(order.status)}</p>
                        </div>
                      </div>
                      <ul className="account-order-items">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            <span>{item.title}</span>
                            <span aria-hidden>×</span>
                            <span>{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="account-orders-empty">
                  <p className="account-orders-empty-eyebrow">Quiet for now</p>
                  <h3 className="account-orders-empty-title">No orders yet</h3>
                  <p className="account-orders-empty-copy">
                    When you enroll in a course or reserve a workshop seat, your receipts will live
                    here.
                  </p>
                  <Link href="/courses" className="account-cta-primary account-cta-inline">
                    Browse Courses
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
