import Link from "next/link";
import { AdminCatalogImageField } from "@/components/admin/AdminCatalogImageField";
import { AdminCatalogCollapsiblePanel } from "@/components/admin/catalog/AdminCatalogCollapsiblePanel";
import { AdminField, AdminSelect, AdminSubmit } from "@/components/admin/AdminShell";
import { AdminCatalogHero } from "@/components/admin/catalog/AdminCatalogHero";
import { AdminCourseDragList } from "@/components/admin/catalog/AdminCourseDragList";
import { AdminStorefrontVisibilityToggle } from "@/components/admin/catalog/AdminStorefrontVisibilityToggle";
import { upsertCourseAction } from "@/lib/admin/actions";
import { getCourseAdminOverview } from "@/lib/admin/catalog-stats";
import { getStorefrontSectionVisibility } from "@/lib/content";
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  courseCategoryLabel,
  courseLevelLabel,
} from "@/lib/course-taxonomy";

const categoryOptions = COURSE_CATEGORIES.map((value) => ({
  value,
  label: courseCategoryLabel(value),
}));

const levelOptions = COURSE_LEVELS.map((value) => ({
  value,
  label: courseLevelLabel(value),
}));

function NewCoursePanel() {
  return (
    <AdminCatalogCollapsiblePanel
      className="admin-catalog-create-panel admin-catalog-create admin-catalog-create-course mt-0 overflow-hidden rounded-[1.35rem]"
      summaryClassName="p-6"
      summary={
        <>
          <p className="admin-catalog-card-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.24em]">New listing</p>
          <h4 className="admin-catalog-card-title mt-2 font-serif text-[1.6rem]">Create a course for checkout</h4>
          <p className="admin-catalog-card-copy mt-2 max-w-2xl text-sm leading-relaxed">
            Add an on-demand program with pricing. Customers purchase through Stripe checkout and the order lands in
            Orders.
          </p>
        </>
      }
    >
      <div className="admin-catalog-create-body border-t px-6 pb-6 pt-5">
        <form action={upsertCourseAction} className="admin-catalog-form rounded-[1rem] p-4">
          <div className="grid gap-3 lg:grid-cols-2">
            <AdminField label="Title" name="title" />
            <AdminField label="Slug" name="slug" />
            <AdminSelect label="Category" name="category" defaultValue="REIKI" options={categoryOptions} />
            <AdminSelect label="Pathway level" name="level" defaultValue="BEGINNER" options={levelOptions} />
            <AdminField label="Price (CAD)" name="priceCad" defaultValue={199} type="number" />
            <AdminField label="Date label" name="dateLabel" defaultValue="Start anytime" />
            <AdminField label="Duration" name="duration" defaultValue="8 modules · self-paced" />
            <AdminCatalogImageField label="Course image" aspect="16:10" />
            <label className="admin-catalog-checkbox flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Published on storefront
            </label>
            <div className="lg:col-span-2">
              <AdminField label="Description" name="description" rows={4} />
            </div>
          </div>
          <div className="mt-4">
            <AdminSubmit label="Create course" savedLabel="Created" />
          </div>
        </form>
      </div>
    </AdminCatalogCollapsiblePanel>
  );
}

export async function AdminCoursesManager() {
  const [{ courses, stats }, visibility] = await Promise.all([
    getCourseAdminOverview(),
    getStorefrontSectionVisibility(),
  ]);

  return (
    <div className="admin-catalog space-y-8">
      <AdminStorefrontVisibilityToggle section="courses" visible={visibility.showCoursesSection} />

      <AdminCatalogHero
        accent="purple"
        eyebrow="Digital catalog"
        title="Online courses"
        description="Build your on-demand course catalog. Each listing is sold through secure Stripe checkout and every purchase is tracked in Orders."
        stats={[
          { label: "Total courses", value: stats.total, detail: "Programs in your catalog" },
          { label: "Published", value: stats.published, detail: "Live on the storefront" },
          { label: "Units sold", value: stats.unitsSold, detail: `${stats.pendingUnits} pending checkout` },
          { label: "Course revenue", value: stats.revenueCad, detail: "Paid and completed orders" },
        ]}
      />

      <NewCoursePanel />

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="admin-catalog-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">Catalog</p>
            <h4 className="admin-catalog-title mt-1 font-serif text-2xl">Your courses</h4>
          </div>
          <Link
            href="/admin/orders"
            className="admin-catalog-inline-link inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
          >
            Open orders
          </Link>
        </div>

        {courses.length > 0 ? (
          <AdminCourseDragList courses={courses} />
        ) : (
          <div className="admin-catalog-empty rounded-[1.25rem] p-8 text-center">
            <p className="font-serif text-2xl">No courses yet</p>
            <p className="admin-catalog-copy mt-2 text-sm">Open New listing above to create your first course.</p>
          </div>
        )}
      </section>
    </div>
  );
}
