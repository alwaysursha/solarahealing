"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CourseCatalogCard } from "@/components/admin/catalog/CourseCatalogCard";
import { reorderCoursesAction } from "@/lib/admin/actions";
import type { CourseWithSales } from "@/lib/admin/catalog-stats";

function DragHandleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M7 5h6M7 10h6M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AdminCourseDragList({ courses: initialCourses }: { courses: CourseWithSales[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  const reorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return courses;
    const next = [...courses];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setCourses(next);
    return next;
  };

  const persistOrder = (nextCourses: CourseWithSales[]) => {
    startTransition(async () => {
      await reorderCoursesAction(nextCourses.map((course) => course.id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="admin-catalog-drag-hint flex flex-wrap items-center justify-between gap-3 rounded-[1rem] px-4 py-3">
        <p className="text-sm">
          <span className="font-semibold">Drag to reorder.</span>{" "}
          <span className="admin-catalog-copy">Course order in admin matches the storefront display.</span>
        </p>
        {isPending ? (
          <span className="admin-catalog-drag-status text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
            Saving order…
          </span>
        ) : null}
      </div>

      {courses.map((course, index) => {
        const isDragging = dragIndex === index;
        const isDropTarget = overIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={course.id}
            onDragOver={(event) => {
              event.preventDefault();
              setOverIndex(index);
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex === null) return;
              const next = reorder(dragIndex, index);
              setDragIndex(null);
              setOverIndex(null);
              persistOrder(next);
            }}
            className={[
              "admin-catalog-drag-item flex items-stretch gap-3 transition-all duration-200",
              isDragging ? "admin-catalog-drag-item-active opacity-70" : "",
              isDropTarget ? "admin-catalog-drag-item-target" : "",
            ].join(" ")}
          >
            <button
              type="button"
              draggable
              aria-label={`Drag to reorder ${course.title}`}
              className="admin-catalog-drag-handle mt-1 flex h-11 w-11 shrink-0 cursor-grab items-center justify-center rounded-2xl border active:cursor-grabbing"
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
            >
              <DragHandleIcon />
            </button>
            <CourseCatalogCard course={course} />
          </div>
        );
      })}
    </div>
  );
}
