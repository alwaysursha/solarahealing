import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import { getPublishedCourseById } from "@/lib/content";
import { REIKI_INTRO_COURSE_ID, type ReikiMenuCourse } from "@/lib/reiki-nav";
import { getSiteSettings } from "@/lib/site-settings";
import { onlineCourses } from "@/lib/site";

export const dynamic = "force-dynamic";

function fallbackIntroCourse(): ReikiMenuCourse {
  const course = onlineCourses.find((item) => item.id === REIKI_INTRO_COURSE_ID) ?? onlineCourses[0];
  return {
    id: course.id,
    slug: course.id,
    title: course.title,
    description: course.description,
    href: `/courses/${course.id}`,
    image: course.image,
    imageAlt: course.imageAlt,
    priceCad: course.priceCad,
  };
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, introCourse] = await Promise.all([
    getSiteSettings(),
    getPublishedCourseById(REIKI_INTRO_COURSE_ID),
  ]);

  const reikiMenuCourse: ReikiMenuCourse | null = introCourse
    ? {
        id: introCourse.id,
        slug: introCourse.slug,
        title: introCourse.title,
        description: introCourse.description,
        href: `/courses/${introCourse.slug ?? introCourse.id}`,
        image: introCourse.image,
        imageAlt: introCourse.imageAlt,
        priceCad: introCourse.priceCad,
      }
    : fallbackIntroCourse();

  return (
    <StorefrontShell
      whatsapp={settings.contact.whatsapp}
      name={settings.name}
      nav={settings.nav}
      cta={settings.cta}
      sanskrit={settings.sanskrit}
      reikiMenuCourse={reikiMenuCourse}
    >
      {children}
    </StorefrontShell>
  );
}
