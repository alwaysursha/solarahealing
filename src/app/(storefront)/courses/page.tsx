import { CatalogIndexView } from "@/components/catalog/CatalogIndexView";
import { getCoursesIntro, getPublishedCourses } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function CoursesIndexPage() {
  const [courses, intro] = await Promise.all([getPublishedCourses(), getCoursesIntro()]);

  return (
    <CatalogIndexView
      type="course"
      items={courses}
      eyebrow={intro.eyebrow}
      title={intro.title}
      titleAccent={intro.titleAccent}
      description={intro.description}
    />
  );
}
