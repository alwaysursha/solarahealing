import {
  normalizeAboutContent,
  normalizeHeroSlides,
  parseNavJson,
  type AboutContent,
  type HeroSlide,
  type SiteNavItem,
} from "@/lib/frontpage-content";
import { OrderStatus, Role } from "@prisma/client";
import {
  courseCategoryLabel,
  courseLevelLabel,
} from "@/lib/course-taxonomy";
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
  privateSessions as staticPrivateSessions,
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

function defaultNav(): SiteNavItem[] {
  return parseNavJson(null);
}

export async function getDbSiteSettings() {
  return safeQuery(
    () => prisma.siteSettings.findUnique({ where: { id: 1 } }),
    null,
  );
}

export async function getStorefrontSectionVisibility() {
  const row = await getDbSiteSettings();
  return {
    showCoursesSection: row?.showCoursesSection ?? true,
    showWorkshopsSection: row?.showWorkshopsSection ?? false,
    showPrivateSessionsSection: row?.showPrivateSessionsSection ?? true,
  };
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
      showCoursesSection: true,
      showWorkshopsSection: false,
      showPrivateSessionsSection: true,
      nav: defaultNav(),
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
    showCoursesSection: row.showCoursesSection ?? true,
    showWorkshopsSection: row.showWorkshopsSection ?? false,
    showPrivateSessionsSection: row.showPrivateSessionsSection ?? true,
    nav: parseNavJson(row.navJson),
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
      slug: course.id,
      title: course.title,
      description: course.description,
      date: course.date,
      duration: course.duration,
      badge: courseCategoryLabel(course.category),
      category: course.category,
      priceCad: course.priceCad,
      image: course.image,
      imageAlt: course.imageAlt,
      imageFocusX: 50,
      imageFocusY: 50,
      level: courseLevelLabel(course.level),
      levelKey: course.level,
    }));
  }

  return rows.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    date: course.dateLabel,
    duration: course.duration,
    badge: courseCategoryLabel(course.category),
    category: course.category,
    priceCad: course.priceCad,
    image: course.image,
    imageAlt: course.imageAlt,
    imageFocusX: course.imageFocusX,
    imageFocusY: course.imageFocusY,
    level: courseLevelLabel(course.level),
    levelKey: course.level,
  }));
}

export async function getPublishedWorkshops() {
  const rows = await safeQuery(
    () =>
      prisma.workshop.findMany({
        where: { published: true },
        orderBy: { scheduledAt: "asc" },
      }),
    [],
  );

  if (rows.length === 0) {
    return staticWorkshops.map((workshop) => ({
      ...workshop,
      slug: workshop.id,
      imageFocusX: 50,
      imageFocusY: 50,
    }));
  }

  return rows.map((workshop) => ({
    id: workshop.id,
    slug: workshop.slug,
    title: workshop.title,
    description: workshop.description,
    date: workshop.dateLabel,
    duration: workshop.duration,
    badge: workshop.badge,
    priceCad: workshop.priceCad,
    image: workshop.image,
    imageAlt: workshop.imageAlt,
    imageFocusX: workshop.imageFocusX,
    imageFocusY: workshop.imageFocusY,
  }));
}

export async function getPublishedPrivateSessions() {
  const rows = await safeQuery(
    () =>
      prisma.privateSession.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  );

  if (rows.length === 0) {
    return staticPrivateSessions.map((session) => ({
      ...session,
      slug: session.id,
      date: "Schedule after booking",
      badge: "Private session",
      imageFocusX: 50,
      imageFocusY: 50,
    }));
  }

  return rows.map((session) => ({
    id: session.id,
    slug: session.slug,
    title: session.title,
    description: session.description,
    date: "Schedule after booking",
    duration: session.duration,
    badge: "Private session",
    priceCad: session.priceCad,
    image: session.image,
    imageAlt: session.imageAlt,
    imageFocusX: session.imageFocusX,
    imageFocusY: session.imageFocusY,
  }));
}

export async function getPublishedCourseById(idOrSlug: string) {
  const courses = await getPublishedCourses();
  return courses.find((course) => course.id === idOrSlug || course.slug === idOrSlug) ?? null;
}

export async function getPublishedWorkshopById(idOrSlug: string) {
  const workshops = await getPublishedWorkshops();
  return workshops.find((workshop) => workshop.id === idOrSlug || workshop.slug === idOrSlug) ?? null;
}

export async function getPublishedPrivateSessionById(idOrSlug: string) {
  const sessions = await getPublishedPrivateSessions();
  return sessions.find((session) => session.id === idOrSlug || session.slug === idOrSlug) ?? null;
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
  const [sections, settings] = await Promise.all([
    safeQuery(
      () =>
        prisma.pageSection.findMany({
          where: { pageKey: "home" },
        }),
      [],
    ),
    getSiteSettingsFromDb(),
  ]);

  const map = new Map(sections.map((s) => [s.sectionKey, JSON.parse(s.content)]));

  return {
    heroSlides: normalizeHeroSlides(map.get("hero") ?? heroSlides, settings.cta) as HeroSlide[],
    aboutContent: normalizeAboutContent(map.get("about") ?? aboutContent) as AboutContent,
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
  const rest = rows.filter((a) => a.id !== featured.id);
  const secondary = [
    ...rest.filter((a) => a.featured),
    ...rest.filter((a) => !a.featured),
  ].slice(0, 2);
  const secondaryIds = new Set(secondary.map((a) => a.id));
  const list = rest.filter((a) => !secondaryIds.has(a.id));

  return {
    featured: {
      slug: featured.slug,
      category: featured.category,
      title: featured.title,
      excerpt: featured.excerpt,
      image: featured.image,
      imageAlt: featured.imageAlt,
      cta: "Read the guide",
    },
    secondary: secondary.map((a) => ({
      slug: a.slug,
      category: a.category,
      title: a.title,
      excerpt: a.excerpt,
      image: a.image,
      imageAlt: a.imageAlt,
      cta: "Explore",
    })),
    list: list.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.excerpt,
      linkLabel: "Learn more",
      image: a.image,
      imageAlt: a.imageAlt,
    })),
  };
}

export async function getAllCustomers() {
  return safeQuery(
    () =>
      prisma.user.findMany({
        where: { role: Role.USER },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { orders: true } },
          orders: {
            where: { status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] } },
            select: { totalCad: true },
          },
        },
      }),
    [],
  );
}

export async function getCustomerProfile(customerId: string) {
  return safeQuery(
    () =>
      prisma.user.findFirst({
        where: { id: customerId, role: Role.USER },
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: { items: true },
          },
        },
      }),
    null,
  );
}

export async function getOrdersForUser(userId: string) {
  return safeQuery(
    () =>
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    [],
  );
}

export async function getAllOrders() {
  return safeQuery(
    () =>
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: { select: { id: true, whatsapp: true, email: true, name: true } },
        },
      }),
    [],
  );
}

export async function getOrderWithItems(orderId: string) {
  return safeQuery(
    () =>
      prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true, whatsapp: true } },
        },
      }),
    null,
  );
}

export async function getAdminStats() {
  const [courseCount, workshopCount, articleCount, customerRows, orderRows] = await Promise.all([
    safeQuery(() => prisma.onlineCourse.findMany(), []),
    safeQuery(() => prisma.workshop.findMany(), []),
    safeQuery(() => prisma.article.findMany(), []),
    safeQuery(() => prisma.user.findMany({ where: { role: Role.USER } }), []),
    safeQuery(() => prisma.order.findMany(), []),
  ]);

  const paidOrders = orderRows.filter(
    (o) => o.status === OrderStatus.PAID || o.status === OrderStatus.COMPLETED,
  ).length;

  const revenue = orderRows
    .filter((o) => o.status === OrderStatus.PAID || o.status === OrderStatus.COMPLETED)
    .reduce((sum, o) => sum + o.totalCad, 0);

  return {
    courses: courseCount.length,
    workshops: workshopCount.length,
    articles: articleCount.length,
    customers: customerRows.length,
    orders: orderRows.length,
    paidOrders,
    revenue,
  };
}

export async function getRecentAdminOrders(limit = 6) {
  return safeQuery(
    () =>
      prisma.order.findMany({
        where: {
          status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          items: {
            select: {
              id: true,
              title: true,
              itemType: true,
              quantity: true,
            },
          },
        },
      }),
    [],
  );
}
