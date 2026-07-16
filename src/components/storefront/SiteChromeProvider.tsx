"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { BlogMenuPost } from "@/lib/blog-nav";
import type { CoursesMenuCourse } from "@/lib/courses-nav";
import type { SiteNavItem } from "@/lib/frontpage-content";
import type { ReikiMenuCourse } from "@/lib/reiki-nav";
import type { SessionsMenuItem } from "@/lib/sessions-nav";
import { site } from "@/lib/site";

type SiteChromeValue = {
  name: string;
  nav: SiteNavItem[];
  cta: string;
  sanskrit: string;
  reikiMenuCourse: ReikiMenuCourse | null;
  coursesMenu: CoursesMenuCourse[];
  sessionsMenu: SessionsMenuItem[];
  blogMenu: BlogMenuPost[];
};

const SiteChromeContext = createContext<SiteChromeValue>({
  name: site.name,
  nav: site.nav.map((item, index) => ({
    id: `nav-${index + 1}`,
    label: item.label,
    href: item.href,
    icon: item.icon,
  })),
  cta: site.cta,
  sanskrit: site.sanskrit,
  reikiMenuCourse: null,
  coursesMenu: [],
  sessionsMenu: [],
  blogMenu: [],
});

export function SiteChromeProvider({
  value,
  children,
}: {
  value: SiteChromeValue;
  children: ReactNode;
}) {
  return <SiteChromeContext.Provider value={value}>{children}</SiteChromeContext.Provider>;
}

export function useSiteChrome() {
  return useContext(SiteChromeContext);
}
