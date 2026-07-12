import Image from "next/image";
import { AdminCatalogCollapsiblePanel } from "@/components/admin/catalog/AdminCatalogCollapsiblePanel";
import { AdminImageFocusField } from "@/components/admin/catalog/AdminImageFocusField";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminField, AdminSubmit } from "@/components/admin/AdminShell";
import { deleteCourseFormAction, upsertCourseAction } from "@/lib/admin/actions";
import { formatCad, type CourseWithSales } from "@/lib/admin/catalog-stats";
import { toImageObjectPosition } from "@/lib/image-focus";

function CourseStatusBadge({ published }: { published: boolean }) {
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

export function CourseCatalogCard({ course }: { course: CourseWithSales }) {
  const objectPosition = toImageObjectPosition(course.imageFocusX, course.imageFocusY);

  return (
    <article className="admin-catalog-card admin-catalog-card-course group relative min-w-0 flex-1 overflow-hidden rounded-[1.35rem]">
      <div className="admin-catalog-card-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-[1] grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5">
        <div className="admin-catalog-media relative h-[180px] w-full shrink-0 self-start overflow-hidden rounded-[1rem] sm:h-[200px] lg:h-[180px]">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.imageAlt || course.title}
              fill
              className="object-cover"
              style={{ objectPosition }}
              sizes="220px"
            />
          ) : (
            <div className="admin-catalog-media-fallback flex h-full items-end p-4">
              <p className="font-serif text-lg">{course.level}</p>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="admin-catalog-card-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.24em]">
                {course.badge} · {course.level}
              </p>
              <h4 className="admin-catalog-card-title mt-2 font-serif text-[1.45rem] leading-tight">{course.title}</h4>
            </div>
            <CourseStatusBadge published={course.published} />
          </div>

          <p className="admin-catalog-card-copy mt-3 line-clamp-2 text-sm leading-relaxed">{course.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="admin-catalog-chip rounded-full px-3 py-1 text-xs">{course.dateLabel}</span>
            <span className="admin-catalog-chip rounded-full px-3 py-1 text-xs">{course.duration}</span>
            <span className="admin-catalog-chip admin-catalog-chip-price rounded-full px-3 py-1 text-xs font-semibold">
              {formatCad(course.priceCad)}
            </span>
          </div>

          <div className="admin-catalog-card-metrics mt-5 grid gap-3 sm:grid-cols-3">
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Checkout price</p>
              <p className="mt-1 font-serif text-xl">{formatCad(course.priceCad)}</p>
            </div>
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Units sold</p>
              <p className="mt-1 font-serif text-xl">{course.sold}</p>
            </div>
            <div className="admin-catalog-metric rounded-xl px-3 py-2.5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] opacity-70">Revenue</p>
              <p className="mt-1 font-serif text-xl">{formatCad(course.revenueCad)}</p>
            </div>
          </div>

          <AdminCatalogCollapsiblePanel label="Edit course">
            <form action={upsertCourseAction} className="admin-catalog-form mt-4 rounded-[1rem] p-4">
              <input type="hidden" name="id" value={course.id} />
              <div className="grid gap-3 lg:grid-cols-2">
                <AdminField label="Title" name="title" defaultValue={course.title} />
                <AdminField label="Level" name="level" defaultValue={course.level} />
                <AdminField label="Price (CAD)" name="priceCad" defaultValue={course.priceCad} type="number" />
                <AdminField label="Badge" name="badge" defaultValue={course.badge} />
                <AdminField label="Date label" name="dateLabel" defaultValue={course.dateLabel} />
                <AdminField label="Duration" name="duration" defaultValue={course.duration} />
                <AdminField label="Image URL" name="image" defaultValue={course.image} />
                <AdminField label="Image alt" name="imageAlt" defaultValue={course.imageAlt} />
                <AdminImageFocusField
                  imageUrl={course.image}
                  imageAlt={course.imageAlt}
                  defaultFocusX={course.imageFocusX}
                  defaultFocusY={course.imageFocusY}
                />
                <label className="admin-catalog-checkbox flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" defaultChecked={course.published} />
                  Published on storefront
                </label>
                <div className="lg:col-span-2">
                  <AdminField label="Description" name="description" defaultValue={course.description} rows={4} />
                </div>
              </div>
              <div className="mt-4">
                <AdminSubmit label="Save course" />
              </div>
            </form>
            <div className="mt-3">
              <AdminDeleteButton
                action={deleteCourseFormAction}
                hiddenFields={{ id: course.id }}
                itemName={course.title}
                title="Delete course?"
                description={`This will permanently remove “${course.title}” from your catalog and storefront.`}
                label="Delete course"
              />
            </div>
          </AdminCatalogCollapsiblePanel>
        </div>
      </div>
    </article>
  );
}
