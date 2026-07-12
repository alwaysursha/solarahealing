import { formatCad } from "@/lib/admin/catalog-stats";

type Stat = {
  label: string;
  value: string | number;
  detail?: string;
};

export function AdminCatalogHero({
  eyebrow,
  title,
  description,
  stats,
  accent = "purple",
}: {
  eyebrow: string;
  title: string;
  description: string;
  stats: Stat[];
  accent?: "purple" | "gold";
}) {
  return (
    <section className={`admin-catalog-hero admin-catalog-hero-${accent} relative overflow-hidden rounded-[1.6rem] p-5 sm:p-7`}>
      <div className="admin-catalog-hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1]">
        <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.3em]">{eyebrow}</p>
        <h3 className="admin-catalog-title mt-2 font-serif text-[2rem] leading-tight tracking-[-0.02em]">{title}</h3>
        <p className="admin-catalog-copy mt-3 max-w-3xl text-sm leading-relaxed">{description}</p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-catalog-stat rounded-[1.15rem] p-4">
              <p className="admin-catalog-stat-label text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
                {stat.label}
              </p>
              <p className="admin-catalog-stat-value mt-2 font-serif text-[2rem] leading-none tracking-[-0.03em]">
                {typeof stat.value === "number" && stat.label.toLowerCase().includes("revenue")
                  ? formatCad(stat.value)
                  : stat.value}
              </p>
              {stat.detail ? <p className="admin-catalog-stat-detail mt-2 text-xs leading-relaxed">{stat.detail}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
