import Link from "next/link";
import { signOut } from "@/auth";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/courses", label: "Courses & Workshops" },
  { href: "/admin/web", label: "Web Development" },
  { href: "/admin/blog", label: "Blog & Articles" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/profile", label: "Profile" },
];

export function AdminSidebar({ activePath }: { activePath: string }) {
  return (
    <aside className="admin-sidebar flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-[#1a1228] text-cream">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold/75">Soulara Admin</p>
        <h1 className="mt-2 font-serif text-2xl text-cream">Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = activePath === link.href || (link.href !== "/admin" && activePath.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "block rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-gold/15 text-gold-light" : "text-cream/72 hover:bg-white/5 hover:text-cream",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-white/10 px-3 py-4">
        <Link href="/" className="block rounded-xl px-3 py-2 text-sm text-cream/60 hover:bg-white/5 hover:text-cream">
          View website
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-cream/60 hover:bg-white/5 hover:text-cream">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
