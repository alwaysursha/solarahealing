export type SessionsMenuItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  priceCad: number;
  duration: string;
};

export const SESSIONS_NAV_LIMIT = 6;

export function isSessionsNavItem(item: { label: string; href: string }) {
  const label = item.label.trim().toUpperCase();
  const href = item.href.trim().toLowerCase();
  return (
    label === "BOOK A SESSION" ||
    label === "SESSIONS" ||
    href === "/sessions" ||
    href.startsWith("/sessions#")
  );
}

export function pickSessionsForNav(sessions: SessionsMenuItem[]) {
  return sessions.slice(0, SESSIONS_NAV_LIMIT);
}
