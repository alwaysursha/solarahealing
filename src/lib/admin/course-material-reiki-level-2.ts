import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/reiki-level-2/${file}`;

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

export const reikiLevel2: CourseMaterialDeck = {
  slug: "reiki-level-2",
  title: "Reiki Level 2",
  duration: "1 Day",
  sessionDurationMinutes: 180,
  status: "ready",
  description:
    "Reiki Level 2 – The Reinforcements: Cho-Ku-Rei, Sei-Hei-Kei, Hon-Sha-Ze-Sho-Nen, distance healing sequences, and energetic protection.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "One-day certification · The Reinforcements",
      title: "Reiki Level 2",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Reiki Level 2",
      subtitle: "The Reinforcements — symbols, distance healing, and practitioner power",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Strengthening the healer within…",
      duration: "1 Day",
      teacherImage: {
        src: "/about/vanita-portrait-v3.jpg",
        alt: "Vanita Bassi, founder of Soulara Healing Academy",
        width: 1200,
        height: 1500,
      },
    },
    {
      kind: "quote",
      eyebrow: "Practitioner intention",
      title: "Intention",
      quote:
        "I awaken the sacred Reiki symbols within me and offer healing across time, space, and circumstance with clarity, devotion, and responsibility.",
    },
    {
      kind: "story",
      eyebrow: "Welcome",
      title: "Welcome to Reiki Level 2 – The Reinforcements.",
      paragraphs: [
        "In Level 1 – The Awakening, you opened the channel and learned to heal yourself. Today we reinforce that foundation with the sacred symbols that amplify intention, balance emotion, and connect across distance.",
        "A Reiki Level 2 practitioner does not force energy. We become a clearer, more focused channel — drawing, visualizing, and projecting symbols with devotion.",
      ],
      image: {
        src: asset("slide-welcome.png"),
        alt: "Calm Reiki practice space with soft natural light",
        ...landscape,
      },
    },
    {
      kind: "image-focus",
      eyebrow: "Sacred tools",
      title: "Reiki Level 2 Symbols",
      image: {
        src: asset("slide-symbols-overview.png"),
        alt: "Overview of Cho-Ku-Rei, Sei-Hei-Kei, and Hon-Sha-Ze-Sho-Nen",
        ...landscape,
      },
      caption: "Power · Balance · Distance — awaken the symbols. Strengthen the healer within.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Power symbol",
      title: "Cho-Ku-Rei",
      lead: "Draw three and a half circles or more and project with intention and visualization.",
      image: {
        src: asset("slide-cho-ku-rei.png"),
        alt: "Cho-Ku-Rei symbol of power with key teaching points",
        ...landscape,
      },
      sections: [
        {
          heading: "Cho-Ku-Rei",
          subheading: "Symbol of Power",
          items: [
            "Colour is White",
            "Draw more than 3½ circles",
            "Multi-purpose symbol",
            "Very powerful for instant healing",
          ],
        },
        {
          heading: "How to work with it",
          items: [
            "Draw with clear intention",
            "Visualize the symbol activating",
            "Project the energy where it is needed",
            "Trust the power of focused awareness",
          ],
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Drawing practice",
      title: "How to Draw Cho-Ku-Rei",
      image: {
        src: asset("slide-draw-cho-ku-rei.png"),
        alt: "Stroke order for drawing Cho-Ku-Rei: horizontal, vertical, spiral",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Aura cleansing",
      title: "Long Cho-Ku-Rei",
      lead: "We can clean the whole-body aura with Long Cho-Ku-Rei from all four sides.",
      image: {
        src: asset("slide-long-cho-ku-rei.png"),
        alt: "Long Cho-Ku-Rei aura cleanse from front, back, left, and right",
        ...landscape,
      },
      sections: [
        {
          heading: "Four sides",
          items: ["Front", "Back", "Left", "Right"],
        },
        {
          heading: "Practice",
          text: "Clean each side 3 times with Long Cho-Ku-Rei, staying present and devoted.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Balance symbol",
      title: "Sei-Hei-Kei",
      lead: "The symbol of balance. Colour is Pink — it balances the mind and emotions. Used on 4 parts of the body.",
      image: {
        src: asset("slide-sei-hei-kei.png"),
        alt: "Sei-Hei-Kei balance symbol with Male, Female, and apply-on points",
        ...landscape,
      },
      sections: [
        {
          heading: "Sacred geometry",
          items: ["Male — upright triangle", "Female — inverted triangle", "Balance — hexagram union"],
        },
        {
          heading: "Apply on",
          items: ["Right & Left Brain", "Third Eye", "Heart Chakra", "Solar Plexus Chakra"],
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Practice sequence",
      title: "Use Sequence: 1 + 2 + 1",
      image: {
        src: asset("slide-sequence-1-2-1.png"),
        alt: "Cho-Ku-Rei, Sei-Hei-Kei, Cho-Ku-Rei sequence 1 + 2 + 1",
        ...landscape,
      },
      caption: "Apply this sequence on all four parts.",
    },
    {
      kind: "image-focus",
      eyebrow: "Mind & emotion",
      title: "Brain Design",
      image: {
        src: asset("slide-brain-design.png"),
        alt: "Left and right brain functions for Sei-Hei-Kei balance teaching",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Distance symbol",
      title: "Hon-Sha-Ze-Sho-Nen",
      lead: "Visualize this symbol for Distance Healing.",
      image: {
        src: asset("slide-hon-sha.png"),
        alt: "Hon-Sha-Ze-Sho-Nen distance and connecting symbol teaching card",
        ...landscape,
      },
      sections: [
        {
          heading: "Key points",
          items: [
            "Distance / Connecting Symbol",
            "The Symbol of Telepathy",
            "Colour is Golden",
            "Opens the channel across time and space",
          ],
        },
        {
          heading: "Practice",
          text: "Hold a clear intention for the person, situation, object, or place — then visualize and project the symbol with devotion.",
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Healing protocol",
      title: "Healing Sequence for a Person or Situation",
      image: {
        src: asset("slide-person-sequence.png"),
        alt: "Symbol sequence 3 + 1 + 2 + 1 + 1 for person or situation healing",
        ...landscape,
      },
      caption: "Always use this sequence of symbols to heal a person or situation.",
    },
    {
      kind: "image-focus",
      eyebrow: "Healing protocol",
      title: "Healing an Object or Place",
      image: {
        src: asset("slide-object-sequence.png"),
        alt: "Symbol sequence 3 + 1 + 1 + 1 for object or place healing",
        ...landscape,
      },
      caption: "Always use these symbol numbers: Connection · Clear Blockage · Healing · Stabilize & Seal.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Energetic safety",
      title: "Reiki Protection Shield",
      lead: "Visualize Cho-Ku-Rei and create any kind of protective shield with devotion.",
      image: {
        src: asset("slide-protection-shield.png"),
        alt: "Neutral meditating figure inside a Cho-Ku-Rei protection shield",
        ...landscape,
      },
      sections: [
        {
          heading: "Ways to visualize",
          items: [
            "Circular energy bubble",
            "Pyramid of light",
            "Conical ring shield",
            "Any form created with devotion",
          ],
        },
        {
          heading: "Remember",
          text: "Whatever is imagined becomes so.",
        },
      ],
    },
    {
      kind: "quote",
      eyebrow: "Protection principle",
      title: "Remember",
      quote: "Whatever is imagined becomes so.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Integration",
      title: "Closing the Day",
      lead: "You now carry the Reinforcements — power, balance, and distance — as living tools in your practice.",
      sections: [
        {
          heading: "Today you reinforced",
          items: [
            "Cho-Ku-Rei — Symbol of Power",
            "Long Cho-Ku-Rei — aura cleansing",
            "Sei-Hei-Kei — mind and emotional balance",
            "Hon-Sha-Ze-Sho-Nen — distance connection",
            "Healing sequences for people, situations, objects, and places",
            "Protection shields created with devotion",
          ],
        },
        {
          heading: "Certificate presentation",
          tone: "honor",
          text: "Students receive:",
          subheading: "Soulara Healing™ Reiki Level 2 Practitioner Certificate",
        },
        {
          heading: "Recommended next step",
          subheading: "Reiki Level 3 – The Advanced Healer",
          text: "Advanced energy work, attunement practice, psychic surgery, cord cutting, and the Master Symbol.",
        },
      ],
      closing: "End of Reiki Level 2 Training — honour the Reinforcements awakening within you.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, ask anything, and celebrate this deeper step on your Reiki path.",
    },
  ],
};
