"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CartRoot } from "@/components/cart/CartRoot";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { SiteShell } from "@/components/shell/SiteShell";

type StorefrontShellProps = {
  children: ReactNode;
  whatsapp?: string;
};

export function StorefrontShell({ children, whatsapp = "" }: StorefrontShellProps) {
  return (
    <SessionProvider refetchOnWindowFocus refetchInterval={60 * 60}>
      <CartRoot>
        <SiteShell>
          {children}
          <Footer />
        </SiteShell>
        <WhatsAppFloat whatsapp={whatsapp} />
      </CartRoot>
    </SessionProvider>
  );
}
