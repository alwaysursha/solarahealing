import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

const MAIN_LINKS = [
  {
    href: "/admin/web/frontpage",
    title: "Frontpage",
    description: "Site menu, hero slides, quote box, and About Us — with live preview and image uploads.",
    ready: true,
  },
  {
    href: "/admin/web/reiki",
    title: "Reiki page",
    description: "Hero, What is Reiki, benefits, FAQs, pathways, and closing CTA for /reiki.",
    ready: true,
  },
] as const;

export default function AdminWebPage() {
  return (
    <AdminShell
      activePath="/admin/web"
      title="Web Development"
      description="Edit each public page from a dedicated workspace. More main links will appear here as you expand the site."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MAIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="admin-panel block rounded-2xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text-muted)]">
              Main link
            </p>
            <h2 className="admin-panel-title mt-3 font-serif text-2xl">{link.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--admin-text-muted)]">{link.description}</p>
            <p className="mt-5 text-sm font-semibold text-purple-mid">Open editor →</p>
          </Link>
        ))}

        <div className="rounded-2xl border border-dashed border-[var(--admin-border)] p-5 opacity-70">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text-muted)]">
            Coming next
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[var(--admin-text)]">More pages</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--admin-text-muted)]">
            Courses, workshops, blog, and other main links can plug into this same hub later.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
