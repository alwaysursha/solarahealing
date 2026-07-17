import { AdminShell } from "@/components/admin/AdminShell";
import { CourseMaterialList } from "@/components/admin/course-material/CourseMaterialList";

export const dynamic = "force-dynamic";

export default function AdminCourseMaterialPage() {
  return (
    <AdminShell
      activePath="/admin/course-material"
      title="Course Material"
      description="Teaching slideshows for live classes. Present fullscreen — not visible on the public website."
    >
      <CourseMaterialList />
    </AdminShell>
  );
}
