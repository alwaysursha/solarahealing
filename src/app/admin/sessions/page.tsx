import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSessionsManager } from "@/components/admin/catalog/AdminSessionsManager";

export const dynamic = "force-dynamic";

export default function AdminSessionsPage() {
  return (
    <AdminShell
      activePath="/admin/sessions"
      title="Private sessions"
      description="Manage one-to-one session offerings sold through Stripe checkout. Scheduling happens after purchase."
    >
      <AdminSessionsManager />
    </AdminShell>
  );
}
