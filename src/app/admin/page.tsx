import { auth } from "@/auth";
import { AdminShell, AdminStatGrid } from "@/components/admin/AdminShell";
import { getAdminStats } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getAdminStats();

  return (
    <AdminShell
      activePath="/admin"
      title={`Welcome back, ${session?.user.name ?? "Admin"}`}
      description="Manage site content, courses, workshops, customers, and orders from one place."
    >
      <AdminStatGrid
        stats={{
          Courses: stats.courses,
          Workshops: stats.workshops,
          Articles: stats.articles,
          Customers: stats.customers,
          Orders: stats.orders,
          "Revenue (CAD)": `$${stats.revenue}`,
        }}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {[
          { href: "/admin/settings", title: "Site Settings", copy: "Name, slogan, SEO, phone, and address." },
          { href: "/admin/courses", title: "Courses & Workshops", copy: "Pricing, publishing, and seat counts." },
          { href: "/admin/web", title: "Web Development", copy: "Edit homepage sections in place." },
          { href: "/admin/blog", title: "Blog & Articles", copy: "Manage all published articles." },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-purple-deep/10 bg-white p-6 shadow-sm transition hover:border-gold/35"
          >
            <h3 className="font-serif text-xl text-purple-deep">{card.title}</h3>
            <p className="mt-2 text-sm text-purple-deep/60">{card.copy}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
