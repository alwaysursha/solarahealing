import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { AdminPanel, AdminShell } from "@/components/admin/AdminShell";
import { getAllCustomers } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <AdminShell
      activePath="/admin/customers"
      title="Customers"
      description="View registered members, contact details, and account activity."
    >
      <AdminPanel title="Customer directory">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-purple-deep/10 text-xs uppercase tracking-[0.16em] text-purple-deep/45">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-purple-deep/5">
                  <td className="px-3 py-3 font-medium">{customer.name}</td>
                  <td className="px-3 py-3">{customer.email}</td>
                  <td className="px-3 py-3">{customer.phone ?? "—"}</td>
                  <td className="px-3 py-3 text-purple-deep/55">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 ? (
            <p className="py-8 text-center text-sm text-purple-deep/55">No customer accounts yet.</p>
          ) : null}
        </div>
      </AdminPanel>

      <AdminPanel title="Promote user to admin">
        <p className="text-sm text-purple-deep/60">
          To promote a trusted account, update their role to admin directly in the database for now.
        </p>
        <p className="mt-2 text-xs text-purple-deep/45">
          Admins: {(
            await db.select().from(users).where(eq(users.role, "admin"))
          ).map((u) => u.email).join(", ") || "None"}
        </p>
      </AdminPanel>
    </AdminShell>
  );
}
