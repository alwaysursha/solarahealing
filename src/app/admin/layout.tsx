import { cookies } from "next/headers";
import { auth } from "@/auth";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { ADMIN_THEME_COOKIE, isAdminTheme } from "@/components/admin/admin-theme";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const adminName = session?.user.name?.trim().split(/\s+/)[0] ?? "Admin";
  const themeCookie = (await cookies()).get(ADMIN_THEME_COOKIE)?.value;
  const initialTheme = isAdminTheme(themeCookie) ? themeCookie : "light";

  return (
    <AdminThemeProvider adminName={adminName} initialTheme={initialTheme}>
      {children}
    </AdminThemeProvider>
  );
}
