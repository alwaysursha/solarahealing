export type BlogMenuPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  imageAlt: string;
  category: string;
  featured: boolean;
};

export const BLOG_NAV_LIMIT = 4;

export function isBlogNavItem(item: { label: string; href: string }) {
  const label = item.label.trim().toUpperCase();
  const href = item.href.trim().toLowerCase();
  return (
    label === "ARTICLES" ||
    label === "BLOG" ||
    href === "/articles" ||
    href.startsWith("/articles#") ||
    href === "/blog" ||
    href.startsWith("/blog#")
  );
}

/** Featured first, then remaining in catalog order — capped for the mega menu. */
export function pickPostsForNav(posts: BlogMenuPost[]) {
  const featured = posts.filter((post) => post.featured);
  const rest = posts.filter((post) => !post.featured);
  return [...featured, ...rest].slice(0, BLOG_NAV_LIMIT);
}
