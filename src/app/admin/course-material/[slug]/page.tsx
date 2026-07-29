import { notFound } from "next/navigation";
import { CourseMaterialPresenterClient } from "@/components/admin/course-material/CourseMaterialPresenterClient";
import { getCourseMaterialDeck } from "@/lib/admin/course-material";
import { hydrateCourseMaterialDeck } from "@/lib/admin/hydrate-course-material-pricing";

export const dynamic = "force-dynamic";

export default async function AdminCourseMaterialPresentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deck = getCourseMaterialDeck(slug);
  if (!deck) notFound();

  const hydrated = await hydrateCourseMaterialDeck(deck);
  return <CourseMaterialPresenterClient deck={hydrated} />;
}
