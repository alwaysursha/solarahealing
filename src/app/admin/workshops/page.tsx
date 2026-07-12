import { AdminShell } from "@/components/admin/AdminShell";
import { AdminWorkshopsManager } from "@/components/admin/catalog/AdminWorkshopsManager";

export const dynamic = "force-dynamic";

export default function AdminWorkshopsPage() {
  return (
    <AdminShell
      activePath="/admin/workshops"
      title="Workshops"
      description="Schedule live sessions with limited seats. Spot purchases go through Stripe checkout and appear in Orders."
    >
      <AdminWorkshopsManager />
    </AdminShell>
  );
}
