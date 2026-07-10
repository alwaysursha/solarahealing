import { asc } from "drizzle-orm";
import { db, onlineCourses, workshops } from "@/db";
import {
  AdminField,
  AdminPanel,
  AdminShell,
  AdminSubmit,
} from "@/components/admin/AdminShell";
import {
  deleteCourseAction,
  deleteWorkshopAction,
  upsertCourseAction,
  upsertWorkshopAction,
} from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [courses, workshopRows] = await Promise.all([
    db.select().from(onlineCourses).orderBy(asc(onlineCourses.sortOrder)),
    db.select().from(workshops).orderBy(asc(workshops.sortOrder)),
  ]);

  return (
    <AdminShell
      activePath="/admin/courses"
      title="Courses & Workshops"
      description="Add, edit, or remove online courses and live workshops. Set pricing and workshop seat capacity."
    >
      <div className="space-y-8">
        <AdminPanel title="Online courses">
          <div className="space-y-6">
            {courses.map((course) => (
              <form key={course.id} action={upsertCourseAction} className="rounded-xl border border-purple-deep/10 p-4">
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
                  <AdminField label="Sort order" name="sortOrder" defaultValue={course.sortOrder} type="number" />
                  <label className="flex items-center gap-2 text-sm text-purple-deep/75">
                    <input type="checkbox" name="published" defaultChecked={course.published} />
                    Published
                  </label>
                  <div className="lg:col-span-2">
                    <AdminField label="Description" name="description" defaultValue={course.description} rows={3} />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <AdminSubmit label="Save course" />
                </div>
              </form>
            ))}

            <form action={upsertCourseAction} className="rounded-xl border border-dashed border-gold/40 p-4">
              <p className="mb-4 text-sm font-medium text-purple-deep/70">Add new course</p>
              <div className="grid gap-3 lg:grid-cols-2">
                <AdminField label="Title" name="title" />
                <AdminField label="Level" name="level" defaultValue="Foundations" />
                <AdminField label="Price (CAD)" name="priceCad" defaultValue={199} type="number" />
                <AdminField label="Badge" name="badge" defaultValue="On Demand" />
                <AdminField label="Date label" name="dateLabel" defaultValue="Start anytime" />
                <AdminField label="Duration" name="duration" defaultValue="8 modules · self-paced" />
                <AdminField label="Image URL" name="image" />
                <AdminField label="Image alt" name="imageAlt" />
                <label className="flex items-center gap-2 text-sm text-purple-deep/75">
                  <input type="checkbox" name="published" defaultChecked />
                  Published
                </label>
                <div className="lg:col-span-2">
                  <AdminField label="Description" name="description" rows={3} />
                </div>
              </div>
              <div className="mt-4">
                <AdminSubmit label="Create course" />
              </div>
            </form>
          </div>

          {courses.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {courses.map((course) => (
                <form
                  key={`delete-${course.id}`}
                  action={async () => {
                    "use server";
                    await deleteCourseAction(course.id);
                  }}
                >
                  <button type="submit" className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700">
                    Delete {course.title}
                  </button>
                </form>
              ))}
            </div>
          ) : null}
        </AdminPanel>

        <AdminPanel title="Live workshops">
          <div className="space-y-6">
            {workshopRows.map((workshop) => (
              <form key={workshop.id} action={upsertWorkshopAction} className="rounded-xl border border-purple-deep/10 p-4">
                <input type="hidden" name="id" value={workshop.id} />
                <div className="grid gap-3 lg:grid-cols-2">
                  <AdminField label="Title" name="title" defaultValue={workshop.title} />
                  <AdminField label="Price per seat (CAD)" name="priceCad" defaultValue={workshop.priceCad} type="number" />
                  <AdminField label="Total seats" name="seatsTotal" defaultValue={workshop.seatsTotal} type="number" />
                  <AdminField label="Date label" name="dateLabel" defaultValue={workshop.dateLabel} />
                  <AdminField label="Duration" name="duration" defaultValue={workshop.duration} />
                  <AdminField label="Badge" name="badge" defaultValue={workshop.badge} />
                  <AdminField label="Image URL" name="image" defaultValue={workshop.image} />
                  <AdminField label="Image alt" name="imageAlt" defaultValue={workshop.imageAlt} />
                  <label className="flex items-center gap-2 text-sm text-purple-deep/75">
                    <input type="checkbox" name="published" defaultChecked={workshop.published} />
                    Published
                  </label>
                  <div className="lg:col-span-2">
                    <AdminField label="Description" name="description" defaultValue={workshop.description} rows={3} />
                  </div>
                </div>
                <p className="mt-2 text-xs text-purple-deep/50">
                  {workshop.seatsBooked} of {workshop.seatsTotal} seats booked
                </p>
                <div className="mt-4">
                  <AdminSubmit label="Save workshop" />
                </div>
              </form>
            ))}

            <form action={upsertWorkshopAction} className="rounded-xl border border-dashed border-gold/40 p-4">
              <p className="mb-4 text-sm font-medium text-purple-deep/70">Add new workshop</p>
              <div className="grid gap-3 lg:grid-cols-2">
                <AdminField label="Title" name="title" />
                <AdminField label="Price per seat (CAD)" name="priceCad" defaultValue={149} type="number" />
                <AdminField label="Total seats" name="seatsTotal" defaultValue={24} type="number" />
                <AdminField label="Date label" name="dateLabel" />
                <AdminField label="Duration" name="duration" defaultValue="2 hours · online" />
                <AdminField label="Badge" name="badge" defaultValue="Scheduled Live" />
                <AdminField label="Image URL" name="image" />
                <AdminField label="Image alt" name="imageAlt" />
                <label className="flex items-center gap-2 text-sm text-purple-deep/75">
                  <input type="checkbox" name="published" defaultChecked />
                  Published
                </label>
                <div className="lg:col-span-2">
                  <AdminField label="Description" name="description" rows={3} />
                </div>
              </div>
              <div className="mt-4">
                <AdminSubmit label="Create workshop" />
              </div>
            </form>
          </div>

          {workshopRows.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {workshopRows.map((workshop) => (
                <form
                  key={`delete-w-${workshop.id}`}
                  action={async () => {
                    "use server";
                    await deleteWorkshopAction(workshop.id);
                  }}
                >
                  <button type="submit" className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-700">
                    Delete {workshop.title}
                  </button>
                </form>
              ))}
            </div>
          ) : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
