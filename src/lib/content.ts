import { OrderStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  aboutContent,
  articlesFeatured,
  articlesIntro,
  articlesList,
  articlesSecondary,
  coursesIntro,
  heroSlides,
  onlineCourses as staticCourses,
  scheduleBooking,
  site,
  testimonials,
  testimonialsIntro,
  workshops as staticWorkshops,
  workshopsIntro,
} from "@/lib/site";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getDbSiteSettings() {
  return safeQuery(
    () => prisma.siteSettings.findUnique({ where: { id: 1 } }),
    null,
  );
}

export async function getSiteSettingsFromDb() {
  const row = await getDbSiteSettings();
  if (!row) {
    return {
      name: SITE_NAME,
      tagline: site.tagline,
      sanskrit: site.sanskrit,
      sanskritMeaning: site.sanskritMeaning,
      description: SITE_DESCRIPTION,
      seoTitle: SITE_NAME,
      metaDescription: SITE_DESCRIPTION,
      phone: site.contact.phone,
      email: site.contact.email,
      whatsapp: site.contact.whatsapp,
      address: site.contact.location,
      cta: site.cta,
      nav: site.nav,
      fetchedAt: new Date().toISOString(),
    };
  }

  return {
    name: row.name,
    tagline: row.tagline,
    sanskrit: row.sanskrit,
    sanskritMeaning: row.sanskritMeaning,
    description: row.description,
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp,
    address: row.address,
    cta: row.cta,
    nav: site.nav,
    fetchedAt: row.updatedAt.toISOString(),
  };
}

export async function getPublishedCourses() {
  const rows = await safeQuery(
    () =>
      prisma.onlineCourse.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  );

  if (rows.length === 0) {
    return staticCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      date: course.date,
      duration: course.duration,
      badge: course.badge,
      priceCad: course.priceCad,
      image: course.image,
      imageAlt: course.imageAlt,
      level: course.level,
    }));
  }

  return rows.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    date: course.dateLabel,
    duration: course.duration,
    badge: course.badge,
    priceCad: course.priceCad,
    image: course.image,
    imageAlt: course.imageAlt,
    level: course.level,
  }));
}

export async function getPublishedWorkshops() {
  const rows = await safeQuery(
    () =>
      prisma.workshop.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  );

  if (rows.length === 0) {
    return [...staticWorkshops];
  }

  return rows.map((workshop) => ({
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    date: workshop.dateLabel,
    duration: workshop.duration,
    badge: workshop.badge,
    priceCad: workshop.priceCad,
    image: workshop.image,
    imageAlt: workshop.imageAlt,
  }));
}

export async function getWorkshopsIntro() {
  const section = await getPageSection("home", "workshopsIntro");
  return section ? (JSON.parse(section.content) as typeof workshopsIntro) : workshopsIntro;
}

export async function getCoursesIntro() {
  const section = await getPageSection("home", "coursesIntro");
  return section ? (JSON.parse(section.content) as typeof coursesIntro) : coursesIntro;
}

export async function getPageSection(pageKey: string, sectionKey: string) {
  return safeQuery(
    () =>
      prisma.pageSection.findUnique({
        where: {
          pageKey_sectionKey: { pageKey, sectionKey },
        },
      }),
    null,
  );
}

export async function getHomePageContent() {
  const sections = await safeQuery(
    () =>
      prisma.pageSection.findMany({
        where: { pageKey: "home" },
      }),
    [],
  );

  const map = new Map(sections.map((s) => [s.sectionKey, JSON.parse(s.content)]));

  return {
    heroSlides: (map.get("hero") as typeof heroSlides | undefined) ?? heroSlides,
    aboutContent: (map.get("about") as typeof aboutContent | undefined) ?? aboutContent,
    coursesIntro: (map.get("coursesIntro") as typeof coursesIntro | undefined) ?? coursesIntro,
    articlesIntro: (map.get("articlesIntro") as typeof articlesIntro | undefined) ?? articlesIntro,
    workshopsIntro: (map.get("workshopsIntro") as typeof workshopsIntro | undefined) ?? workshopsIntro,
    scheduleBooking: (map.get("scheduleBooking") as typeof scheduleBooking | undefined) ?? scheduleBooking,
    testimonialsIntro:
      (map.get("testimonialsIntro") as typeof testimonialsIntro | undefined) ?? testimonialsIntro,
    testimonials: (map.get("testimonials") as typeof testimonials | undefined) ?? testimonials,
  };
}

export async function getPublishedArticles() {
  return safeQuery(
    () =>
      prisma.article.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  );
}

export async function getArticleBySlug(slug: string) {
  return safeQuery(
    () => prisma.article.findUnique({ where: { slug } }),
    null,
  );
}

export async function getHomeArticlesDisplay() {
  const rows = await getPublishedArticles();
  if (rows.length === 0) {
    return {
      featured: articlesFeatured,
      secondary: [...articlesSecondary],
      list: [...articlesList],
    };
  }

  const featured = rows.find((a) => a.featured) ?? rows[0];
  const secondary = rows.filter((a) => a.featured && a.id !== featured?.id).slice(0, 2);
  const list = rows.filter((a) => !a.featured);

  return {
    featured: featured
      ? {
          slug: featured.slug,
          category: featured.category,
          title: featured.title,
          excerpt: featured.excerpt,
          image: featured.image,
          imageAlt: featured.imageAlt,
          cta: "Read the guide",
        }
      : articlesFeatured,
    secondary:
      secondary.length > 0
        ? secondary.map((a) => ({
            slug: a.slug,
            category: a.category,
            title: a.title,
            excerpt: a.excerpt,
            image: a.image,
            imageAlt: a.imageAlt,
            cta: "Explore",
          }))
        : [...articlesSecondary],
    list:
      list.length > 0
        ? list.map((a) => ({
            slug: a.slug,
            title: a.title,
            description: a.excerpt,
            linkLabel: "Learn more",
            image: a.image,
            imageAlt: a.imageAlt,
          }))
        : [...articlesList],
  };
}

export async function getAllCustomers() {
  return safeQuery(
    () =>
      prisma.user.findMany({
        where: { role: Role.USER },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getAllOrders() {
  return safeQuery(
    () =>
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getOrderWithItems(orderId: string) {
  return safeQuery(
    () =>
      prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      }),
    null,
  ).then((order) => (order ? { order, items: order.items } : null));
}

export async function getAdminStats() {
  const [courseCount, workshopCount, articleCount, customerRows, orderRows] = await Promise.all([
    safeQuery(() => prisma.onlineCourse.findMany(), []),
    safeQuery(() => prisma.workshop.findMany(), []),
    safeQuery(() => prisma.article.findMany(), []),
    safeQuery(() => prisma.user.findMany({ where: { role: Role.USER } }), []),
    safeQuery(() => prisma.order.findMany(), []),
  ]);

  const revenue = orderRows
    .filter((o) => o.status === OrderStatus.PAID || o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.totalCad, 0);

  return {
    courses: courseCount.length,
    workshops: workshopCount.length,
    articles: articleCount.length,
    customers: customerRows.length,
    orders: orderRows.length,
    revenue,
  };
}
