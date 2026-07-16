"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CartRoot } from "@/components/cart/CartRoot";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { SiteShell } from "@/components/shell/SiteShell";
import { SiteChromeProvider } from "@/components/storefront/SiteChromeProvider";
import type { SiteNavItem } from "@/lib/frontpage-content";
import type { ReikiMenuCourse } from "@/lib/reiki-nav";

type StorefrontShellProps = {
  children: ReactNode;
  whatsapp?: string;
  name: string;
  nav: SiteNavItem[];
  cta: string;
  sanskrit: string;
  reikiMenuCourse?: ReikiMenuCourse | null;
};

export function StorefrontShell({
  children,
  whatsapp = "",
  name,
  nav,
  cta,
  sanskrit,
  reikiMenuCourse = null,
}: StorefrontShellProps) {
  return (
    <SessionProvider refetchOnWindowFocus refetchInterval={60 * 60}>
      <SiteChromeProvider value={{ name, nav, cta, sanskrit, reikiMenuCourse }}>
        <CartRoot>
          <SiteShell>
            {children}
            <Footer />
          </SiteShell>
          <WhatsAppFloat whatsapp={whatsapp} />
        </CartRoot>
      </SiteChromeProvider>
    </SessionProvider>
  );
}
