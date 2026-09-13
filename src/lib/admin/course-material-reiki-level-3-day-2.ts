import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/reiki-level-3/day-2/${file}`;

const brandLogo = {
  src: "/course-material/reiki-level-1/cover-logo.png",
  alt: "Soulara Healing Training Academy",
  width: 939,
  height: 271,
} as const;

const landscape = {
  width: 1280,
  height: 720,
} as const;

export const reikiLevel3Day2: CourseMaterialDeck = {
  slug: "reiki-level-3-day-2",
  title: "Reiki Level 3",
  series: "Reiki Level 3",
  dayLabel: "Day 2",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "ready",
  description:
    "Day 2 of the two-day Reiki Level 3 certification — psychic surgery visualization, cord-cutting, attunement, 21-day integration, ethics, and the Inner Master closing.",
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
      kind: "story",
      eyebrow: "Welcome",
      title: "Welcome to Day 2 — The Inner Master continues.",
      paragraphs: [
        "Yesterday you met Dai Ko Myo, deepened meditation, and practiced observing with humility. Today we move into advanced visualization practices, energetic boundaries, attunement, integration, and the ethics of mastery.",
        "Remember: Level 3 is not about becoming more dramatic. It is about becoming more present, responsible, and compassionate.",
      ],
      image: {
        src: asset("slide-l3d2-welcome.png"),
        alt: "Serene figure on a golden path of light at dawn — welcoming Day 2 of The Advanced Healer",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Advanced practice",
      title: "Psychic Surgery",
      lead: "What is psychic surgery in Reiki training?",
      image: {
        src: asset("slide-l3d2-psychic-surgery.png"),
        alt: "Symbolic Reiki visualization with golden light dissolving emotional heaviness — not medical surgery",
        ...landscape,
      },
      sections: [
        {
          heading: "How it is taught here",
          text: "In this course, psychic surgery is taught as a **guided visualization and symbolic energetic practice**.",
          tone: "honor",
        },
        {
          heading: "Important boundaries",
          items: [
            "It is not physical surgery",
            "It does not remove physical tumors or disease",
            "It must never replace medical diagnosis, surgery, medication, psychotherapy, or other professional treatment",
          ],
        },
        {
          heading: "Purpose",
          text: "To help a consenting participant work symbolically with an area they associate with emotional or energetic heaviness.",
        },
      ],
      closing: "Always proceed with clarity, consent, and humility.",
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Psychic surgery",
      title: "Process — Steps 1 to 7",
      lead: "A guided, consent-based symbolic practice. Move slowly and stay present.",
      image: {
        src: asset("slide-l3d2-psychic-process.png"),
        alt: "Luminous hands with streams of golden light surrounding a soft dissolving orb",
        ...landscape,
      },
      sections: [
        {
          heading: "Step 1 — Ground yourself",
          items: ["Take three breaths", "Bring your hands into Gassho", "Connect with Reiki"],
        },
        {
          heading: "Step 2 — Establish intention",
          text: "Silently say: “May this practice support the recipient’s highest good, within the boundaries of their consent.”",
        },
        {
          heading: "Step 3 — Activate your Reiki practice",
          text: "Use Dai Ko Myo and other symbols according to your lineage.",
        },
        {
          heading: "Step 4 — Ask the recipient to visualize",
          text: "“If this issue could appear symbolically as an object, shape, colour, or texture, what would it look like?” Ask where they imagine it.",
        },
        {
          heading: "Step 5 — Establish a release intention",
          text: "Ask: “Are you comfortable imagining that this heaviness can now begin to soften or release?” Proceed only with consent.",
        },
        {
          heading: "Step 6 — Visualize extended Reiki hands",
          text: "Some methods teach practitioners to imagine fingers extending symbolically as streams of light. Visualize light extending from your fingertips.",
        },
        {
          heading: "Step 7 — Work around the area",
          text: "Without invasive physical contact, move your hands through the surrounding space. Imagine Reiki light surrounding the symbolic blockage.",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Psychic surgery",
      title: "Process — Steps 8 to 14",
      lead: "Complete the visualization gently. Do not force outcomes.",
      image: {
        src: asset("slide-l3d2-psychic-process.png"),
        alt: "Golden light dissolving a symbolic blockage into peaceful radiance",
        ...landscape,
      },
      sections: [
        {
          heading: "Step 8 — Symbolic release",
          items: [
            "Invite the recipient to imagine the unwanted image softening, dissolving, breaking apart, melting, releasing, or transforming into light",
            "Do not force a particular visualization",
          ],
        },
        {
          heading: "Step 9 — Clearing gesture",
          text: "Using sweeping hand movements away from the body, symbolically clear the area. Do not claim that physical disease has been removed.",
        },
        {
          heading: "Step 10 — Reiki the area",
          text: "Place hands appropriately above or on the body with consent. Allow Reiki to flow.",
        },
        {
          heading: "Step 11 — Dai Ko Myo",
          text: "Visualize Dai Ko Myo surrounding the area with light.",
        },
        {
          heading: "Step 12 — Integration",
          text: "Invite the recipient to imagine the area becoming peaceful and whole.",
        },
        {
          heading: "Step 13 — Grounding",
          items: ["Bring attention to the feet", "Allow several quiet breaths"],
        },
        {
          heading: "Step 14 — Close",
          text: "Thank Reiki and end the practice.",
          tone: "honor",
        },
      ],
      closing:
        "Optional reading: The Science of Psychic Surgery (shared resource for deeper study).",
    },
    {
      kind: "topic-sections",
      eyebrow: "Boundaries",
      title: "Cord-Cutting / Energetic Boundary Practice",
      lead: "A visualization to reinforce healthy emotional boundaries — not a literal cutting of another person’s energy.",
      image: {
        src: asset("slide-l3d2-cord-cutting.png"),
        alt: "Soft golden threads of attachment gently dissolving into light between two peaceful figures",
        ...landscape,
      },
      sections: [
        {
          heading: "How cords are understood here",
          text: "In spiritual traditions, cords are sometimes used as a metaphor for emotional attachment or persistent relational patterns.",
        },
        {
          heading: "What we are doing",
          items: [
            "We are not literally cutting another person’s energy",
            "We are using visualization to reinforce healthy emotional boundaries",
            "The practice supports clarity, self-respect, and compassionate release",
          ],
        },
        {
          heading: "In class",
          text: "Please add / play the recorded Cord-Cutting meditation when available. Until then, guide a live visualization with consent and grounding.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Ceremony",
      title: "Level 3 Attunement",
      lead: "A quiet, sacred space for receiving the Level 3 initiation.",
      image: {
        src: asset("slide-l3d2-attunement.png"),
        alt: "Quiet Level 3 attunement ceremony with soft golden-violet light above the crown",
        ...landscape,
      },
      sections: [
        {
          heading: "Prepare the space",
          items: [
            "Quiet reflection",
            "Meditation",
            "Gassho",
            "Reiki principles",
            "Dai Ko Myo contemplation",
            "Grounding",
          ],
        },
        {
          heading: "Receive with presence",
          text: "Allow the attunement to settle without forcing sensation or expectation. Rest afterward.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Integration",
      title: "The 21-Day Integration Practice",
      lead: "For 21 days after class, students deepen mastery through daily devotion.",
      image: {
        src: asset("slide-l3d2-21-day.png"),
        alt: "Ascending path of soft golden lanterns toward dawn — twenty-one days of integration",
        ...landscape,
      },
      sections: [
        {
          heading: "Daily practices",
          items: [
            "Daily self-Reiki",
            "Dai Ko Myo meditation",
            "Gassho",
            "Reiki principles",
            "Journaling",
            "Mindful observation",
            "Grounding",
            "Gratitude",
          ],
        },
        {
          heading: "Why 21 days",
          text: "Integration is where initiation becomes embodiment. Consistency builds awareness, boundaries, and compassionate presence.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Integration",
      title: "Journal Questions",
      lead: "Use these prompts throughout the 21 days — honesty over perfection.",
      image: {
        src: asset("slide-l3d2-journal.png"),
        alt: "Open journal with soft candlelight and amethyst — reflective mastery practice",
        ...landscape,
      },
      sections: [
        {
          heading: "Reflect on",
          items: [
            "What am I becoming more aware of?",
            "What patterns am I ready to change?",
            "Where am I reacting rather than responding?",
            "What am I learning about myself?",
            "What does mastery mean to me today?",
            "How can I serve without losing my boundaries?",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Mastery",
      title: "Ethics of an Advanced Reiki Practitioner",
      lead: "At Level 3, ethics should become even stronger.",
      image: {
        src: asset("slide-l3d2-ethics.png"),
        alt: "Open luminous hands holding a golden heart of light — sacred ethical responsibility",
        ...landscape,
      },
      sections: [
        {
          heading: "Teach students",
          items: [
            "Always obtain consent",
            "Maintain confidentiality",
            "Never diagnose medical or psychiatric conditions",
            "Never promise cures",
            "Never tell someone to discontinue medical treatment",
            "Respect physical boundaries",
            "Do not use fear-based claims",
          ],
        },
        {
          heading: "Remember",
          text: "Advanced technique without ethics is not mastery. Presence, consent, and humility protect both practitioner and recipient.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "quote",
      eyebrow: "The Reiki Master mindset",
      title: "Presence Before Power",
      quote:
        "The greatest development at Reiki Level 3 is not the number of techniques you know. It is the quality of presence you bring to another human being. Can you sit beside someone without needing to fix them? Can you listen without immediately interpreting? Can you offer Reiki without needing a dramatic result? Can you honour another person’s path without making it about your own spiritual abilities? That is part of mastery.",
      image: {
        src: asset("slide-l3d2-master-mindset.png"),
        alt: "Two people sitting in quiet companionship with soft golden presence between them",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Soulara Healing Academy",
      title: "Student Take-Home Practice",
      lead: "Reiki Level 3 — The Inner Master. For the next 21 days:",
      image: {
        src: asset("slide-l3d2-take-home.png"),
        alt: "Morning and evening Reiki home practice with gassho and soft golden light",
        ...landscape,
      },
      sections: [
        {
          heading: "Morning",
          items: [
            "Gassho — 2 minutes",
            "Dai Ko Myo — 3 minutes",
            "Self-Reiki — 15–20 minutes",
          ],
        },
        {
          heading: "Evening",
          items: ["Level 3 meditation — 10 minutes", "Journal — 5 minutes"],
        },
        {
          heading: "Daily reflection",
          items: [
            "What am I ready to release?",
            "What am I choosing to create?",
            "What is Reiki teaching me about myself?",
            "How can I bring more awareness into tomorrow?",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Final teaching",
      title: "From Practitioner to Presence",
      lead: "The deepest Reiki practice is not about becoming powerful. It is about becoming present.",
      image: {
        src: asset("slide-l3d2-final-teaching.png"),
        alt: "Three ascending lights representing Touch, Intention, and Presence on the Reiki path",
        ...landscape,
      },
      sections: [
        {
          heading: "The journey of the levels",
          items: [
            "Reiki Level 1 teaches: Touch",
            "Reiki Level 2 teaches: Intention",
            "Reiki Level 3 teaches: Presence",
          ],
        },
        {
          heading: "The Inner Master",
          items: [
            "Less fear — more awareness",
            "Less control — more trust",
            "Less ego — more compassion",
            "Less doing — more being",
          ],
          tone: "honor",
        },
      ],
      closing: "That is the journey of the Inner Master.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Day 2 closing",
      title: "Closing Day 2 — Certification Path",
      lead: "You have completed the teaching arc of Reiki Level 3 — The Advanced Healer.",
      sections: [
        {
          heading: "Today you explored",
          items: [
            "Psychic surgery as guided visualization",
            "Cord-cutting / energetic boundary practice",
            "Level 3 attunement",
            "21-day integration practice",
            "Ethics of an advanced Reiki practitioner",
            "Presence before power — the Master mindset",
          ],
        },
        {
          heading: "Certificate",
          text: "Soulara Healing™ Reiki Level 3 Practitioner Certificate — presented with honour for those who complete the training path.",
          tone: "honor",
        },
        {
          heading: "Carry forward",
          items: [
            "Begin your 21-day integration tonight",
            "Protect consent and confidentiality in every session",
            "Choose presence over performance",
          ],
        },
      ],
      closing:
        "End of Day 2 — honour the Inner Master awakening within you. Walk gently. Serve wisely.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, ask anything, and celebrate this deeper step on your Reiki path.",
    },
  ],
};
