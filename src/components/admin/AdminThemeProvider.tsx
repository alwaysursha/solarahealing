"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ADMIN_THEME_STORAGE_KEY,
  isAdminTheme,
  persistAdminTheme,
  type AdminTheme,
} from "@/components/admin/admin-theme";

type AdminThemeContextValue = {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
  adminName: string;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

function readStoredTheme(): AdminTheme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
  return isAdminTheme(stored) ? stored : null;
}

export function AdminThemeProvider({
  children,
  adminName = "Admin",
  initialTheme = "light",
}: {
  children: ReactNode;
  adminName?: string;
  initialTheme?: AdminTheme;
}) {
  const [theme, setThemeState] = useState<AdminTheme>(() => {
    return readStoredTheme() ?? initialTheme;
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored) {
      setThemeState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    persistAdminTheme(theme);
  }, [theme, hydrated]);

  const value = useMemo<AdminThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((current) => (current === "light" ? "dark" : "light")),
      adminName,
    }),
    [theme, adminName],
  );

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}
