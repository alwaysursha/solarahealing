import Link from "next/link";
import { Role } from "@prisma/client";
import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { AdminPanel, AdminShell } from "@/components/admin/AdminShell";
import { formatCad } from "@/lib/admin/catalog-stats";
import { getAllCustomers } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();
  const admins = await prisma.user.findMany({ where: { role: Role.ADMIN } });
  const withWhatsApp = customers.filter((customer) => Boolean(customer.whatsapp)).length;
  const lifetimeSpend = customers.reduce(
    (sum, customer) => sum + customer.orders.reduce((orderSum, order) => orderSum + order.totalCad, 0),
    0,
  );

  return (
    <AdminShell
      activePath="/admin/customers"
      title="Customers"
      description="View registered members, contact details, and account activity."
    >
      <div className="space-y-6">
        <AdminCatalogHero
          eyebrow="Community"
          title="Customers"
          description="Open any member to see their full profile, WhatsApp details, and past order history."
          accent="purple"
          stats={[
            {
              label: "Members",
              value: customers.length,
              detail: `${withWhatsApp} with WhatsApp`,
            },
            {
              label: "Lifetime spend",
              value: formatCad(lifetimeSpend),
              detail: "Paid purchases across members",
            },
            {
              label: "Admins",
              value: admins.length,
              detail: "Staff accounts",
            },
          ]}
        />

        <section className="admin-customer-card rounded-[1.4rem] p-5 sm:p-6">
          <div className="mb-5">
            <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
              Directory
            </p>
            <h3 className="admin-catalog-card-title mt-1 font-serif text-[1.6rem]">All customers</h3>
          </div>

          <div className="admin-table-scroll -mx-1 overflow-x-auto px-1">
            <table className="admin-customers-table min-w-[42rem] w-full text-left text-sm sm:min-w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>WhatsApp</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th>
                    <span className="sr-only">Profile</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="font-medium">
                      <Link href={`/admin/customers/${customer.id}`} className="admin-customers-name-link">
                        {customer.name}
                      </Link>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.whatsapp ? `+${customer.whatsapp}` : "—"}</td>
                    <td>{customer._count.orders}</td>
                    <td className="admin-customers-muted">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <Link href={`/admin/customers/${customer.id}`} className="admin-customers-link">
                        View profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 ? (
              <p className="py-8 text-center text-sm text-purple-deep/55">No customer accounts yet.</p>
            ) : null}
          </div>
        </section>

        <AdminPanel title="Promote user to admin">
          <p className="text-sm text-purple-deep/60">
            To promote a trusted account, update their role to admin directly in the database for now.
          </p>
          <p className="mt-2 text-xs text-purple-deep/45">
            Admins: {admins.map((u) => u.email).join(", ") || "None"}
          </p>
          {lifetimeSpend > 0 ? (
            <p className="mt-3 text-xs text-purple-deep/45">
              Member lifetime spend tracked: {formatCad(lifetimeSpend)}
            </p>
          ) : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
