import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/reiki-level-3/day-1/${file}`;

const brandLogo = {
  src: "/course-material/reiki-level-1/cover-logo.png",
  alt: "Soulara Healing Training Academy",
  width: 939,
  height: 271,
} as const;

const landscape = {
  width: 1536,
  height: 1024,
} as const;

const portrait = {
  width: 1024,
  height: 1536,
} as const;

export const reikiLevel3Day1: CourseMaterialDeck = {
  slug: "reiki-level-3-day-1",
  title: "Reiki Level 3",
  series: "Reiki Level 3",
  dayLabel: "Day 1",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "ready",
  description:
    "Day 1 of the two-day Reiki Level 3 certification — The Advanced Healer: Inner Master, Dai Ko Myo, symbols integration, Level 3 meditation, and advanced Reiki scanning.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Day 1 · The Advanced Healer · Two-day certification",
      title: "Reiki Level 3",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Reiki Level 3",
      subtitle: "The Advanced Healer — Day 1 of your certification journey",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Developing the Inner Master…",
      duration: "Day 1",
      teacherImage: {
        src: "/about/vanita-portrait-v3.jpg",
        alt: "Vanita Bassi, founder of Soulara Healing Academy",
        width: 1200,
        height: 1500,
      },
    },
    {
      kind: "story",
      eyebrow: "Welcome",
      title: "Welcome to Reiki Level 3 — The Advanced Healer.",
      paragraphs: [
        "Reiki Level 1 introduced you to Reiki and self-healing. Level 2 expanded the practice through symbols, emotional healing, and distance healing.",
        "Level 3 moves the practitioner into a deeper relationship with consciousness, intuition, spiritual practice, and advanced Reiki work. The purpose is not simply to learn another symbol — it is to develop the Inner Master.",
      ],
      image: {
        src: asset("slide-l3-welcome.png"),
        alt: "Soft dawn light over a calm horizon — welcoming the Advanced Healer path",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Opening",
      title: "Course Intention",
      lead: "Level 3 is a deepening — from technique into presence, awareness, and spiritual integration.",
      image: {
        src: asset("slide-l3-intention.png"),
        alt: "Golden heart of light representing the Inner Master awakening",
        ...landscape,
      },
      sections: [
        {
          heading: "The journey so far",
          items: [
            "Level 1 — Reiki and self-healing",
            "Level 2 — Symbols, emotional healing, and distance healing",
            "Level 3 — Consciousness, intuition, and advanced Reiki work",
          ],
        },
        {
          heading: "The purpose of this level",
          text: "Not simply to learn another symbol — to develop the **Inner Master**.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Foundations",
      title: "The Three Levels of Reiki Development",
      lead: "Each level builds a different layer of the healing path — physical, mental-emotional, then spiritual.",
      image: {
        src: asset("slide-l3-three-levels.png"),
        alt: "Three ascending spheres of light — physical, emotional, and spiritual development",
        ...landscape,
      },
      sections: [
        {
          heading: "Level 1 — The Physical Foundation",
          items: [
            "Self-healing",
            "Hands-on Reiki",
            "Body awareness",
            "Chakras",
            "Aura awareness",
            "Grounding",
            "Daily Reiki practice",
          ],
        },
        {
          heading: "Level 2 — Mental, Emotional & Distance",
          items: [
            "Cho Ku Rei",
            "Sei He Ki",
            "Hon Sha Ze Sho Nen",
            "Mental/emotional Reiki",
            "Distance Reiki",
            "Intention",
            "Habit and emotional-pattern work",
          ],
        },
        {
          heading: "Level 3 — Spiritual Development",
          items: [
            "Dai Ko Myo",
            "Higher consciousness",
            "Advanced meditation",
            "Intuitive Reiki",
            "Advanced energetic practices",
            "Psychic-surgery visualization",
            "Deep Reiki sessions",
            "Spiritual integration",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Master symbol",
      title: "Introduction to Dai Ko Myo",
      lead: "The Master Symbol — commonly called the Reiki Master Symbol in many modern Reiki lineages.",
      image: {
        src: asset("slide-l3-dai-ko-myo-intro.png"),
        alt: "Luminous golden Dai Ko Myo master symbol with soft violet-gold aura",
        ...landscape,
      },
      sections: [
        {
          heading: "Lineage note",
          text: "Different Reiki schools may draw or interpret the symbol somewhat differently. Students should learn the form and method taught within their Reiki lineage.",
        },
        {
          heading: "Common spiritual interpretation",
          text: "Its deeper teaching can be understood symbolically as awakening the light of awareness already within us.",
          tone: "honor",
        },
        {
          heading: "Meaning",
          items: [
            "“Great bright light”",
            "“Great enlightenment”",
            "Highest-vibration symbol in traditional Usui Reiki — representing the soul",
          ],
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Master symbol",
      title: "Dai Ko Myo — Highest Empowerment",
      image: {
        src: asset("slide-l3-dai-ko-myo-teaching.png"),
        alt: "Dai Ko Myo teaching graphic with DAI, KOO, and MYO sections and stroke guidance",
        ...portrait,
      },
      caption: "Awaken the light of awareness already within you.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Master symbol",
      title: "Learning Dai Ko Myo",
      lead: "Teach the exact drawing according to your lineage. Practice with devotion.",
      image: {
        src: asset("slide-l3-learning-practice.png"),
        alt: "Journal and soft light — practicing sacred symbol drawing",
        ...landscape,
      },
      sections: [
        {
          heading: "Students practice",
          items: [
            "Observe the complete symbol",
            "Watch the teacher draw it slowly",
            "Learn the stroke sequence",
            "Trace it with a finger",
            "Draw it on paper",
            "Draw it in the air",
            "Visualize it mentally",
            "Practice drawing it with eyes closed",
            "Visualize it as light",
          ],
        },
        {
          heading: "Practice",
          text: "Draw Dai Ko Myo approximately **21 times**. Then sit quietly for a few minutes.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Symbol integration",
      title: "Symbols Used at Level 3",
      lead: "The four sacred tools — power, balance, connection, and highest empowerment.",
      image: {
        src: asset("slide-l3-symbols-four.png"),
        alt: "Four ascending nodes of golden light representing the Reiki symbols path",
        ...landscape,
      },
      sections: [
        {
          heading: "Cho Ku Rei — Power",
          text: "“Place the power of the universe here.” Boosts and focuses healing energy — clearing, protection, grounding, intensifying physical healing.",
        },
        {
          heading: "Sei He Ki — Balance",
          text: "Purification and balance. Works with the subconscious to clear emotional pain, trauma, and stress — anxiety, habits, and emotional turmoil.",
        },
        {
          heading: "Hon Sha Ze Sho Nen — Connect",
          text: "“No past, no present, no future.” Transcends distance and time — remote healing, past wounds, and future anxieties.",
        },
        {
          heading: "Dai Ko Myo — Highest Empowerment",
          text: "“Great bright light.” The highest-vibration symbol — deep spiritual awakening for Level 3 practitioners.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Practice",
      title: "Reiki Level 3 Meditation",
      lead: "20–25 minute Level 3 meditation. Audio will be recorded and added later.",
      image: {
        src: asset("slide-l3-meditation.png"),
        alt: "Calm seated meditation with soft golden aura — Level 3 practice",
        ...landscape,
      },
      sections: [
        {
          heading: "In class",
          items: [
            "Settle into quiet stillness",
            "Connect with Reiki and Dai Ko Myo",
            "Allow the meditation to deepen awareness",
            "Rest afterward before continuing",
          ],
        },
        {
          heading: "Note for teachers",
          text: "Play the Level 3 meditation recording when available. Until then, guide a live 20–25 minute practice.",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Advanced practice",
      title: "Advanced Reiki Scanning",
      lead: "Before an advanced session — observe rather than diagnose. Scan the space above the body only with permission.",
      image: {
        src: asset("slide-l3-scanning.png"),
        alt: "Hands scanning softly above a calm figure with golden light trails",
        ...landscape,
      },
      sections: [
        {
          heading: "Notice subjective sensations",
          items: [
            "Warmth",
            "Coolness",
            "Tingling",
            "Heaviness",
            "Pulsation",
            "Changes in hand sensation",
          ],
        },
        {
          heading: "We do not say",
          text: "“I detected disease in your liver.”",
        },
        {
          heading: "Instead, we might privately notice",
          text: "“I experienced more sensation around this area, so I may spend additional Reiki time here if the recipient is comfortable.”",
          tone: "honor",
        },
      ],
      closing: "That distinction is extremely important.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Day 1 closing",
      title: "Closing Day 1",
      lead: "Today you opened The Advanced Healer path — Dai Ko Myo, symbol integration, and observing with humility.",
      sections: [
        {
          heading: "Today you explored",
          items: [
            "The Inner Master intention",
            "Three levels of Reiki development",
            "Dai Ko Myo — the Master Symbol",
            "Drawing and visualization practice",
            "Four-symbol integration",
            "Level 3 meditation",
            "Advanced Reiki scanning with ethical observation",
          ],
        },
        {
          heading: "Looking ahead to Day 2",
          text: "Tomorrow — psychic surgery as guided visualization, cord-cutting / energetic boundaries, Level 3 attunement, 21-day integration, ethics, and the Reiki Master mindset.",
        },
        {
          heading: "Until then",
          items: [
            "Rest and hydrate",
            "Practice drawing Dai Ko Myo with devotion",
            "Notice presence — not performance — in your channel",
          ],
        },
      ],
      closing: "End of Day 1 — honour the Inner Master awakening within you. See you tomorrow.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, ask anything, and rest into this first day of The Advanced Healer.",
    },
  ],
};
