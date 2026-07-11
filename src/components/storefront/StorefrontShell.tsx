"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { SiteShell } from "@/components/shell/SiteShell";

type StorefrontShellProps = {
  children: ReactNode;
};

export function StorefrontShell({ children }: StorefrontShellProps) {
  return (
    <SessionProvider refetchOnWindowFocus>
      <SiteShell>
        {children}
        <Footer />
      </SiteShell>
    </SessionProvider>
  );
}
