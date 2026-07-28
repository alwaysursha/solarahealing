import { notFound } from "next/navigation";
import { CourseMaterialPresenterClient } from "@/components/admin/course-material/CourseMaterialPresenterClient";
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

  return <CourseMaterialPresenterClient deck={deck} />;
}
