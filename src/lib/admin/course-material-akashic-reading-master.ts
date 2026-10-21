import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/akashic-reading-master/${file}`;

const brandLogo = {
  src: "/course-material/reiki-level-1/cover-logo.png",
  alt: "Soulara Healing Training Academy",
  width: 939,
  height: 271,
} as const;

export const akashicReadingMaster: CourseMaterialDeck = {
  slug: "akashic-reading-master",
  title: "Akashic Reading Master",
  duration: "1 Day",
  sessionDurationMinutes: 480,
  status: "ready",
  description:
    "One-day Soul Records Practitioner Method. Enter with reverence, read with discernment, interpret with compassion, and close with integrity.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Premium Practitioner Training · One-day intensive",
      title: "Akashic Reading Master",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Akashic Reading Master",
      subtitle: "The Soul Records Practitioner Method",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Enter with reverence…",
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
      eyebrow: "Understanding the Akashic Records",
      title: "What are the Akashic Records?",
      quote:
        "Akashic Reading is a contemplative spiritual practice in which the practitioner enters a focused state of awareness and receives intuitive, symbolic or reflective information related to the client's question.",
      image: {
        src: asset("open-records.png"),
        alt: "Open book with pages fanned upward and sparks of light rising from the pages",
        width: 1024,
        height: 1024,
      },
    },
    {
      kind: "story",
      eyebrow: "Understanding the Akashic Records",
      title: "An energetic repository",
      paragraphs: [
        "Akashic Records are spiritual concepts describing an energetic or symbolic repository of information associated with consciousness, experiences, patterns, lessons and possibilities.",
        "Core philosophy: Enter with reverence. Read with discernment. Interpret with compassion. Close with integrity.",
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "The reading",
      title: "What a practitioner may explore",
      sections: [
        {
          heading: "Within the client's question",
          items: [
            "Recurring life patterns",
            "Emotional themes",
            "Relationships",
            "Personal lessons",
            "Limiting beliefs",
            "Sense of purpose",
            "Repeated experiences",
            "Ancestral/spiritual symbolism",
            "Choices and possibilities",
            "Areas requiring reflection",
            "Inner strengths",
            "Personal growth",
          ],
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Context",
      title: "Journey of the Akashic Records Concept",
      image: {
        src: asset("journey.png"),
        alt: "Five-stage timeline: Ancient Civilizations, Religious Texts, Theosophy Movement, Esoteric Traditions, and Modern Spirituality",
        width: 1206,
        height: 636,
      },
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Practitioner preparation",
      title: "The Soulara 5-Point Preparation",
      lead: "Before opening a client's Records:",
      sections: [
        {
          heading: "1. Ground",
          text: "Feet connected to the floor. Slow the breath. Bring attention into the body.",
        },
        {
          heading: "2. Clear",
          text: "Imagine releasing distractions, expectations and emotional residue.",
        },
        {
          heading: "3. Protect",
          text: "Visualize a soft field of light surrounding practitioner and client.",
        },
        {
          heading: "4. Intend",
          text: "State the purpose of the session.",
        },
        {
          heading: "5. Surrender",
          text: "Release the desire to “get something.”",
          tone: "honor",
        },
      ],
      closing:
        "This is important. A practitioner should not force an answer because silence feels uncomfortable.",
    },
    {
      kind: "image-focus",
      eyebrow: "Practitioner preparation",
      title: "Preparation script",
      image: {
        src: asset("opening-portal.png"),
        alt: "A robed figure seated on books, holding an open book before a luminous circular portal",
        width: 1024,
        height: 1024,
      },
    },
    {
      kind: "story",
      eyebrow: "Practitioner preparation",
      title: "Preparation script",
      paragraphs: [
        "“I now bring my awareness fully into this present moment. I release the events of the day, the expectations I may be carrying and the desire to know what I think I should know.”",
        "“I ground myself in the present. I create a calm and respectful space for this session. May everything that arises during this reading be approached with compassion, discernment and respect for the client's autonomy.”",
        "“I do not need to force information. I allow awareness, symbolism and intuition to arise naturally. I remain grounded, observant and discerning.”",
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Intention and questions",
      title: "Transform vague questions",
      lead: "A premium practitioner doesn't simply ask: “What does my future look like?”",
      sections: [
        {
          heading: "Money",
          text: "Weak: “Will I become rich?”",
          spokenCue: "Better",
          spoken: "What patterns around money and self-worth might be useful for me to explore?",
        },
        {
          heading: "Relationship",
          text: "Weak: “Will this person marry me?”",
          spokenCue: "Better",
          spoken:
            "What can I understand about the relationship dynamic and my own growth within it?",
        },
        {
          heading: "Health",
          text: "Weak: “What disease do I have?” Not appropriate for Akashic Reading.",
          spokenCue: "Better",
          spoken: "What emotional or spiritual themes may be useful for me to reflect upon?",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "The Soulara question framework",
      title: "PLAN",
      sections: [
        { heading: "P — Pattern", text: "What keeps repeating?" },
        { heading: "L — Lesson", text: "What might this experience be inviting me to understand?" },
        { heading: "A — Awareness", text: "What am I not currently seeing?" },
        { heading: "N — Next Step", text: "What constructive action can I consider?" },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "The Soulara opening method",
      title: "S.O.U.L.A.R.A.",
      sections: [
        { heading: "S — Stillness", text: "Become quiet." },
        { heading: "O — Opening intention", text: "State the purpose of the reading." },
        { heading: "U — Understanding", text: "Connect with the client's question." },
        {
          heading: "L — Listening",
          text: "Observe impressions without immediately interpreting them.",
        },
        { heading: "A — Ask", text: "Ask focused questions internally." },
        {
          heading: "R — Receive",
          text: "Allow symbols, sensations, words, memories or impressions to arise.",
        },
        { heading: "A — Anchor", text: "Bring the information back into practical reflection." },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Intuition",
      title: "The Four Channels",
      caption: "Four possible ways practitioners may experience intuitive information.",
      image: {
        src: asset("four-channels.png"),
        alt: "Four channels: Clairvoyant-style, Clairaudient-style, Clairsentient-style, and Knowing",
        width: 1206,
        height: 641,
      },
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "The Four Main Clairs",
      title: "How information may arrive",
      sections: [
        {
          heading: "Clairvoyance — Clear Seeing",
          text: "The ability to perceive information through the mind's eye. It manifests as internal mental images, symbols, visions, or dreams.",
        },
        {
          heading: "Clairaudience — Clear Hearing",
          text: "The ability to perceive sounds or inner voices. It shows up as words, phrases, songs, or direct mental messages.",
        },
        {
          heading: "Clairsentience — Clear Feeling",
          text: "The ability to sense energy, emotions, or physical sensations in the body. Clairsentients often act as empaths, picking up gut feelings or the emotional atmosphere of a room.",
        },
        {
          heading: "Claircognizance — Clear Knowing",
          text: "The ability to instantly know something as absolute truth without a logical explanation. It feels like a sudden mental download or information pouring into the mind.",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Quick self-assessment",
      title: "Which is your strongest?",
      lead: "Think about how you naturally interact with the world and pick the statement that fits you best.",
      sections: [
        {
          heading: "Clairvoyance",
          text: "If you are highly visual — you remember faces easily, dream in vivid colour, and think in pictures — your primary gift is likely Clairvoyance.",
        },
        {
          heading: "Clairaudience",
          text: "If you are a sensitive listener — deeply moved by music, easily bothered by loud noises, and you talk to yourself to process thoughts — your primary gift is likely Clairaudience.",
        },
        {
          heading: "Clairsentience",
          text: "If you are a natural empath — you instantly absorb the mood of a room, get strong gut feelings, and feel physically drained by negative people — your primary gift is likely Clairsentience.",
        },
        {
          heading: "Claircognizance",
          text: "If you are a sharp problem-solver — you just know the answer without a spreadsheet, sense when someone is lying, and get sudden strokes of genius — your primary gift is likely Claircognizance.",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Daily practice",
      title: "Developing clairvoyance and clairaudience",
      sections: [
        {
          heading: "Clairvoyance — Clear Seeing",
          items: [
            "Visualization practice: close your eyes and picture a simple object, like a red apple. Try to see its texture, the stem, and how light reflects off it.",
            "Dream journaling: write down your dreams immediately upon waking to train your mind to look for symbolic imagery.",
          ],
        },
        {
          heading: "Clairaudience — Clear Hearing",
          items: [
            "Layered listening: sit quietly in nature or a park. Try to isolate the quietest sound you can hear, like a distant bird or wind rustling a single leaf.",
            "Internal dialogue: ask your intuition a direct question before going to sleep, and pay attention to the very first word or phrase that pops into your head when you wake up.",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Daily practice",
      title: "Developing clairsentience and claircognizance",
      sections: [
        {
          heading: "Clairsentience — Clear Feeling",
          items: [
            "Object reading (psychometry): hold a small object belonging to a friend, like a ring or keys. Close your eyes and note what emotions or physical sensations bubble up.",
            "Body scans: when entering a new building, check in with your physical body. Do your shoulders tighten? Does your chest open up?",
          ],
        },
        {
          heading: "Claircognizance — Clear Knowing",
          items: [
            "Automatic writing: set a timer for five minutes, ask a question on paper, and write continuously without stopping to think, edit, or filter your thoughts.",
            "Trusting the first impression: practice making small, low-stakes decisions, like picking a route home or a menu item, based entirely on your immediate, uncalculated first instinct.",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "The three-layer reading",
      title: "Read through three layers",
      sections: [
        { heading: "Layer 1 — Observation", text: "“What am I noticing?”" },
        { heading: "Layer 2 — Meaning", text: "“What could this symbol or impression represent?”" },
        { heading: "Layer 3 — Client resonance", text: "“Does this have relevance to your experience?”" },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Discernment",
      title: "The D.E.E.P. Check",
      lead: "Not every impression should be spoken aloud. Before sharing an impression, ask:",
      sections: [
        { heading: "D", text: "Does it relate to the intention?" },
        { heading: "E — Ethics", text: "Is it ethically appropriate?" },
        { heading: "E — Certainty", text: "Can I present it without claiming certainty?" },
        { heading: "P", text: "Does sharing it empower the client?" },
      ],
      closing: "If the answer is no, pause.",
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Professional language",
      title: "Language of a professional Akashic practitioner",
      sections: [
        {
          heading: "Ancestral presence",
          text: "Instead of: “Your grandmother is telling me…”",
          spokenCue: "Use",
          spoken:
            "I'm receiving an image that reminds me of an elder or ancestral presence. I'd like to explore whether that has meaning for you.",
        },
        {
          heading: "Relationships",
          text: "Instead of: “You will meet your soulmate next year.”",
          spokenCue: "Use",
          spoken:
            "I'm noticing relationship themes that may be worth exploring, but I wouldn't treat this as a prediction or guarantee.",
        },
        {
          heading: "Past imagery",
          text: "Instead of: “You were definitely a healer in a past life.”",
          spokenCue: "Use",
          spoken:
            "A healer archetype is appearing in the imagery. You may wish to explore what that archetype represents for you.",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Integration method",
      title: "End the reading with reflection",
      lead: "This transforms the session from simply receiving mystical information into reflection and practical integration.",
      sections: [
        { heading: "Awareness", text: "“What did I discover?”" },
        { heading: "Release", text: "“What no longer serves me?”" },
        { heading: "Choice", text: "“What can I choose differently?”" },
        { heading: "Action", text: "“What is one practical step I can take?”" },
      ],
    },
    {
      kind: "story",
      eyebrow: "Closing the Records",
      title: "Never end the session abruptly",
      paragraphs: [
        "“I acknowledge and appreciate everything that arose during this session. I now bring this reading to completion. I release the intention of accessing further information at this time.”",
        "“I return my awareness fully to the present moment. I become aware of my breath. I become aware of my body. I become aware of the room around me.”",
        "“I allow anything that belongs to the client to remain with the client, and anything that belongs to me to remain with me. The session is now complete. I am grounded, present and fully here.”",
        "Pause. Take three slow breaths.",
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Akashic reading for different themes",
      title: "Four themed readings",
      sections: [
        {
          heading: "Relationship reading",
          items: [
            "Relationship patterns",
            "Boundaries",
            "Attachment themes",
            "Recurring dynamics",
            "Personal growth",
          ],
          text: "Avoid declaring another person's private thoughts or guaranteed future actions.",
        },
        {
          heading: "Career reading",
          items: ["Values", "Motivation", "Confidence", "Recurring blocks", "Possibilities", "Decision-making"],
        },
        {
          heading: "Abundance reading",
          items: [
            "Beliefs about money",
            "Receiving",
            "Self-worth",
            "Fear",
            "Scarcity narratives",
            "Personal meaning of success",
          ],
        },
        {
          heading: "Purpose reading",
          items: [
            "Strengths",
            "Interests",
            "Values",
            "Recurring themes",
            "Meaningful contribution",
            "Possible directions",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "The symbolic language of the Records",
      title: "Four recurring symbols",
      sections: [
        {
          heading: "Door",
          items: ["Transition", "Opportunity", "Boundary", "Choice", "Unknown territory"],
        },
        {
          heading: "Water",
          items: ["Emotion", "Movement", "Cleansing", "Uncertainty", "Adaptability"],
        },
        {
          heading: "Mountain",
          items: ["Challenge", "Achievement", "Perspective", "Endurance", "Aspiration"],
        },
        {
          heading: "Light",
          items: ["Awareness", "Clarity", "Hope", "Spiritual meaning"],
        },
      ],
    },
    {
      kind: "bullets",
      eyebrow: "Reading for life purpose · 10 minutes",
      title: "Reflect patterns, don't predict destiny",
      lead: "Inspired by the soul-purpose orientation in Linda Howe's later work, which explores identifying a soul path and moving toward purposeful living.",
      items: [
        "“What themes keep appearing throughout your life?”",
        "“What activities make you feel most alive?”",
        "“What challenge has repeatedly asked you to grow?”",
        "“What contribution feels meaningful to you?”",
        "“What part of yourself have you been postponing?”",
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Akashic healing",
      title: "The Soulara Healing Sequence",
      lead: "Rather than saying “The Records will heal your trauma,” teach that practitioners may use the Records as a reflective space for exploring emotional patterns, forgiveness, meaning and personal transformation.",
      sections: [
        {
          heading: "Recognize",
          text: "“I repeatedly feel responsible for everyone.”",
        },
        {
          heading: "Understand",
          text: "“Where might this pattern have developed?”",
        },
        {
          heading: "Reframe",
          text: "“Can responsibility coexist with healthy boundaries?”",
        },
        {
          heading: "Choose",
          text: "“What would I like to do differently?”",
        },
        {
          heading: "Integrate",
          text: "“What practical boundary can I establish?”",
        },
      ],
      closing: "Recognize → Understand → Reframe → Choose → Integrate",
    },
    {
      kind: "bullets",
      eyebrow: "The Soulara 7 Golden Rules",
      title: "Always return the client to choice",
      items: [
        "Never force information.",
        "Observe before interpreting.",
        "Never present intuition as an unquestionable fact.",
        "Let the client participate in meaning-making.",
        "Don't predict someone's future with certainty.",
        "Don't create fear or dependency.",
        "Always return the client to personal choice.",
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Final practitioner exercise",
      title: "A.K.A.S.H.A.",
      lead: "Fictional client: “I keep attracting relationships where I give much more than I receive. Why does this keep happening?”",
      sections: [
        { heading: "A — Alignment", text: "Ground." },
        { heading: "K — Key question", text: "Clarify." },
        { heading: "A — Access", text: "Enter reading state." },
        { heading: "S — Sense", text: "Receive an image or impression." },
        { heading: "H — Harmonize", text: "Explore with the client." },
        { heading: "A — Anchor", text: "Identify one practical step." },
      ],
    },
    {
      kind: "bullets",
      eyebrow: "Recommended reading",
      title: "Continue with these books",
      lead: "Linda Howe's current guidance recommends How to Read the Akashic Records for Level I, Healing Through the Akashic Records and/or The Heart of the Akashic Records Revealed for Level II, and Discover Your Soul's Path plus Akashic Manifesting for Level III.",
      items: [
        "Linda Howe — How to Read the Akashic Records. Foundational reading methodology. The revised edition was published March 24, 2026.",
        "Linda Howe — Healing Through the Akashic Records. Healing-oriented work.",
        "Linda Howe — Discover Your Soul's Path Through the Akashic Records. Purpose and soul-path exploration.",
        "Linda Howe — The Heart of the Akashic Records Revealed. Deeper exploration of her overall methodology.",
        "Sandra Anne Taylor — The Akashic Records Made Easy. An accessible introduction and practical exploration.",
      ],
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Enter with reverence. Read with discernment. Interpret with compassion. Close with integrity.",
    },
  ],
};
