import Link from "next/link";
import { AdminFrontpageManager } from "@/components/admin/web/AdminFrontpageManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { getHomePageContent, getSiteSettingsFromDb } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminFrontpagePage() {
  const [home, settings] = await Promise.all([getHomePageContent(), getSiteSettingsFromDb()]);

  return (
    <AdminShell
      activePath="/admin/web"
      title="Frontpage"
      description="Edit the homepage experience. Changes publish when you save each section."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/web"
          className="rounded-full border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]"
        >
          ← All main links
        </Link>
        <Link
          href="/"
          target="_blank"
          className="rounded-full border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]"
        >
          Open live homepage
        </Link>
      </div>

      <AdminFrontpageManager
        initialNav={settings.nav}
        initialHero={home.heroSlides}
        initialAbout={home.aboutContent}
        ctaLabel={settings.cta}
      />
    </AdminShell>
  );
}
