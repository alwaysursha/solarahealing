import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  image: text("image"),
  role: text("role", { enum: ["user", "admin"] })
    .notNull()
    .default("user"),
  phone: text("phone"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  sanskrit: text("sanskrit").notNull(),
  sanskritMeaning: text("sanskrit_meaning").notNull(),
  description: text("description").notNull(),
  seoTitle: text("seo_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  address: text("address").notNull(),
  cta: text("cta").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const onlineCourses = sqliteTable("online_courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dateLabel: text("date_label").notNull(),
  duration: text("duration").notNull(),
  badge: text("badge").notNull(),
  priceCad: integer("price_cad").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  level: text("level").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const workshops = sqliteTable("workshops", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dateLabel: text("date_label").notNull(),
  duration: text("duration").notNull(),
  badge: text("badge").notNull(),
  priceCad: integer("price_cad").notNull(),
  seatsTotal: integer("seats_total").notNull().default(20),
  seatsBooked: integer("seats_booked").notNull().default(0),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});

export const pageSections = sqliteTable("page_sections", {
  id: text("id").primaryKey(),
  pageKey: text("page_key").notNull(),
  sectionKey: text("section_key").notNull(),
  label: text("label").notNull(),
  content: text("content").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status", {
    enum: ["pending", "paid", "cancelled", "refunded", "completed"],
  })
    .notNull()
    .default("pending"),
  totalCad: integer("total_cad").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  itemType: text("item_type", { enum: ["course", "workshop"] }).notNull(),
  itemId: text("item_id").notNull(),
  title: text("title").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPriceCad: integer("unit_price_cad").notNull(),
});

export type User = typeof users.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type OnlineCourse = typeof onlineCourses.$inferSelect;
export type Workshop = typeof workshops.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;
export type Order = typeof orders.$inferSelect;
