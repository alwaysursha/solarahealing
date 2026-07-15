"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteNavItem } from "@/lib/frontpage-content";
import { site } from "@/lib/site";

type SiteChromeValue = {
  name: string;
  nav: SiteNavItem[];
  cta: string;
  sanskrit: string;
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
