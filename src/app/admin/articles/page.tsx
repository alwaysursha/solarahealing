import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogManager } from "@/components/admin/blog/AdminBlogManager";

export const dynamic = "force-dynamic";

export default function AdminArticlesPage() {
  return (
    <AdminShell
      activePath="/admin/articles"
      title="Articles"
      description="Create and publish healing insights for the homepage and articles library."
    >
      <AdminBlogManager />
    </AdminShell>
  );
}
