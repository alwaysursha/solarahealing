export function toDatetimeLocalValue(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatWorkshopScheduleLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function parseWorkshopScheduleInput(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid workshop schedule");
  }
  return parsed;
}

export function getDefaultWorkshopScheduleValue() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  date.setHours(10, 0, 0, 0);
  return toDatetimeLocalValue(date);
}

export const WORKSHOP_SCHEDULE_SEEDS: Record<string, string> = {
  "reiki-foundations": "2026-01-18T10:00:00",
  "chakra-masterclass": "2026-01-26T18:00:00",
  "distance-reiki": "2026-01-31T13:00:00",
  "meditation-circle": "2026-02-05T19:30:00",
};
