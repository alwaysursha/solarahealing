import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/reiki-level-1/day-2/${file}`;

const brandLogo = {
  src: "/course-material/reiki-level-1/cover-logo.png",
  alt: "Soulara Healing Training Academy",
  width: 939,
  height: 271,
} as const;

export const reikiLevel1Day2: CourseMaterialDeck = {
  slug: "reiki-level-1-day-2",
  title: "Reiki Level 1",
  series: "Reiki Level 1",
  dayLabel: "Day 2",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "ready",
  description:
    "Day 2 of the two-day Reiki Level 1 certification — self-healing practice, giving Reiki to others, daily life applications, and certification closing.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Day 2 · Two-day certification",
      title: "Reiki Level 1",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Reiki Level 1",
      subtitle: "The Awakening — Day 2 of your certification journey",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Continuing your Reiki path…",
      duration: "Day 2",
      teacherImage: {
        src: "/about/vanita-portrait-v3.jpg",
        alt: "Vanita Bassi, founder of Soulara Healing Academy",
        width: 1200,
        height: 1500,
      },
    },
    {
      kind: "quote",
      eyebrow: "Becoming a Reiki Practitioner",
      title: "Intention",
      quote:
        "I awaken the healer within me and learn to share Reiki with compassion, wisdom, and responsibility.",
    },
    {
      kind: "story",
      eyebrow: "Welcome",
      title: "Welcome back to the second day of your Reiki journey.",
      paragraphs: [
        "Yesterday, we opened the door to understanding energy, chakras, aura, and Reiki philosophy. Today, we move from understanding Reiki to experiencing Reiki as a practitioner.",
        "Remember: a Reiki practitioner is not someone who controls energy. We are simply a channel — allowing universal life force energy to flow with love, compassion, and intention.",
      ],
      image: {
        src: asset("slide-08-reiki-treatment-photo.png"),
        alt: "Reiki practitioner channeling healing energy above a relaxed recipient",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Opening practice",
      title: "Morning Grounding Meditation",
      lead: "(10 minutes)",
      image: {
        src: asset("slide-07-power-of-meditation.png"),
        alt: "The Power of Meditation teaching visual with benefits and affirmation",
        width: 1536,
        height: 1024,
      },
      sections: [
        {
          heading: "Ground",
          items: [
            "Close your eyes. Take a slow deep breath. Bring your awareness into your body.",
            "Feel your feet connected with the Earth.",
            "Imagine roots extending from your feet deep into the Earth.",
            "With every breath, feel yourself becoming calm, stable, and present.",
          ],
        },
        {
          heading: "Heart connection",
          items: [
            "Place your hands over your heart.",
            "Say silently: I am grounded. I am connected. I am open to receiving and sharing healing energy.",
          ],
        },
        {
          heading: "Intention",
          text: "I awaken the healer within me and learn to share Reiki with compassion, wisdom, and responsibility.",
        },
      ],
    },
    {
      kind: "story",
      eyebrow: "Self practice",
      title: "Complete Self-Healing Practice",
      paragraphs: [
        "Students learn the foundation of Reiki practice: healing themselves.",
        "Before offering Reiki to another person, we create a relationship with Reiki within ourselves. Self-Reiki develops sensitivity, confidence, intuition, and emotional awareness.",
      ],
      image: {
        src: asset("slide-01-self-healing-gift.png"),
        alt: "The Gift of Self Healing benefits, affirmation, and practices",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Practice steps",
      title: "Preparing for Self-Reiki",
      lead: "Allow your hands to rest gently. There is nothing you need to force. Simply become aware.",
      image: {
        src: asset("slide-05-preparing-self-reiki.png"),
        alt: "Preparing for Self-Reiki four steps: intention, hand positions, ground, center",
        width: 1024,
        height: 1536,
      },
      sections: [
        {
          heading: "Step 1 · Create Intention",
          items: [
            "Set your heart and mind on healing before you begin.",
            "Invite the energy with quiet clarity — nothing to force.",
            "“I invite Reiki energy to flow through me for my highest healing and wellbeing.”",
            "Trust that Reiki knows exactly where to go.",
          ],
        },
        {
          heading: "Step 2 · Hand Positions",
          items: [
            "Each hand position is an area where we consciously offer healing energy.",
            "Take 3 deep breaths.",
            "Invite Reiki: “Highest Energies of Universe Please Connect With Me and Activate my Reiki.”",
            "Notice sensations. Allow Reiki to flow naturally.",
          ],
        },
        {
          heading: "Step 3 · Ground",
          items: [
            "Find a quiet space, sit comfortably, and settle your body.",
            "Feel yourself rooted, calm, and present.",
            "A grounded practitioner is able to stay focused.",
            "Let the Earth support you as you begin.",
          ],
        },
        {
          heading: "Step 4 · Center",
          items: [
            "Bring awareness gently to the heart.",
            "Come fully into the present moment as your own healer.",
            "“I connect with love and compassion.”",
            "From this center, Reiki can flow with ease.",
          ],
        },
      ],
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-03-24-point-healing-landscape.png"),
        alt: "24 Point Reiki Healing front and back body positions with benefits",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "story",
      eyebrow: "Practitioner path",
      title: "Giving Reiki to Others",
      paragraphs: [
        "When we work with another person, we enter a sacred space of **TRUST**.",
        "A Reiki practitioner holds compassion, respect, and confidentiality. Set intention: May this Reiki energy flow for the highest good of this person.",
      ],
      image: {
        src: asset("slide-09-giving-reiki-others.png"),
        alt: "Hands channeling Reiki above a client’s forehead",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-06-practitioner-session.png"),
        alt: "Giving Reiki to Others complete practitioner session flow with nine steps",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "practitioner-responsibility",
      eyebrow: "Practitioner Responsibility",
      paragraphs: [
        "When we work with another person, we enter a sacred space of **TRUST**.",
        "A Reiki practitioner holds compassion, respect, and confidentiality.",
      ],
      sessionTitle: "A professional Reiki session includes",
      sessionIncludes: [
        "Preparation",
        "Client consultation",
        "Energy scanning",
        "Cleanse the Aura",
        "Set Intention",
        "Reiki treatment — 7 Chakra Healing",
        "Closing",
        "Energy Exchange",
        "Client aftercare",
      ],
      importantTitle: "Important",
      important: [
        "Never diagnose. Reiki practitioners support wellbeing but do not replace medical treatment.",
        "Reiki can be practiced through light touch or hands held slightly above the body depending on comfort and consent.",
      ],
      principles: [
        {
          heading: "Set Intention",
          text: "May this Reiki energy flow for the highest good of this person.",
        },
        {
          heading: "Respect",
          text: "Every person has their own healing journey.",
        },
        {
          heading: "Confidentiality",
          text: "Client information remains private.",
        },
        {
          heading: "Consent",
          text: "Always ask permission before offering Reiki.",
        },
        {
          heading: "Compassion",
          text: "Hold space without judgment.",
        },
        {
          heading: "Professional Boundaries",
          text: "Reiki is an energy practice, not a replacement for medical, psychological, or emergency care.",
        },
      ],
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-04-reiki-daily-life-landscape.png"),
        alt: "Reiki in Daily Life applications for food, water, home, plants and animals",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Integration",
      title: "The 21-Day Reiki Practice",
      lead: "Duration: 30 minutes. The 21-day practice is a commitment to building a relationship with Reiki.",
      sections: [
        {
          heading: "Daily practice",
          items: [
            "Self-Reiki",
            "Reiki Principles",
            "Meditation",
            "Gratitude",
            "Journaling",
          ],
        },
        {
          heading: "Certificate presentation",
          tone: "honor",
          text: "Students receive:",
          subheading: "Soulara Healing™ Reiki Level 1 Practitioner Certificate",
        },
        {
          heading: "Recommended next step",
          subheading: "Reiki Level 2 – The Expansion",
          text: "Reiki symbols, distance healing, emotional healing, manifestation, advanced techniques, and practitioner development.",
        },
      ],
      closing: "End of Reiki Level 1 Training — honor yourself for completing this awakening.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Take a moment to share reflections, ask anything, and celebrate this milestone together.",
    },
  ],
};
