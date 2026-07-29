import { AdminShell } from "@/components/admin/AdminShell";
import { CourseMaterialList } from "@/components/admin/course-material/CourseMaterialList";
import { getCourseMaterialSeriesGroups } from "@/lib/admin/course-material";
import { hydrateCourseMaterialDeck } from "@/lib/admin/hydrate-course-material-pricing";

export const dynamic = "force-dynamic";

export default async function AdminCourseMaterialPage() {
  const groups = await Promise.all(
    getCourseMaterialSeriesGroups().map(async (group) => ({
      ...group,
      decks: await Promise.all(group.decks.map((deck) => hydrateCourseMaterialDeck(deck))),
    })),
  );

  return (
    <AdminShell
      activePath="/admin/course-material"
      title="Course Material"
      description="Teaching slideshows for live classes. Present fullscreen — not visible on the public website."
    >
      <CourseMaterialList groups={groups} />
    </AdminShell>
  );
}
