import { AdminShell } from "@/components/admin/AdminShell";
import { AdminOrdersManager } from "@/components/admin/orders/AdminOrdersManager";
import { getAllOrders } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <AdminShell
      activePath="/admin/orders"
      title="Order Management"
      description="Track purchases, Stripe sessions, customer WhatsApp, and fulfillment status."
    >
      <AdminOrdersManager orders={orders} />
    </AdminShell>
  );
}
