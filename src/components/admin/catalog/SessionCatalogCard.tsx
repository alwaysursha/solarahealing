import Image from "next/image";
import { AdminCatalogCollapsiblePanel } from "@/components/admin/catalog/AdminCatalogCollapsiblePanel";
import { AdminImageFocusField } from "@/components/admin/catalog/AdminImageFocusField";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminField, AdminSubmit } from "@/components/admin/AdminShell";
import { deletePrivateSessionFormAction, upsertPrivateSessionAction } from "@/lib/admin/actions";
import { formatCad, type PrivateSessionWithSales } from "@/lib/admin/catalog-stats";
import { toImageObjectPosition } from "@/lib/image-focus";

function SessionStatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={[
        "admin-catalog-badge inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]",
        published ? "admin-catalog-badge-live" : "admin-catalog-badge-draft",
      ].join(" ")}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function SessionCatalogCard({ session }: { session: PrivateSessionWithSales }) {
  const objectPosition = toImageObjectPosition(session.imageFocusX, session.imageFocusY);

  return (
    <article className="admin-catalog-card admin-catalog-card-course group relative min-w-0 flex-1 overflow-hidden rounded-[1.35rem]">
      <div className="admin-catalog-card-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1] grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5">
        <div className="admin-catalog-media relative h-[180px] w-full shrink-0 self-start overflow-hidden rounded-[1rem] sm:h-[200px] lg:h-[180px]">
          {session.image ? (
            <Image
              src={session.image}
              alt={session.imageAlt || session.title}
              fill
              className="object-cover"
              style={{ objectPosition }}
              sizes="220px"
            />
          ) : (
            <div className="admin-catalog-media-fallback flex h-full items-end p-4">
              <p className="font-serif text-lg">Private session</p>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="admin-catalog-card-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
                Private session · One-to-one
              </p>
              <h4 className="admin-catalog-card-title mt-2 font-serif text-[1.45rem] leading-tight">{session.title}</h4>
            </div>
            <SessionStatusBadge published={session.published} />
          </div>

          <p className="admin-catalog-card-copy mt-3 line-clamp-2 text-sm leading-relaxed">{session.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="admin-catalog-chip rounded-full px-3 py-1 text-xs">{session.duration}</span>
            <span className="admin-catalog-chip admin-catalog-chip-price rounded-full px-3 py-1 text-xs font-semibold">
              {formatCad(session.priceCad)}
            </span>
          </div>

          <div className="admin-catalog-card-metrics mt-5 grid gap-3 sm:grid-cols-3">
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Checkout price</p>
              <p className="mt-1 font-serif text-xl">{formatCad(session.priceCad)}</p>
            </div>
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Bookings</p>
              <p className="mt-1 font-serif text-xl">{session.sold}</p>
            </div>
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Revenue</p>
              <p className="mt-1 font-serif text-xl">{formatCad(session.revenueCad)}</p>
            </div>
          </div>

          <AdminCatalogCollapsiblePanel label="Edit session">
            <form
              key={`${session.id}-${session.slug}`}
              action={upsertPrivateSessionAction}
              className="admin-catalog-form mt-4 rounded-[1rem] p-4"
            >
              <input type="hidden" name="id" value={session.id} />
              <div className="grid gap-3 lg:grid-cols-2">
                <AdminField label="Title" name="title" defaultValue={session.title} />
                <AdminField label="Slug" name="slug" defaultValue={session.slug || session.id} />
                <AdminField label="Price (CAD)" name="priceCad" defaultValue={session.priceCad} type="number" />
                <AdminField label="Duration" name="duration" defaultValue={session.duration} />
                <AdminField label="Image URL" name="image" defaultValue={session.image} />
                <AdminField label="Image alt" name="imageAlt" defaultValue={session.imageAlt} />
                <AdminImageFocusField
                  imageUrl={session.image}
                  imageAlt={session.imageAlt}
                  defaultFocusX={session.imageFocusX}
                  defaultFocusY={session.imageFocusY}
                />
                <label className="admin-catalog-checkbox flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" defaultChecked={session.published} />
                  Published on storefront
                </label>
                <div className="lg:col-span-2">
                  <AdminField label="Description" name="description" defaultValue={session.description} rows={4} />
                </div>
              </div>
              <div className="mt-4">
                <AdminSubmit label="Save session" />
              </div>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={`/sessions/${session.slug}`}
                target="_blank"
                rel="noreferrer"
                className="admin-catalog-inline-link inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
              >
                View storefront
              </a>
              <AdminDeleteButton
                action={deletePrivateSessionFormAction}
                hiddenFields={{ id: session.id }}
                itemName={session.title}
                title="Delete private session?"
                description={`This will permanently remove “${session.title}” from your catalog and storefront.`}
                label="Delete session"
              />
            </div>
          </AdminCatalogCollapsiblePanel>
        </div>
      </div>
    </article>
  );
}
