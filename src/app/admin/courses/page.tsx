import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCoursesManager } from "@/components/admin/catalog/AdminCoursesManager";

export const dynamic = "force-dynamic";

export default function AdminCoursesPage() {
  return (
    <AdminShell
      activePath="/admin/courses"
      title="Courses"
      description="Manage on-demand programs sold through Stripe checkout. Every purchase lands in Orders."
    >
      <AdminCoursesManager />
    </AdminShell>
  );
}
