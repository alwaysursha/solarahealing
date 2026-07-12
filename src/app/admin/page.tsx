import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminStats } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <AdminShell activePath="/admin" title="Dashboard">
      <AdminDashboard
        stats={{
          courses: stats.courses,
          workshops: stats.workshops,
          articles: stats.articles,
          customers: stats.customers,
          paidOrders: stats.paidOrders,
          pendingOrders: stats.pendingOrders,
        }}
      />
    </AdminShell>
  );
}
