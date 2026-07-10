import { asc, desc, eq } from "drizzle-orm";
import {
  articles,
  getDb,
  onlineCourses,
  pageSections,
  siteSettings,
  users,
  workshops,
  orders,
  orderItems,
} from "@/db";
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

export async function getDbSiteSettings() {
  const db = await getDb();
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  const row = rows[0];
  if (!row) {
    return null;
  }
  return row;
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
    fetchedAt: row.updatedAt,
  };
}

export async function getPublishedCourses() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(onlineCourses)
    .where(eq(onlineCourses.published, true))
    .orderBy(asc(onlineCourses.sortOrder));

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
  const db = await getDb();
  const rows = await db
    .select()
    .from(workshops)
    .where(eq(workshops.published, true))
    .orderBy(asc(workshops.sortOrder));

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
  const db = await getDb();
  const rows = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageKey, pageKey))
    .orderBy(asc(pageSections.sectionKey));

  return rows.find((row) => row.sectionKey === sectionKey) ?? null;
}

export async function getHomePageContent() {
  const db = await getDb();
  const sections = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageKey, "home"));

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
  const db = await getDb();
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(asc(articles.sortOrder));

  return rows;
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return rows[0] ?? null;
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
  const db = await getDb();
  return db.select().from(users).where(eq(users.role, "user")).orderBy(desc(users.createdAt));
}

export async function getAllOrders() {
  const db = await getDb();
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(orderId: string) {
  const db = await getDb();
  const orderRows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  const order = orderRows[0];
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

export async function getAdminStats() {
  const db = await getDb();
  const [courseCount, workshopCount, articleCount, customerRows, orderRows] = await Promise.all([
    db.select().from(onlineCourses),
    db.select().from(workshops),
    db.select().from(articles),
    db.select().from(users).where(eq(users.role, "user")),
    db.select().from(orders),
  ]);

  const revenue = orderRows
    .filter((o) => o.status === "paid" || o.status === "completed")
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
