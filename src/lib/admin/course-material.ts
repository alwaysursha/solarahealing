export type CourseMaterialSlide =
  | {
      kind: "session-start";
      eyebrow: string;
      title: string;
      logo: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "cover";
      eyebrow: string;
      title: string;
      subtitle: string;
      teacher: string;
      teacherRoles: string;
      journeyLine: string;
      duration: string;
      logo?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "bullets";
      eyebrow?: string;
      title: string;
      lead?: string;
      items: readonly string[];
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "quote";
      eyebrow?: string;
      title: string;
      quote: string;
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "definition";
      eyebrow?: string;
      title: string;
      lead?: string;
      columns: readonly {
        term: string;
        meaning: string;
        points: readonly string[];
      }[];
      result: string;
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "impact-grid";
      eyebrow?: string;
      title: string;
      items: readonly string[];
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    };

export type CourseMaterialDeck = {
  slug: string;
  title: string;
  duration: string;
  description: string;
  slides: readonly CourseMaterialSlide[];
};

export const introductionToReiki: CourseMaterialDeck = {
  slug: "introduction-to-reiki",
  title: "Introduction to Reiki",
  duration: "60 Minutes",
  description:
    "Discover the ancient healing energy that can transform your life — a welcoming overview for new students.",
  slides: [
    {
      kind: "session-start",
      eyebrow: "Course",
      title: "Introduction to Reiki",
      logo: {
        src: "/course-material/introduction-to-reiki/cover-logo.png",
        alt: "Soulara Healing Training Academy",
        width: 939,
        height: 271,
      },
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Welcome to Soulara Healing",
      subtitle: "Discover the Ancient Healing Energy That Can Transform Your Life",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "My healing journey…",
      duration: "60 Minutes",
      logo: {
        src: "/course-material/introduction-to-reiki/cover-logo.png",
        alt: "Soulara Healing Training Academy",
        width: 939,
        height: 271,
      },
    },
    {
      kind: "bullets",
      eyebrow: "Course Vision",
      title: "By the end of this class",
      lead: "Students will:",
      items: [
        "Understand what Reiki really is.",
        "Learn the science and philosophy behind energy healing.",
        "Discover how energy influences health, emotions and relationships.",
        "Understand chakras and the aura.",
        "Experience a guided meditation.",
        "Learn how Reiki is traditionally received through attunement.",
        "Know what they will learn inside Soulara Reiki Level 1, 2 and 3.",
      ],
      image: {
        src: "/course-material/introduction-to-reiki/course-vision.png",
        alt: "Hands channeling radiant healing light",
        width: 1024,
        height: 680,
      },
    },
    {
      kind: "quote",
      eyebrow: "Opening",
      title: "What brought you here today?",
      quote:
        "Every healing journey begins with one decision—to become open to possibility.",
      image: {
        src: "/course-material/introduction-to-reiki/what-brought-you-dark.png",
        alt: "Reasons people begin a healing journey",
        width: 1072,
        height: 552,
      },
    },
    {
      kind: "definition",
      eyebrow: "Foundations",
      title: "What is Reiki?",
      lead: "The word Reiki comes from the Japanese language.",
      columns: [
        {
          term: "Rei",
          meaning: "Universal",
          points: [
            "Universal Wisdom",
            "Divine Intelligence",
            "Higher Consciousness",
            "Sacred Energy",
          ],
        },
        {
          term: "Ki",
          meaning: "Energy",
          points: [
            "Life Force Energy",
            "The invisible energy flowing through every living being.",
          ],
        },
      ],
      result: "Together, Reiki means: Universal Life Force Energy.",
      image: {
        src: "/course-material/introduction-to-reiki/what-is-reiki.png",
        alt: "Hand holding radiant universal life force energy",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "impact-grid",
      eyebrow: "Energy Awareness",
      title: "When blocked, we experience",
      items: [
        "Stress",
        "Anxiety",
        "Disease",
        "Fear",
        "Fatigue",
        "Negative thinking",
      ],
      image: {
        src: "/course-material/introduction-to-reiki/when-blocked-original.png",
        alt: "When energy is blocked, we experience",
        width: 1024,
        height: 554,
      },
    },
  ],
};

export const courseMaterialDecks: readonly CourseMaterialDeck[] = [introductionToReiki];

export function getCourseMaterialDeck(slug: string): CourseMaterialDeck | undefined {
  return courseMaterialDecks.find((deck) => deck.slug === slug);
}
