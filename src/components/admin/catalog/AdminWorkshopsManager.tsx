import Image from "next/image";
import Link from "next/link";
import { AdminCatalogImageField } from "@/components/admin/AdminCatalogImageField";
import { AdminCatalogCollapsiblePanel } from "@/components/admin/catalog/AdminCatalogCollapsiblePanel";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminField, AdminSubmit } from "@/components/admin/AdminShell";
import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { AdminStorefrontVisibilityToggle } from "@/components/admin/catalog/AdminStorefrontVisibilityToggle";
import {
  deleteWorkshopFormAction,
  upsertWorkshopAction,
} from "@/lib/admin/actions";
import { formatCad, getWorkshopAdminOverview, type WorkshopWithSales } from "@/lib/admin/catalog-stats";
import { getStorefrontSectionVisibility } from "@/lib/content";
import { toImageObjectPosition } from "@/lib/image-focus";
import {
  getDefaultWorkshopScheduleValue,
  toDatetimeLocalValue,
} from "@/lib/admin/workshop-schedule";

function WorkshopStatusBadge({ published, fillPercent }: { published: boolean; fillPercent: number }) {
  if (!published) {
    return (
      <span className="admin-catalog-badge admin-catalog-badge-draft inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
        Draft
      </span>
    );
  }

  if (fillPercent >= 100) {
    return (
      <span className="admin-catalog-badge admin-catalog-badge-full inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
        Sold out
      </span>
    );
  }

  return (
    <span className="admin-catalog-badge admin-catalog-badge-live inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
      Open for booking
    </span>
  );
}

function SeatMeter({ booked, total, fillPercent }: { booked: number; total: number; fillPercent: number }) {
  return (
    <div className="admin-catalog-seat-meter">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold uppercase tracking-[0.16em] opacity-75">Seat capacity</span>
        <span className="font-semibold">
          {booked} / {total} spots filled
        </span>
      </div>
      <div className="admin-catalog-seat-track h-2.5 overflow-hidden rounded-full">
        <div className="admin-catalog-seat-fill h-full rounded-full transition-all duration-500" style={{ width: `${fillPercent}%` }} />
      </div>
      <p className="admin-catalog-card-copy mt-2 text-xs">
        {total - booked > 0 ? `${total - booked} spots remaining for checkout` : "No spots left — increase capacity or schedule a new session"}
      </p>
    </div>
  );
}

function WorkshopCard({ workshop }: { workshop: WorkshopWithSales }) {
  const objectPosition = toImageObjectPosition(workshop.imageFocusX, workshop.imageFocusY);

  return (
    <article className="admin-catalog-card admin-catalog-card-workshop group relative overflow-hidden rounded-[1.35rem]">
      <div className="admin-catalog-card-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1] grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="admin-catalog-card-eyebrow admin-catalog-card-eyebrow-gold text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
                {workshop.badge} · Live session
              </p>
              <h4 className="admin-catalog-card-title mt-2 font-serif text-[1.55rem] leading-tight">{workshop.title}</h4>
            </div>
            <WorkshopStatusBadge published={workshop.published} fillPercent={workshop.fillPercent} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="admin-catalog-schedule-date rounded-[1rem] px-4 py-3">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Scheduled</p>
              <p className="mt-1 font-serif text-xl">{workshop.dateLabel}</p>
            </div>
            <div className="admin-catalog-schedule-meta rounded-[1rem] px-4 py-3">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Duration</p>
              <p className="mt-1 text-sm font-medium">{workshop.duration}</p>
            </div>
            <div className="admin-catalog-schedule-meta rounded-[1rem] px-4 py-3">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Price per spot</p>
              <p className="mt-1 font-serif text-xl">{formatCad(workshop.priceCad)}</p>
            </div>
          </div>

          <p className="admin-catalog-card-copy mt-4 text-sm leading-relaxed">{workshop.description}</p>

          <div className="mt-5">
            <SeatMeter booked={workshop.seatsBooked} total={workshop.seatsTotal} fillPercent={workshop.fillPercent} />
          </div>

          <div className="admin-catalog-card-metrics mt-5 grid gap-3 sm:grid-cols-3">
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Spots sold</p>
              <p className="mt-1 font-serif text-xl">{workshop.sold}</p>
            </div>
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Remaining</p>
              <p className="mt-1 font-serif text-xl">{workshop.seatsRemaining}</p>
            </div>
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Revenue</p>
              <p className="mt-1 font-serif text-xl">{formatCad(workshop.revenueCad)}</p>
            </div>
          </div>

          <AdminCatalogCollapsiblePanel label="Edit workshop session">
            <form
              key={`${workshop.id}-${workshop.slug}`}
              action={upsertWorkshopAction}
              className="admin-catalog-form mt-4 rounded-[1rem] p-4"
            >
              <input type="hidden" name="id" value={workshop.id} />
              <div className="grid gap-3 lg:grid-cols-2">
                <AdminField label="Title" name="title" defaultValue={workshop.title} />
                <AdminField label="Slug" name="slug" defaultValue={workshop.slug || workshop.id} />
                <AdminField label="Price per spot (CAD)" name="priceCad" defaultValue={workshop.priceCad} type="number" />
                <AdminField label="Total seats" name="seatsTotal" defaultValue={workshop.seatsTotal} type="number" />
                <AdminField
                  label="Date & time"
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(workshop.scheduledAt)}
                />
                <AdminField label="Duration" name="duration" defaultValue={workshop.duration} />
                <AdminField label="Badge" name="badge" defaultValue={workshop.badge} />
                <AdminCatalogImageField
                  label="Workshop image"
                  defaultImage={workshop.image}
                  defaultAlt={workshop.imageAlt}
                  aspect="16:10"
                />
                <label className="admin-catalog-checkbox flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" defaultChecked={workshop.published} />
                  Published for spot checkout
                </label>
                <div className="lg:col-span-2">
                  <AdminField label="Description" name="description" defaultValue={workshop.description} rows={4} />
                </div>
              </div>
              <div className="mt-4">
                <AdminSubmit label="Save workshop" />
              </div>
            </form>
            <div className="mt-3">
              <AdminDeleteButton
                action={deleteWorkshopFormAction}
                hiddenFields={{ id: workshop.id }}
                itemName={workshop.title}
                title="Delete workshop?"
                description={`This will permanently remove “${workshop.title}” from your schedule and storefront.`}
                label="Delete workshop"
              />
            </div>
          </AdminCatalogCollapsiblePanel>
        </div>

        <div className="admin-catalog-media relative h-[220px] w-full shrink-0 self-start overflow-hidden rounded-[1rem] xl:w-[280px]">
          {workshop.image ? (
            <Image
              src={workshop.image}
              alt={workshop.imageAlt || workshop.title}
              fill
              className="object-cover"
              style={{ objectPosition }}
              sizes="280px"
            />
          ) : (
            <div className="admin-catalog-media-fallback admin-catalog-media-fallback-gold flex h-full flex-col justify-end p-5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] opacity-80">Live workshop</p>
              <p className="mt-2 font-serif text-2xl">{workshop.dateLabel}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function NewWorkshopPanel() {
  return (
    <AdminCatalogCollapsiblePanel
      className="admin-catalog-create-panel admin-catalog-create admin-catalog-create-workshop mt-0 overflow-hidden rounded-[1.35rem]"
      summaryClassName="p-6"
      summary={
        <>
          <p className="admin-catalog-card-eyebrow admin-catalog-card-eyebrow-gold text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
            Schedule new session
          </p>
          <h4 className="admin-catalog-card-title mt-2 font-serif text-[1.6rem]">Create a live workshop</h4>
          <p className="admin-catalog-card-copy mt-2 max-w-2xl text-sm leading-relaxed">
            Set the date, seat capacity, and price per spot. Customers reserve seats through Stripe checkout and each
            booking appears in Orders.
          </p>
        </>
      }
    >
      <div className="admin-catalog-create-body border-t px-6 pb-6 pt-5">
        <form action={upsertWorkshopAction} className="admin-catalog-form rounded-[1rem] p-4">
          <div className="grid gap-3 lg:grid-cols-2">
            <AdminField label="Title" name="title" />
            <AdminField label="Slug" name="slug" />
            <AdminField label="Price per spot (CAD)" name="priceCad" defaultValue={149} type="number" />
            <AdminField label="Total seats" name="seatsTotal" defaultValue={24} type="number" />
            <AdminField
              label="Date & time"
              name="scheduledAt"
              type="datetime-local"
              defaultValue={getDefaultWorkshopScheduleValue()}
            />
            <AdminField label="Duration" name="duration" defaultValue="2 hours · online" />
            <AdminField label="Badge" name="badge" defaultValue="Scheduled Live" />
            <AdminCatalogImageField label="Workshop image" aspect="16:10" />
            <label className="admin-catalog-checkbox flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Published for spot checkout
            </label>
            <div className="lg:col-span-2">
              <AdminField label="Description" name="description" rows={4} />
            </div>
          </div>
          <div className="mt-4">
            <AdminSubmit label="Create workshop" savedLabel="Created" />
          </div>
        </form>
      </div>
    </AdminCatalogCollapsiblePanel>
  );
}

export async function AdminWorkshopsManager() {
  const [{ workshops, stats }, visibility] = await Promise.all([
    getWorkshopAdminOverview(),
    getStorefrontSectionVisibility(),
  ]);

  return (
    <div className="admin-catalog space-y-8">
      <AdminStorefrontVisibilityToggle section="workshops" visible={visibility.showWorkshopsSection} />

      <AdminCatalogHero
        accent="gold"
        eyebrow="Live scheduling"
        title="Workshop sessions"
        description="Schedule live workshops with limited seats. Each spot is sold through secure Stripe checkout and every reservation is tracked in Orders."
        stats={[
          { label: "Scheduled sessions", value: stats.total, detail: "Workshops in your calendar" },
          { label: "Open sessions", value: stats.published, detail: `${stats.draft} drafts` },
          { label: "Spots sold", value: stats.spotsSold, detail: `${stats.seatsRemaining} seats still available` },
          { label: "Workshop revenue", value: stats.revenueCad, detail: `${stats.pendingSpots} pending checkout` },
        ]}
      />

      <NewWorkshopPanel />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">Schedule</p>
            <h4 className="admin-catalog-title mt-1 font-serif text-2xl">Your workshops</h4>
            <p className="admin-catalog-copy mt-2 text-sm">Sorted automatically by date and time — earliest sessions appear first.</p>
          </div>
          <Link
            href="/admin/orders"
            className="admin-catalog-inline-link inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
          >
            Open orders
          </Link>
        </div>

        <div className="space-y-5">
          {workshops.length > 0 ? (
            workshops.map((workshop) => <WorkshopCard key={workshop.id} workshop={workshop} />)
          ) : (
            <div className="admin-catalog-empty rounded-[1.25rem] p-8 text-center">
              <p className="font-serif text-2xl">No workshops scheduled</p>
              <p className="admin-catalog-copy mt-2 text-sm">Open Schedule new session above to create your first workshop.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
