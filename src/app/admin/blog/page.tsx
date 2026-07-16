import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogManager } from "@/components/admin/blog/AdminBlogManager";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  return (
    <AdminShell
      activePath="/admin/blog"
      title="Blog & Articles"
      description="Create and publish healing insights for the homepage and blog."
    >
      <AdminBlogManager />
    </AdminShell>
  );
}
