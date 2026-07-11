"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { SiteShell } from "@/components/shell/SiteShell";

type StorefrontShellProps = {
  session: Session | null;
  children: ReactNode;
};

export function StorefrontShell({ session, children }: StorefrontShellProps) {
  return (
    <SessionProvider session={session}>
      <SiteShell>
        {children}
        <Footer />
      </SiteShell>
    </SessionProvider>
  );
}
