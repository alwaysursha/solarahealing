import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({
  activePath,
  title,
  description,
  children,
}: {
  activePath: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root flex min-h-screen bg-[#f6f1ea] text-purple-deep">
      <AdminSidebar activePath={activePath} />
      <div className="min-w-0 flex-1">
        <header className="border-b border-purple-deep/10 bg-white/70 px-8 py-6 backdrop-blur">
          <h2 className="font-serif text-3xl text-purple-deep">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm text-purple-deep/60">{description}</p> : null}
        </header>
        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-purple-deep/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-deep/45">{label}</p>
      <p className="mt-3 font-serif text-3xl text-purple-deep">{value}</p>
    </div>
  );
}

export function AdminStatGrid({ stats }: { stats: Record<string, string | number> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(stats).map(([label, value]) => (
        <StatCard key={label} label={label} value={value} />
      ))}
    </div>
  );
}

export function AdminPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-purple-deep/10 bg-white p-6 shadow-sm">
      <h3 className="font-serif text-xl text-purple-deep">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function AdminField({
  label,
  name,
  defaultValue,
  type = "text",
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  rows?: number;
}) {
  const className =
    "mt-1.5 w-full rounded-xl border border-purple-deep/10 bg-cream/30 px-3 py-2.5 text-sm text-purple-deep outline-none focus:border-gold/50";

  return (
    <label className="block text-sm">
      <span className="font-medium text-purple-deep/75">{label}</span>
      {rows ? (
        <textarea name={name} defaultValue={defaultValue} rows={rows} className={className} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} className={className} />
      )}
    </label>
  );
}

export function AdminSubmit({ label = "Save changes" }: { label?: string }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-purple-deep px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-purple-deep/90"
    >
      {label}
    </button>
  );
}
