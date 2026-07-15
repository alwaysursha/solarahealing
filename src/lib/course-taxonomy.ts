import type { CourseCategory, CourseLevel } from "@prisma/client";

export const COURSE_CATEGORIES = ["REIKI", "NON_REIKI"] as const satisfies readonly CourseCategory[];

export const COURSE_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "MASTER",
] as const satisfies readonly CourseLevel[];

export function courseCategoryLabel(category: CourseCategory | string | null | undefined): string {
  switch (category) {
    case "NON_REIKI":
      return "Non-Reiki Course";
    case "REIKI":
    default:
      return "Reiki Course";
  }
}

export function courseLevelLabel(level: CourseLevel | string | null | undefined): string {
  switch (level) {
    case "INTERMEDIATE":
      return "Intermediate";
    case "ADVANCED":
      return "Advanced";
    case "MASTER":
      return "Master";
    case "BEGINNER":
    default:
      return "Beginner";
  }
}

export function parseCourseCategory(value: FormDataEntryValue | string | null | undefined): CourseCategory {
  const raw = value?.toString().trim().toUpperCase();
  if (raw === "NON_REIKI") return "NON_REIKI";
  return "REIKI";
}

export function parseCourseLevel(value: FormDataEntryValue | string | null | undefined): CourseLevel {
  const raw = value?.toString().trim().toUpperCase();
  switch (raw) {
    case "INTERMEDIATE":
      return "INTERMEDIATE";
    case "ADVANCED":
      return "ADVANCED";
    case "MASTER":
      return "MASTER";
    case "BEGINNER":
    default:
      return "BEGINNER";
  }
}

/** Map legacy free-text levels from older catalog data. */
export function mapLegacyCourseLevel(value: string | null | undefined): CourseLevel {
  const raw = value?.toString().trim().toLowerCase() ?? "";
  if (raw.includes("master")) return "MASTER";
  if (raw.includes("advanced") || raw.includes("advance")) return "ADVANCED";
  if (raw.includes("intermediate") || raw.includes("practitioner") || raw.includes("energy")) {
    return "INTERMEDIATE";
  }
  return "BEGINNER";
}

export function inferCourseCategory(title: string, level?: string | null): CourseCategory {
  const haystack = `${title} ${level ?? ""}`.toLowerCase();
  if (
    haystack.includes("reiki") ||
    haystack.includes("attunement") ||
    haystack.includes("symbol") ||
    haystack.includes("master")
  ) {
    return "REIKI";
  }
  return "NON_REIKI";
}
