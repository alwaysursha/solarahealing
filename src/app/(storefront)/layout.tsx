import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import {
  getPublishedArticles,
  getPublishedCourseById,
  getPublishedCourses,
  getPublishedPrivateSessions,
} from "@/lib/content";
import type { BlogMenuPost } from "@/lib/blog-nav";
import type { CoursesMenuCourse } from "@/lib/courses-nav";
import { REIKI_INTRO_COURSE_ID, type ReikiMenuCourse } from "@/lib/reiki-nav";
import { type SessionsMenuItem } from "@/lib/sessions-nav";
import { getSiteSettings } from "@/lib/site-settings";
import {
  articlesFeatured,
  articlesList,
  articlesSecondary,
  onlineCourses,
  privateSessions,
} from "@/lib/site";

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

function toCoursesMenuItem(course: {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  priceCad: number;
  category: string;
  duration?: string;
}): CoursesMenuCourse {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    href: `/courses/${course.slug || course.id}`,
    image: course.image,
    imageAlt: course.imageAlt,
    priceCad: course.priceCad,
    category: course.category === "NON_REIKI" ? "NON_REIKI" : "REIKI",
    duration: course.duration,
  };
}

function fallbackCoursesMenu(): CoursesMenuCourse[] {
  return onlineCourses.map((course) =>
    toCoursesMenuItem({
      id: course.id,
      slug: course.id,
      title: course.title,
      description: course.description,
      image: course.image,
      imageAlt: course.imageAlt,
      priceCad: course.priceCad,
      category: course.category,
      duration: course.duration,
    }),
  );
}

function toSessionsMenuItem(session: {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  priceCad: number;
  duration: string;
}): SessionsMenuItem {
  return {
    id: session.id,
    slug: session.slug,
    title: session.title,
    description: session.description,
    href: `/sessions/${session.slug || session.id}`,
    image: session.image,
    imageAlt: session.imageAlt,
    priceCad: session.priceCad,
    duration: session.duration,
  };
}

function fallbackSessionsMenu(): SessionsMenuItem[] {
  return privateSessions.map((session) =>
    toSessionsMenuItem({
      id: session.id,
      slug: session.id,
      title: session.title,
      description: session.description,
      image: session.image,
      imageAlt: session.imageAlt,
      priceCad: session.priceCad,
      duration: session.duration,
    }),
  );
}

function toBlogMenuItem(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  category: string;
  featured?: boolean;
}): BlogMenuPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    href: `/articles/${post.slug}`,
    image: post.image,
    imageAlt: post.imageAlt,
    category: post.category,
    featured: Boolean(post.featured),
  };
}

function fallbackBlogMenu(): BlogMenuPost[] {
  const featured = toBlogMenuItem({
    id: articlesFeatured.slug,
    slug: articlesFeatured.slug,
    title: articlesFeatured.title,
    excerpt: articlesFeatured.excerpt,
    image: articlesFeatured.image,
    imageAlt: articlesFeatured.imageAlt,
    category: articlesFeatured.category,
    featured: true,
  });

  const secondary = articlesSecondary.map((post) =>
    toBlogMenuItem({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      imageAlt: post.imageAlt,
      category: post.category,
      featured: false,
    }),
  );

  const list = articlesList.map((post) =>
    toBlogMenuItem({
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.description,
      image: post.image,
      imageAlt: post.imageAlt,
      category: "Journal",
      featured: false,
    }),
  );

  return [featured, ...secondary, ...list];
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, introCourse, publishedCourses, publishedSessions, publishedArticles] =
    await Promise.all([
      getSiteSettings(),
      getPublishedCourseById(REIKI_INTRO_COURSE_ID),
      getPublishedCourses(),
      getPublishedPrivateSessions(),
      getPublishedArticles(),
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

  const coursesMenu =
    publishedCourses.length > 0
      ? publishedCourses.map((course) => toCoursesMenuItem(course))
      : fallbackCoursesMenu();

  const sessionsMenu =
    publishedSessions.length > 0
      ? publishedSessions.map((session) => toSessionsMenuItem(session))
      : fallbackSessionsMenu();

  const blogMenu =
    publishedArticles.length > 0
      ? publishedArticles.map((article) =>
          toBlogMenuItem({
            id: article.id,
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            image: article.image,
            imageAlt: article.imageAlt,
            category: article.category,
            featured: article.featured,
          }),
        )
      : fallbackBlogMenu();

  return (
    <StorefrontShell
      whatsapp={settings.contact.whatsapp}
      name={settings.name}
      nav={settings.nav}
      cta={settings.cta}
      sanskrit={settings.sanskrit}
      reikiMenuCourse={reikiMenuCourse}
      coursesMenu={coursesMenu}
      sessionsMenu={sessionsMenu}
      blogMenu={blogMenu}
    >
      {children}
    </StorefrontShell>
  );
}
