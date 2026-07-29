import {
  introductionCoursePricingSlide,
  introductionMindBodySoulSlides,
  introductionQuestionsSlide,
} from "@/lib/admin/course-material-introduction-mind-body-soul";
import { reikiLevel1Day1 } from "@/lib/admin/course-material-reiki-level-1-day-1";
import { reikiLevel1Day2 } from "@/lib/admin/course-material-reiki-level-1-day-2";

export type CourseMaterialSlide =
  | {
      kind: "session-start";
      eyebrow: string;
      title: string;
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
      teacherImage?: {
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
      kind: "life-force";
      eyebrow?: string;
      lead: string;
      title: string;
      principles: readonly string[];
      open: {
        lead: string;
        items: readonly string[];
      };
      blocked: {
        lead: string;
        items: readonly string[];
      };
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "story";
      eyebrow?: string;
      title: string;
      paragraphs: readonly string[];
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
      imageCaption?: string;
    }
  | {
      kind: "significance";
      eyebrow?: string;
      title: string;
      lead: string;
      bodiesTitle: string;
      bodies: readonly string[];
      benefitsTitle: string;
      benefits: readonly string[];
    }
  | {
      kind: "energy";
      eyebrow?: string;
      title: string;
      lead: string;
      einstein: string;
      principles: readonly string[];
      closing: string;
    }
  | {
      kind: "reiki-energy";
      eyebrow?: string;
      title: string;
      lead: string;
      paragraphs: readonly string[];
      closing: string;
      image: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "reiki-activation";
      eyebrow?: string;
      title: string;
      lead: string;
      stepsTitle: string;
      steps: readonly string[];
      closing: string;
      image: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "chakra-system";
      eyebrow?: string;
      title: string;
      lead: string;
      stats: readonly {
        value: string;
        label: string;
      }[];
      visuals: readonly {
        src: string;
        alt: string;
        width: number;
        height: number;
        caption: string;
      }[];
    }
  | {
      kind: "chakras-guide";
    }
  | {
      kind: "balancing-chakras";
    }
  | {
      kind: "meditation";
      title: string;
      whyTitle: string;
      reasons: readonly string[];
      practice: string;
      closing: string;
      image: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "aura";
      title: string;
      lead: string;
      image: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "aura-reading";
      title: string;
      steps: readonly {
        title: string;
        text: string;
      }[];
    }
  | {
      kind: "beyond-reiki";
      title: string;
      subtitle: string;
      points: readonly string[];
      image: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "reiki-path";
      title: string;
      lead: string;
      intro: string;
      programs: readonly {
        name: string;
        tagline: string;
        text: string;
        image: {
          src: string;
          alt: string;
          width: number;
          height: number;
        };
      }[];
      closing: string;
    }
  | {
      kind: "image-focus";
      eyebrow?: string;
      title?: string;
      caption?: string;
      image: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
    }
  | {
      kind: "topic-sections";
      eyebrow?: string;
      title: string;
      lead?: string;
      image?: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
      sections: readonly {
        heading: string;
        /** Optional course/product name shown as a secondary heading above `text`. */
        subheading?: string;
        items?: readonly string[];
        text?: string;
        /** Elevates copy for ceremonial moments (e.g. certificate presentation). */
        tone?: "honor";
      }[];
      closing?: string;
    }
  | {
      kind: "practitioner-responsibility";
      eyebrow: string;
      paragraphs: readonly string[];
      sessionTitle: string;
      sessionIncludes: readonly string[];
      importantTitle: string;
      important: readonly string[];
      principles: readonly {
        heading: string;
        text: string;
      }[];
    }
  | {
      kind: "course-pricing";
      eyebrow?: string;
      title: string;
      banner: string;
      lead?: string;
      items: readonly {
        name: string;
        /** Fallback / list price shown on the slide when catalog is unavailable. */
        price: string;
        note?: string;
        /** Admin catalog slug used to live-wire price + presentation discount. */
        catalogSlug?: string;
        catalogKind?: "course" | "private_session";
        /** Hydrated from admin; drives the slide % OFF badge. */
        presentationDiscountPercent?: number;
        image: {
          src: string;
          alt: string;
          width: number;
          height: number;
        };
      }[];
    }
  | {
      kind: "questions";
      title: string;
      lead?: string;
    };

export type CourseMaterialDeck = {
  slug: string;
  title: string;
  duration: string;
  description: string;
  /** Groups multi-day courses on the Course Material list. */
  series?: string;
  /** e.g. "Day 1" — shown on list cards and presenter chrome. */
  dayLabel?: string;
  /** Live session countdown length. Defaults to 60 minutes. */
  sessionDurationMinutes?: number;
  /** List UI status when slides are still being authored. */
  status?: "ready" | "draft" | "coming-soon";
  brandLogo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  slides: readonly CourseMaterialSlide[];
};

export const introductionToReiki: CourseMaterialDeck = {
  slug: "introduction-to-reiki",
  title: "Introduction to Reiki",
  duration: "60 Minutes",
  description:
    "Discover the ancient healing energy that can transform your life — a welcoming overview for new students.",
  brandLogo: {
    src: "/course-material/introduction-to-reiki/cover-logo.png",
    alt: "Soulara Healing Training Academy",
    width: 939,
    height: 271,
  },
  slides: [
    {
      kind: "session-start",
      eyebrow: "Course",
      title: "Introduction to Reiki",
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
      teacherImage: {
        src: "/about/vanita-portrait-v3.jpg",
        alt: "Vanita Bassi, founder of Soulara Healing Academy",
        width: 1200,
        height: 1500,
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
      kind: "life-force",
      eyebrow: "Life Force Energy",
      lead: "The invisible energy flowing through every living being.",
      title: "Universal Life Force Energy",
      principles: [
        "Plants grow because of life force.",
        "Animals live because of life force.",
        "Humans breathe because of life force.",
      ],
      open: {
        lead: "When this energy flows freely, we experience",
        items: ["Health", "Peace", "Vitality", "Creativity", "Emotional balance"],
      },
      blocked: {
        lead: "When blocked, we experience",
        items: ["Stress", "Anxiety", "Disease", "Fear", "Fatigue", "Negative thinking"],
      },
      image: {
        src: "/course-material/introduction-to-reiki/blocked-vs-unblocked.png",
        alt: "Blocked versus unblocked energy comparison",
        width: 1024,
        height: 558,
      },
    },
    {
      kind: "story",
      eyebrow: "History",
      title: "Origin of Reiki",
      paragraphs: [
        "Dr. Mikao Usui (1865–1926) was a Japanese scholar and monk who founded Reiki, an alternative energy healing practice.",
        "After a period of intense fasting and meditation on Mount Kurama, Usui developed a system of hands-on palm healing designed to reduce stress, balance energy, and treat physical or emotional ailments.",
        "Reiki originated in Japan (Tokyo), then it spread to Hawaii and now it is recognized worldwide.",
      ],
      image: {
        src: "/course-material/introduction-to-reiki/dr-mikao-usui.png",
        alt: "Dr. Mikao Usui, founder of Reiki",
        width: 1024,
        height: 711,
      },
      imageCaption: "Dr. Mikao Usui · 1865–1926",
    },
    {
      kind: "significance",
      eyebrow: "Why Reiki matters",
      title: "Significance of Reiki",
      lead: "Reiki works on Living and Non-Living Things as everything is Energy.",
      bodiesTitle: "Works on",
      bodies: [
        "Physical body",
        "Mental body",
        "Emotional body",
        "Energetic body",
        "Spiritual awareness",
      ],
      benefitsTitle: "Benefits",
      benefits: [
        "Stress reduction",
        "Deep relaxation",
        "Improved emotional well-being",
        "Better sleep",
        "Greater mental clarity",
        "Support during life transitions",
        "Enhanced sense of inner peace",
        "Improved self-awareness",
        "Greater resilience",
      ],
    },
    {
      kind: "energy",
      eyebrow: "Foundations",
      title: "What is Energy?",
      lead: "Everything is energy.",
      einstein: "Albert Einstein showed that matter and energy are deeply related.",
      principles: [
        "Every thought creates energy.",
        "Every emotion creates vibration.",
        "Every word carries frequency.",
        "Every place stores energy.",
      ],
      closing:
        "Spiritually, energy is the vital life force—often called prana or chi—that animates all living things and connects the universe.",
    },
    {
      kind: "reiki-energy",
      eyebrow: "Practice",
      title: "Reiki Energy",
      lead: "Reiki is traditionally described as universal life-force energy (Prana or Chi).",
      paragraphs: [
        "Reiki practitioners learn methods intended to help them act as a channel for this energy after receiving proper training and attunement in their Reiki lineage.",
        "The practitioner is not believed to “give away” their own energy.",
      ],
      closing: "At Soulara Healing, you learn to facilitate a calm, supportive healing environment.",
      image: {
        src: "/course-material/introduction-to-reiki/reiki-energy-hands.png",
        alt: "Open hands channeling glowing Reiki life-force energy",
        width: 1024,
        height: 1536,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Energy anatomy",
      title: "Ida, Pingala & Sushumna",
      lead:
        "The Kundalini travels throughout your body by way of three energy channels, or nadis. The three nadis are the left channel, the right channel and the center channel. All three work perfectly together to integrate and balance the flow of your Kundalini. Each also plays a specific role in maintaining your emotions, moods and physical health.",
      image: {
        src: "/course-material/introduction-to-reiki/ida-pingala-nadis-portrait.png",
        alt: "Meditation figure showing Ida, Pingala, and Sushumna nadi channels with chakra labels",
        width: 1024,
        height: 1536,
      },
      sections: [
        {
          heading: "Pingala Serpent",
          text: "Represents Nerve Channel — Male, Fire, Solar Element (Venom — Death). Pineal — Pingala related to the opening of the Third Eye.",
        },
        {
          heading: "Ida Serpent",
          text: "Represents Nerve Channel — Female, Water, Lunar Element (Blood — Life). Pituitary — Ida related to the opening of the Third Eye.",
        },
        {
          heading: "Sushumna Nerve Channel",
          text: "Neutral-Zero-Null-Line (Balance) — the center channel that integrates Ida and Pingala.",
        },
        {
          heading: "Chakra Points",
          items: [
            "Crown Chakra / Bindu / Godhead — Point reached during Enlightenment",
            "Thalamus · ‘Third Eye’ — Ajna / Brow Chakra",
            "Chakra Vortices along the spine",
            "Base Chakra — Coccyx of Spine",
          ],
        },
      ],
    },
    {
      kind: "reiki-activation",
      eyebrow: "Practice",
      title: "How is Reiki Activated?",
      lead: "The students receive an attunement from a Reiki Master during Level 1 training.",
      stepsTitle: "Activate Reiki:",
      steps: [
        "Rub Hands Together (Friction & Heat).",
        "Feeling the Ball",
        "Shaking Hands in the Air",
        "Punching or Tapping the Hand Chakras",
      ],
      closing:
        "While today’s class introduces Reiki, the complete practice is learned at Soulara Healing classes during Reiki Level 1, 2 and 3.",
      image: {
        src: "/course-material/introduction-to-reiki/reiki-activation-session.png",
        alt: "Reiki practitioner channeling golden energy above a relaxed recipient",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "chakra-system",
      eyebrow: "Energy anatomy",
      title: "The Chakra System",
      lead:
        "The human body is believed to contain 114 total chakras, which are connected by 72,000 energy pathways (nadis). However, most people refer to the 7 major chakras that run along the spine, starting from the base to the top of the head.",
      stats: [
        { value: "114", label: "Total chakras" },
        { value: "72,000", label: "Energy pathways (nadis)" },
        { value: "7", label: "Major chakras" },
      ],
      visuals: [
        {
          src: "/course-material/introduction-to-reiki/chakra-seven.png",
          alt: "The seven major chakras with Sanskrit and English names",
          width: 1024,
          height: 734,
          caption: "The seven major chakras",
        },
      ],
    },
    {
      kind: "chakras-guide",
    },
    {
      kind: "balancing-chakras",
    },
    {
      kind: "meditation",
      title: "Meditation",
      whyTitle: "Why meditate?",
      reasons: [
        "Calms the nervous system",
        "Improves focus",
        "Enhances self-awareness",
        "Supports emotional regulation",
        "Prepares the mind for Reiki practice",
      ],
      practice: "5–10 minute breath meditation in the morning.",
      closing: "Practice Meditation and Reiki Healing",
      image: {
        src: "/course-material/introduction-to-reiki/meditation-sunset-bg.png",
        alt: "Woman meditating on a stone at sunset",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "aura",
      title: "What is an Aura?",
      lead:
        "An aura consists of seven distinct layers, often called auric bodies. Extending outward from your body, each layer corresponds to a different aspect of your physical, emotional, or spiritual well-being, getting less dense and vibrating at higher frequencies the further out they go.",
      image: {
        src: "/course-material/introduction-to-reiki/aura-seven-layers.png",
        alt: "Meditating figure surrounded by seven labeled aura layers",
        width: 1024,
        height: 558,
      },
    },
    {
      kind: "aura-reading",
      title: "Can You Read an Aura?",
      steps: [
        {
          title: "Find a backdrop",
          text: "Have a person stand against a plain, neutral white or cream wall.",
        },
        {
          title: "Soft focus",
          text: "Do not look directly at the person. Instead, focus gently on the wall about an inch past their shoulder or head.",
        },
        {
          title: "Relax your gaze",
          text: "Allow your eyes to lose sharp focus, letting your peripheral vision take over.",
        },
        {
          title: "Look for the rim",
          text: "You will typically begin to see a thin, clear or milky-white outline form around their body.",
        },
      ],
    },
    {
      kind: "beyond-reiki",
      title: "Beyond Reiki",
      subtitle: "Exploring Past Life Regression for Deeper Healing",
      points: [
        "Understand self on a deeper emotional, energetic, and spiritual level.",
        "Uncover the deeper energetic roots of physical and emotional patterns.",
        "Heal past-life beliefs and relationship challenges.",
        "Journey beyond the physical body for total transformation.",
      ],
      image: {
        src: "/course-material/introduction-to-reiki/beyond-reiki-plr.png",
        alt: "Reiki session opening into a past-life vision portal",
        width: 1024,
        height: 555,
      },
    },
    ...introductionMindBodySoulSlides,
    {
      kind: "reiki-path",
      title: "Your Reiki Journey",
      lead: "Your Reiki journey is the beginning of a deeper exploration of your own energy and consciousness.",
      intro: "As you progress through our advanced programs, you will be introduced to:",
      programs: [
        {
          name: "Reiki Level 1",
          tagline: "The Awakening",
          text: "Connecting with Reiki energy, self-healing, chakra balancing, aura awareness, and learning to channel universal life force energy.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784431890427-b7f9d84d.jpg",
            alt: "REIKI Level 1 - The Awakening",
            width: 800,
            height: 600,
          },
        },
        {
          name: "Reiki Level 2",
          tagline: "The Transformation",
          text: "Developing deeper healing abilities, emotional healing, distance healing, symbols, energy clearing, and working with subconscious patterns.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784431735235-8e34b5cc.jpg",
            alt: "REIKI Level 2 - The Reinforcements",
            width: 800,
            height: 600,
          },
        },
        {
          name: "Reiki Level 3",
          tagline: "The Master Within",
          text: "Advanced energy techniques, spiritual growth, intuitive development, and mastering your own healing journey.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784432782285-04083fed.jpg",
            alt: "REIKI Level 3 - The Advanced Healer",
            width: 800,
            height: 600,
          },
        },
        {
          name: "Reiki Master Level",
          tagline: "The Path of the Healer",
          text: "Learning to guide others, deepen your connection with universal energy, and share Reiki wisdom.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784434396907-ce4d1687.jpg",
            alt: "REIKI Master - The Enlightenment",
            width: 800,
            height: 600,
          },
        },
        {
          name: "Past Life Regression & Soul Healing",
          tagline: "Soul-level awareness",
          text: "Exploring subconscious memories, karmic patterns, inner healing, and soul-level awareness.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784479803864-c248a483.jpg",
            alt: "Past Life Regression private session cover",
            width: 800,
            height: 600,
          },
        },
        {
          name: "Akashic Healing",
          tagline: "Records & soul guidance",
          text: "Accessing deeper intuitive wisdom through the Akashic Records — illuminating soul patterns, purpose, and next steps.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784479708575-d27b568a.jpg",
            alt: "Akashic Reading private session cover",
            width: 800,
            height: 600,
          },
        },
        {
          name: "Dowsing",
          tagline: "Energetic guidance",
          text: "Advanced methods of sensing and balancing energy through dowsing — clarity, guidance, and refined energetic awareness.",
          image: {
            src: "https://pub-a660605547dc4bd8bd829924aacdd025.r2.dev/general/1784466018691-d894f10c.jpg",
            alt: "Dowsing course cover",
            width: 800,
            height: 600,
          },
        },
      ],
      closing:
        "Reiki is not just a healing technique; it is a journey back to yourself. As you continue this path, you will discover that healing is not only about removing pain — it is about remembering your strength, reconnecting with your inner wisdom, and awakening the limitless potential that already exists within you.",
    },
    introductionCoursePricingSlide,
    introductionQuestionsSlide,
  ],
};

export { reikiLevel1Day1, reikiLevel1Day2 };

export const courseMaterialDecks: readonly CourseMaterialDeck[] = [
  introductionToReiki,
  reikiLevel1Day1,
  reikiLevel1Day2,
];

export type CourseMaterialSeriesGroup = {
  key: string;
  title: string;
  description: string;
  duration: string;
  decks: readonly CourseMaterialDeck[];
};

export function getCourseMaterialSeriesGroups(): readonly CourseMaterialSeriesGroup[] {
  const groups: CourseMaterialSeriesGroup[] = [];
  const seriesIndex = new Map<string, number>();

  for (const deck of courseMaterialDecks) {
    const key = deck.series ?? deck.slug;
    const existing = seriesIndex.get(key);

    if (existing === undefined) {
      seriesIndex.set(key, groups.length);
      groups.push({
        key,
        title: deck.series ?? deck.title,
        description: deck.series
          ? "Two-day live certification. Present Day 1 or Day 2 when you teach — same fullscreen presenter as Introduction to Reiki."
          : deck.description,
        duration: deck.series ? "2 Days" : deck.duration,
        decks: [deck],
      });
      continue;
    }

    const group = groups[existing]!;
    groups[existing] = {
      ...group,
      decks: [...group.decks, deck],
    };
  }

  return groups;
}

export function getCourseMaterialDeck(slug: string): CourseMaterialDeck | undefined {
  return courseMaterialDecks.find((deck) => deck.slug === slug);
}
