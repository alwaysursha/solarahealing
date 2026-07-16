export type CoursesMenuCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  priceCad: number;
  category: "REIKI" | "NON_REIKI";
  duration?: string;
};

export const COURSES_NAV_LIMIT_PER_GROUP = 3;

export function isCoursesNavItem(item: { label: string; href: string }) {
  const label = item.label.trim().toUpperCase();
  const href = item.href.trim().toLowerCase();
  return label === "COURSES" || href === "/courses" || href.startsWith("/courses#");
}

export function pickCoursesForNav(courses: CoursesMenuCourse[]) {
  const reiki = courses
    .filter((course) => course.category === "REIKI")
    .slice(0, COURSES_NAV_LIMIT_PER_GROUP);
  const nonReiki = courses
    .filter((course) => course.category === "NON_REIKI")
    .slice(0, COURSES_NAV_LIMIT_PER_GROUP);

  return { reiki, nonReiki };
}
