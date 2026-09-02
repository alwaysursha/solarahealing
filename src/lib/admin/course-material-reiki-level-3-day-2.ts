import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const brandLogo = {
  src: "/course-material/reiki-level-1/cover-logo.png",
  alt: "Soulara Healing Training Academy",
  width: 939,
  height: 271,
} as const;

export const reikiLevel3Day2: CourseMaterialDeck = {
  slug: "reiki-level-3-day-2",
  title: "Reiki Level 3",
  series: "Reiki Level 3",
  dayLabel: "Day 2",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "draft",
  description:
    "Day 2 of the two-day Reiki Level 3 certification — psychic surgery visualization, cord-cutting, attunement, 21-day integration, ethics, and the Inner Master closing. Slides awaiting build-out.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Day 2 · The Advanced Healer · Two-day certification",
      title: "Reiki Level 3",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Reiki Level 3",
      subtitle: "The Advanced Healer — Day 2 of your certification journey",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "From practitioner to presence…",
      duration: "Day 2",
      teacherImage: {
        src: "/about/vanita-portrait-v3.jpg",
        alt: "Vanita Bassi, founder of Soulara Healing Academy",
        width: 1200,
        height: 1500,
      },
    },
    {
      kind: "bullets",
      eyebrow: "Coming next",
      title: "Day 2 content",
      lead: "This day is ready for your teaching slides from the Level 3 Day 2 curriculum.",
      items: [
        "Psychic surgery as guided visualization",
        "Cord-cutting / energetic boundary practice",
        "Level 3 attunement",
        "21-day integration practice",
        "Ethics of an advanced Reiki practitioner",
        "The Reiki Master mindset — presence before power",
        "Soulara Healing™ Reiki Level 3 Practitioner Certificate",
      ],
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, ask anything, and celebrate this deeper step on your Reiki path.",
    },
  ],
};
