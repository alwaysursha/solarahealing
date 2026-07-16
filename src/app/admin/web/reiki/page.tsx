import Link from "next/link";
import { AdminReikiPageManager } from "@/components/admin/web/AdminReikiPageManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { getReikiPageContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminReikiPage() {
  const content = await getReikiPageContent();

  return (
    <AdminShell
      activePath="/admin/web"
      title="Reiki page"
      description="Edit the /reiki experience. Changes publish when you save each section."
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/admin/web"
          className="rounded-full border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]"
        >
          ← All main links
        </Link>
        <Link
          href="/reiki"
          target="_blank"
          className="rounded-full border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-text)]"
        >
          Open live Reiki page
        </Link>
      </div>

      <AdminReikiPageManager initialContent={content} />
    </AdminShell>
  );
}
