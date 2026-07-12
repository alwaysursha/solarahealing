import { notFound } from "next/navigation";
import { CatalogDetailView } from "@/components/catalog/CatalogDetailView";
import { getPublishedCourseById } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getPublishedCourseById(id);
  if (!course) {
    notFound();
  }

  return <CatalogDetailView type="course" item={course} />;
}
