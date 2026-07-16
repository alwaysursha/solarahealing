import { CoursesCatalogView } from "@/components/catalog/CoursesCatalogView";
import {
  getCoursesIntro,
  getPublishedCourses,
  getStorefrontSectionVisibility,
} from "@/lib/content";
import { resolveCoursesIntroDescription } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function CoursesIndexPage() {
  const [courses, intro, visibility] = await Promise.all([
    getPublishedCourses(),
    getCoursesIntro(),
    getStorefrontSectionVisibility(),
  ]);
  const description = resolveCoursesIntroDescription(intro.description, courses.length);

  return (
    <CoursesCatalogView
      items={courses}
      eyebrow={intro.eyebrow}
      title={intro.title}
      titleAccent={intro.titleAccent}
      description={description}
      showWorkshopsCta={visibility.showWorkshopsSection}
    />
  );
}
