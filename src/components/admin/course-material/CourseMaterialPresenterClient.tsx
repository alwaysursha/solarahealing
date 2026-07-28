"use client";

import dynamic from "next/dynamic";
import type { CourseMaterialDeck } from "@/lib/admin/course-material";

/** Loads the heavy presenter only in the browser (keeps Worker SSR bundle smaller). */
const CourseMaterialPresenter = dynamic(
  () =>
    import("@/components/admin/course-material/CourseMaterialPresenter").then(
      (mod) => mod.CourseMaterialPresenter,
    ),
  { ssr: false },
);

export function CourseMaterialPresenterClient({ deck }: { deck: CourseMaterialDeck }) {
  return <CourseMaterialPresenter deck={deck} />;
}
