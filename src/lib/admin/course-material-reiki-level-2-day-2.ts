import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/reiki-level-2/day-2/${file}`;

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

export const reikiLevel2Day2: CourseMaterialDeck = {
  slug: "reiki-level-2-day-2",
  title: "Reiki Level 2",
  series: "Reiki Level 2",
  dayLabel: "Day 2",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "ready",
  description:
    "Day 2 of the two-day Reiki Level 2 certification — Manifestation: Ask, Believe, Feel, Receive — intention, Law of Attraction, gratitude, visualization, inspired action, and certification closing.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Day 2 · Manifestation · Two-day certification",
      title: "Reiki Level 2",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Reiki Level 2",
      subtitle: "Manifestation — Ask · Believe · Feel · Receive",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Aligning intention with inspired action…",
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
      title: "Manifestation — Ask · Believe · Feel · Receive",
      paragraphs: [
        "Welcome to Day 2 of Reiki Level 2. Yesterday you reinforced the sacred symbols. Today we turn that clarity of intention toward conscious creation — how focus, belief, emotion, gratitude, visualization, and action shape the life you are building.",
        "Manifestation is not simply wishing. It is becoming aligned with what you desire while taking meaningful steps toward it.",
      ],
      image: {
        src: asset("slide-manifestation-welcome.png"),
        alt: "Open hands receiving soft golden light — welcoming conscious manifestation",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Opening",
      title: "Course Intention",
      lead: "This class introduces manifestation as a spiritual and personal-development practice.",
      image: {
        src: asset("slide-course-intention.png"),
        alt: "Golden heart of light representing clear course intention",
        ...landscape,
      },
      sections: [
        {
          heading: "What we explore",
          items: [
            "Intention",
            "Belief",
            "Gratitude",
            "Visualization",
            "Emotional alignment",
            "Inspired action",
            "Trust",
          ],
        },
        {
          heading: "The central message",
          text: "What we repeatedly focus on influences our inner state, what we notice, the choices we make, and the direction in which we move.",
        },
        {
          heading: "Remember",
          text: "Manifestation is not simply about wishing. It is about becoming consciously aligned with the life we desire while taking meaningful action toward it.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Foundations",
      title: "What Is Manifestation?",
      lead: "If you could positively transform one area of your life right now, what would it be?",
      image: {
        src: asset("slide-what-is-manifestation-v2.png"),
        alt: "Meditating figure beneath a starry nebula — conscious connection with universal energy",
        ...landscape,
      },
      sections: [
        {
          heading: "Choose one intention for today",
          items: [
            "Love",
            "Health",
            "Money",
            "Career",
            "Business",
            "Confidence",
            "Family",
            "Peace",
            "Purpose",
            "Spiritual growth",
          ],
        },
        {
          heading: "Every creation begins as an idea",
          text: "A building exists in imagination before it is constructed. A business begins as an idea. A journey begins with deciding where to go. Manifestation begins with clarity.",
        },
        {
          heading: "Conscious manifestation",
          text: "Thinking alone does not guarantee results. Intention needs to influence thoughts, beliefs, emotions, attention, choices, and actions. Where attention goes, energy and effort often follow.",
        },
      ],
      closing:
        "Instead of “I can’t” or “I don’t have,” ask: “What do I want to create from here?”",
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Foundations",
      title: "The Law of Attraction",
      lead: "A spiritual philosophy: what we consistently focus upon and emotionally engage with influences what we attract or experience — commonly expressed as like attracts like.",
      image: {
        src: asset("slide-law-of-attraction.png"),
        alt: "Soft luminous orbs of like energy drawing toward each other",
        ...landscape,
      },
      sections: [
        {
          heading: "Ask yourself",
          text: "What are your dominant thoughts and emotional patterns? If your intention is abundance, but your inner dialogue is “I never have enough,” there is conflict between intention and habitual mindset.",
        },
        {
          heading: "The practice",
          items: [
            "Not simply “think positively”",
            "Become aware of what you repeatedly think, feel, believe, and do",
            "Consciously change patterns that no longer support you",
          ],
        },
        {
          heading: "Important",
          text: "We cannot control every event through our thoughts. Manifestation should never blame someone for illness, hardship, trauma, or circumstances outside their control. Ask: “What can I consciously influence from this moment forward?”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Principle 1",
      title: "Ask — Get Clear About What You Want",
      lead: "Many people know what they don’t want. Manifestation turns attention toward what you do want.",
      image: {
        src: asset("slide-ask-clarity.png"),
        alt: "Journal and soft light — clarifying what you ask for",
        ...landscape,
      },
      sections: [
        {
          heading: "Turn “don’t want” into intention",
          items: [
            "Instead of “I don’t want financial stress” → “I intend greater financial stability, opportunity, and freedom.”",
            "Instead of “I don’t want to be alone” → “I am open to a healthy, loving, mutually respectful relationship.”",
          ],
        },
        {
          heading: "Student exercise",
          items: [
            "My intention is: __________________",
            "I desire this because: __________________",
            "How would my life feel if I moved significantly closer to this intention?",
          ],
        },
        {
          heading: "Why clarity matters",
          text: "Clarity gives your mind direction.",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Principle 2",
      title: "Believe — Transform Limiting Beliefs",
      lead: "You may consciously desire something while holding beliefs that work against it.",
      image: {
        src: asset("slide-believe-beliefs.png"),
        alt: "Golden key unlocking limiting beliefs into possibility",
        ...landscape,
      },
      sections: [
        {
          heading: "Example conflict",
          text: "Desire: “I want a successful business.” Beliefs: “I’m not good enough,” “too many competitors,” “people won’t pay me,” “what if I fail?” These affect confidence, decisions, and behavior.",
        },
        {
          heading: "Transform the belief",
          items: [
            "“I am not capable.” → “I am capable of learning what I need to learn.”",
            "“I never have enough money.” → “I am developing healthier ways of creating, managing, and receiving money.”",
            "“Success is difficult.” → “I am open to opportunities for growth and success.”",
          ],
        },
        {
          heading: "Foundation",
          text: "Ask: “What do I want?” Then: “What belief might be preventing me from fully moving toward it?” Transformed beliefs become the foundation for affirmation.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Principle 3",
      title: "Feel — Affirmations & Emotional Alignment",
      lead: "Affirmations are intentional statements that return attention to the beliefs you want to cultivate — connected with meaning and emotion, not empty words.",
      image: {
        src: asset("slide-feel-affirmations.png"),
        alt: "Hand over heart — feeling affirmations with emotional alignment",
        ...landscape,
      },
      sections: [
        {
          heading: "Examples",
          items: [
            "Abundance — “I am open to abundance, opportunities, and prosperity.”",
            "Confidence — “I trust myself and confidently move toward my goals.”",
            "Love — “I am worthy of healthy, loving, and respectful relationships.”",
            "Success — “I welcome opportunities to learn, grow, and succeed.”",
            "Peace — “I choose peace within myself even when life around me is changing.”",
          ],
        },
        {
          heading: "Practice",
          items: [
            "Select one affirmation",
            "Close the eyes; place a hand over the heart",
            "Repeat slowly three times",
            "Ask: “If I truly believed this, how would I behave differently today?”",
          ],
        },
        {
          heading: "From words to action",
          text: "That question turns an affirmation into action.",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Heart of the practice",
      title: "Gratitude — Three Levels",
      lead: "Gratitude recognizes what is good while continuing to grow — shifting from **“What is missing?”** to **“What is already here?”**",
      image: {
        src: asset("slide-gratitude-three-levels.png"),
        alt: "Three soft levels of light representing past, present, and future gratitude",
        ...landscape,
      },
      sections: [
        {
          heading: "Gratitude for the past",
          text: "Think of something difficult that taught you something valuable.",
          spokenCue: "Say",
          spoken: "Thank you for the wisdom I gained.",
        },
        {
          heading: "Gratitude for the present",
          text: "Think of three things you appreciate today — family, health, home, friendship, work, food, nature, opportunity.",
          spokenCue: "Silently say",
          spoken: "Thank you.",
        },
        {
          heading: "Gratitude for the future",
          text: "Imagine how grateful you would feel as you make progress toward your intention — not from desperation.",
          spokenCue: "Say",
          spoken: "I am grateful for the opportunities, growth and guidance that are helping me move toward this intention.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Principle",
      title: "Visualize — See the Possibility",
      lead: "Visualization is mental rehearsal.",
      image: {
        src: asset("slide-visualize-future.png"),
        alt: "Soft dawn path toward a luminous future — mental rehearsal of possibility",
        ...landscape,
      },
      sections: [
        {
          heading: "Exercise",
          items: [
            "Close your eyes. Imagine yourself about one year from today.",
            "You have made meaningful progress toward your intention.",
            "Where are you? What are you doing? Who are you becoming?",
            "How are you speaking and carrying yourself?",
            "What habits and decisions have changed?",
          ],
        },
        {
          heading: "Most importantly",
          text: "How do you feel — peaceful, confident, grateful, fulfilled? Experience that emotion for a few moments.",
        },
        {
          heading: "Remember the answer",
          text: "Ask: “What did this future version of me begin doing differently?”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Principle",
      title: "Receive — Action, Trust & Surrender",
      lead: "Receiving does not mean sitting and waiting. Manifestation should lead to movement.",
      image: {
        src: asset("slide-receive-action.png"),
        alt: "Open palms receiving light while grounded — action, trust, and surrender",
        ...landscape,
      },
      sections: [
        {
          heading: "Inspired action examples",
          items: [
            "Career — learn, apply, network, prepare",
            "Business — create, market, serve, connect, improve",
            "Relationship — boundaries, communication, availability",
            "Financial growth — learn, plan, save, invest appropriately, create value",
          ],
        },
        {
          heading: "Every morning ask",
          text: "“What is one meaningful action I can take today toward my intention?” Then take it.",
        },
        {
          heading: "Surrender",
          text: "After you have done your part, release the need to control exactly how, when, who, or what path. Remain committed to the intention while flexible about the route.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Final practice",
      title: "5-Minute Manifestation Meditation",
      lead: "Close your eyes. Breathe in peace. Release tension. Place your hand over your heart.",
      image: {
        src: asset("slide-manifestation-meditation.png"),
        alt: "Calm meditation with hand over heart in soft dawn light",
        ...landscape,
      },
      sections: [
        {
          heading: "Journey inward",
          items: [
            "Bring your intention into awareness — see it clearly",
            "Imagine yourself moving toward this new reality",
            "See yourself thinking, speaking, choosing, and acting differently",
            "Notice how this version of you feels",
          ],
        },
        {
          heading: "Silently repeat",
          items: [
            "I am clear about what I desire.",
            "I am willing to release beliefs that no longer serve me.",
            "I am open to new possibilities.",
            "I am grateful for everything already present in my life.",
            "I welcome opportunities aligned with my highest good.",
            "I trust myself to recognize opportunities and take meaningful action.",
          ],
        },
        {
          heading: "Close",
          text: "Visualize again with gratitude — not desperation or fear. Ask: “What is one action I can take toward this intention?” Open your eyes and carry that intention into your day.",
        },
      ],
    },
    {
      kind: "topic-sections",
      layout: "stack",
      density: "compact",
      eyebrow: "Integration",
      title: "The Soulara Manifestation Formula",
      lead: "Ask → Believe → Feel → Give Thanks → Visualize → Act → Trust → Receive",
      image: {
        src: asset("slide-manifestation-formula.png"),
        alt: "Elegant golden pathway of connected light nodes — the manifestation formula",
        ...landscape,
      },
      sections: [
        {
          heading: "Ask",
          text: "Become clear about what you want.",
        },
        {
          heading: "Believe",
          text: "Identify and transform beliefs that conflict with your intention.",
        },
        {
          heading: "Feel",
          text: "Cultivate gratitude, hope, confidence, love, and peace.",
        },
        {
          heading: "Give thanks · Visualize · Act · Trust · Receive",
          items: [
            "Recognize abundance already present",
            "Mentally rehearse living in alignment with your intention",
            "Take practical and inspired action",
            "Stop trying to control every detail of the journey",
            "Remain open to opportunities — including ones you had not imagined",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Daily rhythm",
      title: "Daily 5-Minute Practice",
      lead: "Every morning:",
      image: {
        src: asset("slide-manifestation-closing.png"),
        alt: "Morning light on journal and chair — daily practice and next steps",
        ...landscape,
      },
      sections: [
        {
          heading: "Minute 1 — Gratitude",
          text: "Name three things you appreciate.",
        },
        {
          heading: "Minute 2 — Affirmation",
          text: "Repeat your chosen affirmation slowly.",
        },
        {
          heading: "Minutes 3–4 — Visualization",
          text: "See yourself living and acting in alignment with your intention.",
        },
        {
          heading: "Minute 5 — Action",
          text: "Ask: “What is one thing I will do today to move toward this?” Write it down. Then do it.",
        },
      ],
    },
    {
      kind: "quote",
      eyebrow: "Closing message",
      title: "Remember",
      quote:
        "You do not need to know the entire path. You simply need enough clarity and courage to take the next step.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Closing",
      title: "Ask. Believe. Feel. Give Thanks. Visualize. Act. Trust. Receive.",
      lead: "Manifestation begins with asking for what you desire. Transformation begins when you become willing to change yourself in the process.",
      sections: [
        {
          heading: "Carry forward",
          items: [
            "Be clear about what you want",
            "Believe that growth is possible",
            "Feel gratitude for what you already have",
            "Visualize where you are going",
            "Take action when opportunities appear",
            "Release the need to control every detail",
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
          text: "Deepen mastery, advanced healing work, and the next chapter of your practitioner path.",
        },
      ],
      closing:
        "End of Reiki Level 2 Training — honor yourself for completing The Reinforcements and stepping into conscious manifestation.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, ask anything, and celebrate this milestone on your Reiki path.",
    },
  ],
};
