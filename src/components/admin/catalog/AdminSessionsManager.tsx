import Link from "next/link";
import { AdminCatalogCollapsiblePanel } from "@/components/admin/catalog/AdminCatalogCollapsiblePanel";
import { AdminField, AdminSubmit } from "@/components/admin/AdminShell";
import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { AdminSessionDragList } from "@/components/admin/catalog/AdminSessionDragList";
import { AdminStorefrontVisibilityToggle } from "@/components/admin/catalog/AdminStorefrontVisibilityToggle";
import { upsertPrivateSessionAction } from "@/lib/admin/actions";
import { getPrivateSessionAdminOverview } from "@/lib/admin/catalog-stats";
import { getStorefrontSectionVisibility } from "@/lib/content";

function NewSessionPanel() {
  return (
    <AdminCatalogCollapsiblePanel
      className="admin-catalog-create-panel admin-catalog-create admin-catalog-create-course mt-0 overflow-hidden rounded-[1.35rem]"
      summaryClassName="p-6"
      summary={
        <>
          <p className="admin-catalog-card-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
            New listing
          </p>
          <h4 className="admin-catalog-card-title mt-2 font-serif text-[1.6rem]">Create a private session</h4>
          <p className="admin-catalog-card-copy mt-2 max-w-2xl text-sm leading-relaxed">
            Sell a one-to-one session through Stripe checkout. Scheduling happens after purchase by WhatsApp or email.
          </p>
        </>
      }
    >
      <div className="admin-catalog-create-body border-t px-6 pb-6 pt-5">
        <form action={upsertPrivateSessionAction} className="admin-catalog-form rounded-[1rem] p-4">
          <div className="grid gap-3 lg:grid-cols-2">
            <AdminField label="Title" name="title" />
            <AdminField label="Slug" name="slug" />
            <AdminField label="Price (CAD)" name="priceCad" defaultValue={180} type="number" />
            <AdminField label="Duration" name="duration" defaultValue="60 minutes · one-to-one" />
            <AdminField label="Image URL" name="image" />
            <AdminField label="Image alt" name="imageAlt" />
            <input type="hidden" name="imageFocusX" value="50" />
            <input type="hidden" name="imageFocusY" value="50" />
            <label className="admin-catalog-checkbox flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Published on storefront
            </label>
            <div className="lg:col-span-2">
              <AdminField label="Description" name="description" rows={4} />
            </div>
          </div>
          <div className="mt-4">
            <AdminSubmit label="Create session" savedLabel="Created" />
          </div>
        </form>
      </div>
    </AdminCatalogCollapsiblePanel>
  );
}

export async function AdminSessionsManager() {
  const [{ sessions, stats }, visibility] = await Promise.all([
    getPrivateSessionAdminOverview(),
    getStorefrontSectionVisibility(),
  ]);

  return (
    <div className="admin-catalog space-y-8">
      <AdminStorefrontVisibilityToggle
        section="private_sessions"
        visible={visibility.showPrivateSessionsSection}
      />

      <AdminCatalogHero
        accent="purple"
        eyebrow="One-to-one catalog"
        title="Private sessions"
        description="Offer Akashic readings, regressions, and Reiki sessions as fixed-price products. Customers purchase a credit; you schedule afterward."
        stats={[
          { label: "Total sessions", value: stats.total, detail: "Offerings in your catalog" },
          { label: "Published", value: stats.published, detail: "Live on the storefront" },
          { label: "Bookings sold", value: stats.unitsSold, detail: `${stats.pendingUnits} pending checkout` },
          { label: "Session revenue", value: stats.revenueCad, detail: "Paid and completed orders" },
        ]}
      />

      <NewSessionPanel />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">Catalog</p>
            <h4 className="admin-catalog-title mt-1 font-serif text-2xl">Your private sessions</h4>
          </div>
          <Link
            href="/admin/orders"
            className="admin-catalog-inline-link inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
          >
            Open orders
          </Link>
        </div>

        {sessions.length > 0 ? (
          <AdminSessionDragList sessions={sessions} />
        ) : (
          <div className="admin-catalog-empty rounded-[1.25rem] p-8 text-center">
            <p className="font-serif text-2xl">No private sessions yet</p>
            <p className="admin-catalog-copy mt-2 text-sm">Open New listing above to create your first session.</p>
          </div>
        )}
      </section>
    </div>
  );
}
