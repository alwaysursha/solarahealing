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

export const reikiLevel2Day1: CourseMaterialDeck = {
  slug: "reiki-level-2-day-1",
  title: "Reiki Level 2",
  series: "Reiki Level 2",
  dayLabel: "Day 1",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "ready",
  description:
    "Day 1 of the two-day Reiki Level 2 certification — The Reinforcements: sacred symbols, Cho-Ku-Rei, Sei-Hei-Kei, Hon-Sha-Ze-Sho-Nen, distance healing, and energetic protection.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Day 1 · The Reinforcements · Two-day certification",
      title: "Reiki Level 2",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Reiki Level 2",
      subtitle: "The Reinforcements — Day 1 of your certification journey",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Strengthening the healer within…",
      duration: "Day 1",
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
      kind: "bullets",
      eyebrow: "Learning goals",
      title: "Course Objective",
      lead: "By the end of Reiki Level 2, you will:",
      items: [
        "Strengthen your Reiki channel",
        "Learn the sacred Reiki symbols",
        "Perform emotional and mental healing",
        "Send Reiki across distance, time, and situations",
        "Heal relationships and limiting beliefs",
        "Develop intuition",
        "Work professionally with clients",
        "Understand energetic protection",
        "Learn advanced Reiki techniques",
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Foundations",
      title: "Understanding Sacred Reiki Symbols",
      lead: "Symbols are not magical drawings. They are energetic keys.",
      sections: [
        {
          heading: "Think of symbols like",
          items: [
            "A password opens your computer",
            "A key opens your house",
            "A switch turns on electricity",
          ],
        },
        {
          heading: "Similarly",
          text: "Reiki symbols activate different frequencies of Universal Life Force Energy. The symbols help the practitioner focus intention more deeply.",
        },
        {
          heading: "Intention & activation",
          items: [
            "Without intention, symbols are simply drawings",
            "With Reiki activation, they become energetic tools",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Foundations",
      title: "Why Symbols Work?",
      lead: "Symbols work because they combine:",
      sections: [
        {
          heading: "The four elements",
          items: ["Intention", "Visualization", "Consciousness", "Reiki Energy"],
        },
        {
          heading: "The result",
          text: "When these combine, the Reiki channel becomes stronger.",
        },
        {
          heading: "Important",
          text: "**Students should understand that symbols are used respectfully, not casually.**",
          tone: "honor",
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Sacred tools",
      title: "Reiki Level 2 Symbols",
      image: {
        src: asset("slide-symbols-overview-v14-hd.png"),
        alt: "Overview of Cho-Ku-Rei, Sei-Hei-Kei, and Hon-Sha-Ze-Sho-Nen",
        width: 1920,
        height: 1280,
      },
      caption: "Awaken the symbols. Strengthen the healer within.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Power symbol",
      title: "Cho-Ku-Rei",
      lead: "Symbol of Power — amplifies Reiki energy like increasing the brightness of a light.",
      image: {
        src: asset("slide-cho-ku-rei-v2.png"),
        alt: "Cho-Ku-Rei symbol of power with stroke order and key teaching points",
        ...landscape,
      },
      sections: [
        {
          heading: "Meaning",
          items: [
            "“Place all the power of the Universe here.”",
            "Also translated as: “Direct the light here.”",
          ],
        },
        {
          heading: "Purpose",
          text: "If Reiki naturally flows at one level, Cho-Ku-Rei increases the intensity.",
        },
        {
          heading: "Benefits",
          items: [
            "Increase healing energy",
            "Clear negative energy",
            "Seal Reiki",
            "Cleanse rooms",
            "Protect spaces",
            "Increase crystal energy",
            "Strengthen affirmations",
            "Improve healing sessions",
            "Reduce energetic leakage",
          ],
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Drawing practice",
      title: "How to Draw Cho-Ku-Rei",
      image: {
        src: asset("slide-draw-cho-ku-rei-v2.png"),
        alt: "Stroke order for drawing Cho-Ku-Rei: horizontal, vertical, spiral",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Power symbol",
      title: "Working with Cho-Ku-Rei",
      lead: "Practice drawing Cho-Ku-Rei with clear intention — then apply it wherever energy needs strengthening.",
      sections: [
        {
          heading: "Where to Use",
          items: [
            "Before treatment",
            "After treatment",
            "On food",
            "Water",
            "Medicine",
            "Crystals",
            "Jewelry",
            "Home",
            "Office",
            "Car",
            "Business",
            "Plants",
            "Animals",
          ],
        },
        {
          heading: "Practical Exercise",
          text: "Students practice drawing Cho-Ku-Rei:",
          items: [
            "In the air",
            "On palms",
            "On chakras",
            "On walls",
            "Over water",
            "Over food",
          ],
        },
        {
          heading: "Meditation",
          text: "Visualize a brilliant golden-white Cho-Ku-Rei descending from above and expanding into every cell of your body.",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Aura cleansing",
      title: "Long Cho-Ku-Rei",
      lead: "We can clean the whole-body aura with Long Cho-Ku-Rei from all four sides.",
      image: {
        src: asset("slide-long-cho-ku-rei-v5.png"),
        alt: "Long Cho-Ku-Rei long downward spiral symbol",
        width: 1024,
        height: 1536,
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
      lead: "Traditionally interpreted as: “God and humanity become one.”",
      image: {
        src: asset("slide-sei-hei-kei-v2.png"),
        alt: "Sei-Hei-Kei balance symbol with Male, Female, and apply-on points",
        ...landscape,
      },
      sections: [
        {
          heading: "Represents harmony between",
          items: ["Mind", "Body", "Emotions", "Spirit", "Conscious", "Subconscious"],
        },
        {
          heading: "Where illness begins",
          text: "Most illnesses begin long before they appear in the body. They begin as:",
          items: [
            "Stress",
            "Fear",
            "Anger",
            "Resentment",
            "Guilt",
            "Trauma",
            "Limiting beliefs",
          ],
        },
        {
          heading: "How Sei-Hei-Kei helps",
          text: "Sei-Hei-Kei helps restore emotional **balance** and supports mental healing.",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Balance symbol",
      title: "Working with Sei-Hei-Kei",
      lead: "Bring the balance symbol into session work — for emotions, habits, and mental clarity.",
      sections: [
        {
          heading: "Uses",
          items: [
            "Anxiety",
            "Depression",
            "Trauma",
            "Addictions",
            "Stress",
            "Sleep problems",
            "Negative habits",
            "Fear",
            "Childhood wounds",
            "Relationship healing",
            "Exam anxiety",
            "Public speaking",
            "Confidence",
          ],
        },
        {
          heading: "Emotional Healing Session",
          text: "Step-by-step practice:",
          items: [
            "Activate Reiki",
            "Draw Cho-Ku-Rei",
            "Draw Sei-Hei-Kei",
            "Place hands on Head, Heart, and Solar Plexus",
            "Allow Reiki to flow",
          ],
        },
        {
          heading: "Affirmation Exercise",
          text: "“I lovingly release every emotion that no longer serves my highest good.”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Practice sequence",
      title: "Use Sequence: 1 + 2 + 1",
      image: {
        src: asset("slide-sequence-1-2-1-v5.png"),
        alt: "Cho-Ku-Rei, Sei-Hei-Kei, Cho-Ku-Rei sequence 1 + 2 + 1",
        ...landscape,
      },
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
      lead: "Traditionally understood as:",
      image: {
        src: asset("slide-hon-sha-v3.png"),
        alt: "Hon-Sha-Ze-Sho-Nen distance and connecting symbol teaching card",
        ...landscape,
      },
      sections: [
        {
          heading: "Meaning",
          items: [
            "“No past, no present, no future.”",
            "“The Buddha in me reaches the Buddha in you.”",
          ],
        },
        {
          heading: "Reminds us",
          text: "Reiki is not limited by physical distance or time.",
        },
        {
          heading: "Also means",
          items: [
            "Everything in the Universe is connected through consciousness",
            "Distance exists for the physical body",
            "Energy is not limited by physical distance",
            "Distance Reiki is based on intention and focused awareness",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Distance symbol",
      title: "Working with Hon-Sha-Ze-Sho-Nen",
      lead: "Send Reiki across distance, time, and situations with clear intention.",
      sections: [
        {
          heading: "Uses",
          items: [
            "Send Reiki to another city",
            "Another country",
            "Past emotional experiences",
            "Future events",
            "Interviews",
            "Examinations",
            "Relationships",
            "Children",
            "Family",
            "Hospitals",
            "Earth healing",
            "Business",
            "Animals",
            "Plants",
            "Goals",
          ],
        },
        {
          heading: "Distance Healing Procedure",
          items: [
            "Ground",
            "Activate Reiki",
            "Cho-Ku-Rei",
            "Hon-Sha-Ze-Sho-Nen",
            "Sei-Hei-Kei",
            "Visualize recipient",
            "Allow Reiki to flow",
            "Seal with Cho-Ku-Rei",
            "Express gratitude",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Distance practice",
      title: "Different Distance Healing Methods",
      lead: "Choose the method that best supports clear intention and focused awareness.",
      sections: [
        {
          heading: "Methods",
          items: [
            "Photograph Method",
            "Name Paper Method",
            "Visualization Method",
            "Pillow Method",
            "Surrogate Method",
            "Healing Box Method",
          ],
        },
        {
          heading: "Distance Healing Workshop",
          text: "Students practice:",
          items: [
            "Sending Reiki to a family member in another room (or remotely)",
            "Sending Reiki to a future event (job interview, exam, presentation)",
            "Sending Reiki to a past memory — bringing peace and healing to present-day emotional responses",
            "Sending Reiki to the Earth and collective well-being",
          ],
        },
        {
          heading: "Discussion",
          text: "Discuss how recipients may experience Reiki differently and the importance of avoiding expectations.",
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Healing protocol",
      title: "Healing Sequence for a Person or Situation",
      image: {
        src: asset("slide-person-sequence-v3.png"),
        alt: "Symbol sequence 3 + 1 + 2 + 1 + 1 for person or situation healing",
        ...landscape,
      },
    },
    {
      kind: "image-focus",
      eyebrow: "Healing protocol",
      title: "Healing an Object or Place",
      image: {
        src: asset("slide-object-sequence-v2.png"),
        alt: "Symbol sequence 3 + 1 + 1 + 1 for object or place healing",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Energetic safety",
      title: "Reiki Protection Shield",
      lead: "Visualize Cho-Ku-Rei and create any kind of protective shield with devotion.",
      image: {
        src: asset("slide-protection-shield-v3.png"),
        alt: "Three equal protection shield visualizations: circular, pyramid, and conical rings",
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
      ],
      closing: "Remember: whatever is imagined becomes so.",
    },
    {
      kind: "bullets",
      eyebrow: "Certification check",
      title: "Practical Assessment",
      lead: "Each student demonstrates:",
      items: [
        "Proper grounding",
        "Reiki activation",
        "Accurate symbol drawing",
        "Mental-emotional Reiki session",
        "Distance Reiki session",
        "Closing and grounding techniques",
        "Professional communication with a practice client",
      ],
    },
    {
      kind: "quote",
      eyebrow: "Protection principle",
      title: "Remember",
      quote: "Whatever is imagined becomes so.",
    },
    {
      kind: "bullets",
      eyebrow: "Sacred initiation",
      title: "Reiki Level 2 Attunement",
      lead: "Level 2 attunement — awakening the sacred symbols within the channel. After the attunement:",
      items: [
        "Allow quiet meditation",
        "Invite students to share their experiences",
        "Encourage hydration and rest",
        "Explain the importance of a 21-day self-practice period to deepen familiarity with the symbols and Reiki practice",
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Day 1 closing",
      title: "Closing Day 1",
      lead: "Today you opened the Reinforcements — power, balance, and distance — as living tools in your practice.",
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
          heading: "Looking ahead to Day 2",
          text: "Tomorrow we explore Manifestation — Ask · Believe · Feel · Receive — then close with certification.",
        },
        {
          heading: "Until then",
          items: [
            "Rest and hydrate",
            "Practice drawing the symbols with devotion",
            "Notice how intention and visualization feel in your channel",
          ],
        },
      ],
      closing: "End of Day 1 — honour the Reinforcements awakening within you. See you tomorrow.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, ask anything, and rest into this first day of The Reinforcements.",
    },
  ],
};
