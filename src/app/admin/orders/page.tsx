import { AdminPanel, AdminShell, AdminSubmit } from "@/components/admin/AdminShell";
import { getAllOrders } from "@/lib/content";
import { updateOrderStatusAction } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

const statuses = ["pending", "paid", "completed", "cancelled", "refunded"] as const;

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <AdminShell
      activePath="/admin/orders"
      title="Order Management"
      description="Track purchases, update payment status, and review order details."
    >
      <AdminPanel title="All orders">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-purple-deep/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-purple-deep">{order.customerName}</p>
                  <p className="text-sm text-purple-deep/60">{order.customerEmail}</p>
                  <p className="mt-1 text-xs text-purple-deep/45">Order {order.id.slice(0, 8)}…</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-purple-deep">${order.totalCad} CAD</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-purple-deep/45">{order.status}</p>
                </div>
              </div>
              {order.notes ? <p className="mt-3 text-sm text-purple-deep/60">{order.notes}</p> : null}
              <form
                action={async (formData) => {
                  "use server";
                  await updateOrderStatusAction(
                    formData.get("orderId")?.toString() ?? "",
                    formData.get("status")?.toString() ?? "pending",
                  );
                }}
                className="mt-4 flex flex-wrap items-end gap-3"
              >
                <input type="hidden" name="orderId" value={order.id} />
                <label className="text-sm">
                  <span className="font-medium text-purple-deep/75">Update status</span>
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="mt-1.5 block rounded-xl border border-purple-deep/10 bg-cream/30 px-3 py-2 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <AdminSubmit label="Update order" />
              </form>
            </div>
          ))}
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-purple-deep/55">
              No orders yet. Checkout integration can create orders here.
            </p>
          ) : null}
        </div>
      </AdminPanel>
    </AdminShell>
  );
}
