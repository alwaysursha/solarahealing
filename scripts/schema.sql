CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  phone TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  sanskrit TEXT NOT NULL,
  sanskrit_meaning TEXT NOT NULL,
  description TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  cta TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS online_courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_label TEXT NOT NULL,
  duration TEXT NOT NULL,
  badge TEXT NOT NULL,
  price_cad INTEGER NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  level TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workshops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_label TEXT NOT NULL,
  duration TEXT NOT NULL,
  badge TEXT NOT NULL,
  price_cad INTEGER NOT NULL,
  seats_total INTEGER NOT NULL DEFAULT 20,
  seats_booked INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS page_sections (
  id TEXT PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_cad INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cad INTEGER NOT NULL
);
