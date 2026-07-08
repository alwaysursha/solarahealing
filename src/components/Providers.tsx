"use client";

import type { ReactNode } from "react";

/** Root client providers — extend with SessionProvider, cart, etc. */
export function Providers({ children }: { children: ReactNode }) {
  return children;
}
