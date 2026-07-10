import { asc, eq } from "drizzle-orm";
import { db, pageSections } from "@/db";
import { AdminPanel, AdminShell, AdminSubmit } from "@/components/admin/AdminShell";
import { updatePageSectionAction } from "@/lib/admin/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminWebPage() {
  const sections = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageKey, "home"))
    .orderBy(asc(pageSections.sectionKey));

  return (
    <AdminShell
      activePath="/admin/web"
      title="Web Development"
      description="Edit homepage sections exactly where they appear on the live site. Changes publish immediately after saving."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/" target="_blank" className="rounded-full border border-purple-deep/15 px-4 py-2 text-sm text-purple-deep hover:border-gold/40">
          Open live homepage
        </Link>
        <Link href="/workshops" target="_blank" className="rounded-full border border-purple-deep/15 px-4 py-2 text-sm text-purple-deep hover:border-gold/40">
          Open workshops page
        </Link>
        <Link href="/blog" target="_blank" className="rounded-full border border-purple-deep/15 px-4 py-2 text-sm text-purple-deep hover:border-gold/40">
          Open blog page
        </Link>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <AdminPanel key={section.id} title={section.label}>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-purple-deep/45">
              home / {section.sectionKey}
            </p>
            <form action={updatePageSectionAction}>
              <input type="hidden" name="id" value={section.id} />
              <textarea
                name="content"
                defaultValue={section.content}
                rows={12}
                className="w-full rounded-xl border border-purple-deep/10 bg-cream/30 px-3 py-2.5 font-mono text-xs text-purple-deep outline-none focus:border-gold/50"
              />
              <div className="mt-4">
                <AdminSubmit label={`Save ${section.label}`} />
              </div>
            </form>
          </AdminPanel>
        ))}
      </div>
    </AdminShell>
  );
}
