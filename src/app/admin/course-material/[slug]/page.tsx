import { notFound } from "next/navigation";
import { CourseMaterialPresenter } from "@/components/admin/course-material/CourseMaterialPresenter";
import { getCourseMaterialDeck } from "@/lib/admin/course-material";

export const dynamic = "force-dynamic";

export default async function AdminCourseMaterialPresentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deck = getCourseMaterialDeck(slug);
  if (!deck) notFound();

  return <CourseMaterialPresenter deck={deck} />;
}
