export type AdminTheme = "light" | "dark";

export const ADMIN_THEME_STORAGE_KEY = "soulara-admin-theme";
export const ADMIN_THEME_COOKIE = "soulara-admin-theme";
export const ADMIN_THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isAdminTheme(value: string | null | undefined): value is AdminTheme {
  return value === "light" || value === "dark";
}

export function persistAdminTheme(theme: AdminTheme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  document.cookie = `${ADMIN_THEME_COOKIE}=${theme}; path=/; max-age=${ADMIN_THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}
