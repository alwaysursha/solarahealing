import Link from "next/link";

type AdminDashboardStats = {
  courses: number;
  workshops: number;
  articles: number;
  customers: number;
  paidOrders: number;
  pendingOrders: number;
};

type DashboardTileProps = {
  eyebrow: string;
  title: string;
  value: number;
  detail: string;
  href: string;
  linkLabel: string;
  tone: "purple" | "gold" | "violet" | "plum";
  icon: React.ReactNode;
};

const toneStyles = {
  purple: {
    mesh: "from-[#5C1A94]/14 via-[#7A3AAF]/8 to-transparent",
    glow: "bg-[#5C1A94]/10 group-hover:bg-[#5C1A94]/16",
    ring: "ring-[#5C1A94]/12 group-hover:ring-[#5C1A94]/22",
  },
  gold: {
    mesh: "from-[#C9A227]/18 via-[#E8CA62]/10 to-transparent",
    glow: "bg-[#C9A227]/12 group-hover:bg-[#C9A227]/18",
    ring: "ring-[#C9A227]/18 group-hover:ring-[#C9A227]/28",
  },
  violet: {
    mesh: "from-[#6E4A9A]/16 via-[#9D4DAE]/10 to-transparent",
    glow: "bg-[#9D4DAE]/10 group-hover:bg-[#9D4DAE]/16",
    ring: "ring-[#9D4DAE]/14 group-hover:ring-[#9D4DAE]/24",
  },
  plum: {
    mesh: "from-[#3A2560]/12 via-[#5C1A94]/8 to-transparent",
    glow: "bg-[#3A2560]/8 group-hover:bg-[#3A2560]/12",
    ring: "ring-[#3A2560]/10 group-hover:ring-[#3A2560]/18",
  },
} as const;

function ArrowLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardTile({
  eyebrow,
  title,
  value,
  detail,
  href,
  linkLabel,
  tone,
  icon,
}: DashboardTileProps) {
  const styles = toneStyles[tone];

  return (
    <article
      className={[
        "admin-dashboard-tile group relative overflow-hidden rounded-[1.4rem] p-5 sm:p-6",
        "ring-1 transition-all duration-300 hover:-translate-y-1",
        "hover:shadow-[0_32px_72px_-24px_rgba(45,27,78,0.34),0_12px_32px_-14px_rgba(201,162,39,0.14)]",
        styles.ring,
      ].join(" ")}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.mesh}`} aria-hidden />
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl transition-colors duration-300 ${styles.glow}`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden />

      <div className="relative z-[1] flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="admin-dashboard-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">{eyebrow}</p>
            <h3 className="admin-dashboard-tile-title mt-2 font-serif text-[1.35rem] font-normal leading-tight">{title}</h3>
          </div>
          <div
            className={`admin-dashboard-tile-icon admin-dashboard-tile-icon-${tone} flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border`}
          >
            {icon}
          </div>
        </div>

        <p className="admin-dashboard-value mt-6 font-serif text-[2.5rem] leading-none tracking-[-0.03em] sm:mt-8 sm:text-[3.15rem]">{value}</p>
        <p className="admin-dashboard-detail mt-2 text-sm leading-relaxed">{detail}</p>

        <Link
          href={href}
          className={`admin-dashboard-tile-link admin-dashboard-tile-link-${tone} group/link mt-auto inline-flex w-full items-center gap-2 border-t pt-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] transition-colors`}
        >
          {linkLabel}
          <ArrowLinkIcon />
        </Link>
      </div>
    </article>
  );
}

function OrderStatTile({
  label,
  value,
  detail,
  href,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  href: string;
  tone: "paid" | "pending";
}) {
  const isPaid = tone === "paid";

  return (
    <Link
      href={href}
      className={[
        "admin-dashboard-order-tile group relative overflow-hidden rounded-[1.25rem] p-5 transition-all duration-300 hover:-translate-y-0.5",
        isPaid ? "border-[#C9A227]/20" : "",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 bg-gradient-to-br",
          isPaid ? "from-[#C9A227]/10 via-transparent to-transparent" : "from-[#5C1A94]/8 via-transparent to-transparent",
        ].join(" ")}
        aria-hidden
      />
      <div className="relative z-[1]">
        <p className="admin-dashboard-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.24em]">{label}</p>
        <p className="admin-dashboard-value mt-3 font-serif text-[2.15rem] leading-none tracking-[-0.03em] sm:text-[2.6rem]">{value}</p>
        <p className="admin-dashboard-detail mt-2 text-sm">{detail}</p>
        <span
          className={[
            "admin-dashboard-order-link mt-5 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
            isPaid ? "admin-dashboard-order-link-paid" : "admin-dashboard-order-link-pending",
          ].join(" ")}
        >
          View orders
          <ArrowLinkIcon />
        </span>
      </div>
    </Link>
  );
}

function CoursesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 12 12 15.5 20 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16.5 12 20l8-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WorkshopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5V6M16 3.5V6M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArticlesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M6 4.5h12M6 9h12M6 13.5h8M6 18h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 8.5a2.5 2.5 0 1 1 0 5M15 19c.2-2.2 1.8-3.8 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AdminDashboard({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="admin-dashboard space-y-10">
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-dashboard-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">Commerce</p>
            <h4 className="admin-dashboard-title mt-1 font-serif text-2xl">Orders</h4>
            <p className="admin-dashboard-copy mt-2 text-sm">Track paid and pending checkout activity.</p>
          </div>
          <Link
            href="/admin/orders"
            className="admin-dashboard-link inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition"
          >
            View all orders
            <ArrowLinkIcon />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <OrderStatTile
            label="Paid orders"
            value={stats.paidOrders}
            detail="Successfully paid and completed purchases."
            href="/admin/orders"
            tone="paid"
          />
          <OrderStatTile
            label="Pending orders"
            value={stats.pendingOrders}
            detail="Orders awaiting payment or confirmation."
            href="/admin/orders"
            tone="pending"
          />
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="admin-dashboard-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">Content</p>
            <h4 className="admin-dashboard-title mt-1 font-serif text-2xl">Studio inventory</h4>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <DashboardTile
            eyebrow="Catalog"
            title="Total Courses"
            value={stats.courses}
            detail="Published and draft online programs in your catalog."
            href="/admin/courses"
            linkLabel="View courses"
            tone="purple"
            icon={<CoursesIcon />}
          />
          <DashboardTile
            eyebrow="Live events"
            title="Upcoming Workshops"
            value={stats.workshops}
            detail="Upcoming and archived live workshop sessions."
            href="/admin/workshops"
            linkLabel="View workshops"
            tone="gold"
            icon={<WorkshopIcon />}
          />
          <DashboardTile
            eyebrow="Publishing"
            title="Total Articles"
            value={stats.articles}
            detail="Blog posts and editorial content on the site."
            href="/admin/blog"
            linkLabel="View articles"
            tone="violet"
            icon={<ArticlesIcon />}
          />
          <DashboardTile
            eyebrow="Community"
            title="Total Customers"
            value={stats.customers}
            detail="Registered customer accounts on Soulara Healing Academy."
            href="/admin/customers"
            linkLabel="View customers"
            tone="plum"
            icon={<CustomersIcon />}
          />
        </div>
      </section>
    </div>
  );
}
