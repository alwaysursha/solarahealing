import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/clinical-hypnotherapy/${file}`;

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

export const clinicalHypnotherapy: CourseMaterialDeck = {
  slug: "clinical-hypnotherapy",
  title: "Clinical Hypnotherapy",
  duration: "1 Day",
  sessionDurationMinutes: 480,
  status: "ready",
  description:
    "One-day Hypnotherapy Practitioner Training — Mind · Subconscious · Transformation. Theory, demonstration, and practical training for beginners and complementary wellness practitioners.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Practitioner / Professional Training · One-day intensive",
      title: "Clinical Hypnotherapy",
    },
    {
      kind: "cover",
      eyebrow: "Soulara Healing Academy",
      title: "Hypnotherapy Practitioner Training",
      subtitle: "Mind · Subconscious · Transformation",
      teacher: "Vanita Bassi",
      teacherRoles:
        "Reiki Master · PLR Therapist · Akashic Reader · Clinical Hypnotherapist · NLP Coach",
      journeyLine: "Focused attention. Lasting change…",
      duration: "1 Day",
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
      title: "Welcome to Hypnotherapy Practitioner Training.",
      paragraphs: [
        "Today you will learn how focused attention, therapeutic conversation, imagery, and carefully formulated suggestions can support meaningful change.",
        "Format: Theory + Demonstration + Practical Training. Suitable for beginners and complementary wellness practitioners.",
      ],
      image: {
        src: asset("slide-hypno-welcome.png"),
        alt: "Luminous open mind of soft violet-gold light above a calm horizon",
        ...landscape,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Foundations",
      title: "Introduction to Hypnosis & Hypnotherapy",
      lead: "Clarify the difference — and the partnership — between hypnosis and hypnotherapy.",
      image: {
        src: asset("slide-hypno-vs-therapy.png"),
        alt: "Calm hypnotherapy session with soft spiral of violet-gold attention light",
        ...landscape,
      },
      sections: [
        {
          heading: "Hypnosis",
          items: [
            "An alteration of the state of mind",
            "Relaxes and opens the mind to suggestions",
            "May be used for various purposes, including entertainment and therapy",
          ],
        },
        {
          heading: "Hypnotherapy",
          items: [
            "Uses hypnotic states for therapeutic purposes",
            "Supports desired behavioural or attitudinal change",
            "Conducted within a professional, consent-based framework",
          ],
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Foundations",
      title: "What Is Hypnosis?",
      lead: "A state of focused attention, increased absorption, and heightened responsiveness to appropriate suggestions.",
      image: {
        src: asset("slide-hypno-vs-therapy.png"),
        alt: "Serene focused attention in a calm clinical hypnosis setting",
        ...landscape,
      },
      sections: [
        {
          heading: "It is not",
          items: [
            "Sleep",
            "Loss of consciousness",
            "Mind control",
            "Possession",
            "Being powerless",
            "Being forced to reveal secrets",
            "Being unable to stop the session",
          ],
        },
        {
          heading: "Important",
          text: "The client generally remains capable of accepting or rejecting suggestions.",
          tone: "honor",
        },
        {
          heading: "What is hypnotherapy?",
          text: "Hypnotherapy uses hypnotic states together with therapeutic conversation, imagery, relaxation, and carefully formulated suggestions to support desired changes.",
        },
        {
          heading: "Examples include",
          items: [
            "Confidence building",
            "Relaxation",
            "Performance preparation",
            "Habit modification",
            "Stress management",
            "Sleep-support routines",
            "Study and concentration support",
            "Pain-management support as an adjunct to appropriate healthcare",
            "Behavioural change",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Foundations",
      title: "How the Mind Works",
      lead: "Use the conscious / subconscious model as a useful therapeutic concept — not as a precise anatomical part of the brain.",
      image: {
        src: asset("slide-hypno-mind-iceberg-head.png"),
        alt: "Silhouette of a head containing an iceberg — conscious tip and vast subconscious depth",
        ...landscape,
      },
      sections: [
        {
          heading: "The conscious mind",
          items: [
            "Logical thinking",
            "Analysis",
            "Decision-making",
            "Short-term attention",
            "Critical evaluation",
          ],
        },
        {
          heading: "The subconscious / automatic mind",
          items: [
            "Learned habits",
            "Emotional associations",
            "Automatic behaviours",
            "Conditioned responses",
            "Memories and learned patterns",
          ],
          tone: "honor",
        },
      ],
    },
    {
      kind: "image-focus",
      eyebrow: "Mind model",
      title: "Conscious Tip · Subconscious Depth",
      image: {
        src: asset("slide-hypno-mind-iceberg.png"),
        alt: "Iceberg metaphor — small conscious tip above water, vast subconscious mass below",
        ...landscape,
      },
      caption:
        "Conscious thinking is only a small tip. Habits, beliefs, emotions, identity, and long-term memory live in the vast depth beneath.",
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Applications",
      title: "10 Ways Hypnotherapy Can Help",
      lead: "Supportive applications — always within consent, scope of practice, and appropriate referral.",
      image: {
        src: asset("slide-hypno-ten-ways.png"),
        alt: "Ten luminous circular wellness symbols on a deep purple gold-accented field",
        ...landscape,
      },
      sections: [
        {
          heading: "Common supportive areas",
          items: [
            "Stop smoking — psychological habit support",
            "Weight / healthy relationship with body",
            "Depression & anxiety support (complementary)",
            "Confidence & self-esteem",
            "Fears & phobias (with appropriate competence)",
            "Sports focus and performance",
            "Business focus and creativity",
            "Pain support as an adjunct to healthcare",
            "Goal motivation and determination",
            "Wealth mindset / removing money blocks",
          ],
        },
        {
          heading: "Remember",
          text: "Hypnotherapy supports change. It does not replace medical or psychiatric care when those are needed.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Session structure",
      title: "The Hypnotherapy Session",
      lead: "Learn the complete session structure from intake to reorientation, with professional communication and ethics.",
      image: {
        src: asset("slide-hypno-session.png"),
        alt: "Calm hypnotherapist supporting a relaxed client in a soft cream wellness studio",
        ...landscape,
      },
      sections: [
        {
          heading: "Step 1 — Pre-talk",
          items: [
            "Client’s goal and desired outcome",
            "Current difficulties",
            "Previous experience with hypnosis",
            "Expectations and concerns",
            "Relevant medical/psychological treatment",
            "Consent",
          ],
        },
        {
          heading: "Step 2 — Goal formulation",
          text: "Instead of “I want to stop being anxious,” help the client formulate: “I want to feel calmer and more confident when speaking in public.”",
        },
        {
          heading: "Step 3 — Explain hypnosis",
          text: "Tell the client: “You remain aware throughout the process. You can speak, move, or stop whenever you wish.”",
        },
        {
          heading: "Steps 4–8",
          items: [
            "Induction — relaxing, breathing, and counting",
            "Deepening — increase relaxation and focused attention",
            "Therapeutic work — suggestions, visualization, metaphors, rehearsal, future pacing, anchoring",
            "Reorientation — return to normal alertness",
            "Debrief — experience, observations, practice, next steps",
          ],
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Inductions",
      title: "10 Hypnotic Induction Methods — 1 to 5",
      lead: "Master powerful induction techniques to guide clients into a focused and receptive state.",
      image: {
        src: asset("slide-hypno-inductions.png"),
        alt: "Luminous lavender-gold lotus floating on soft violet ripples",
        ...landscape,
      },
      sections: [
        {
          heading: "1. Progressive relaxation",
          text: "Guide attention through the body — feet, legs, abdomen, chest, shoulders, arms, neck, face — allowing muscles to soften with each comfortable breath.",
        },
        {
          heading: "2. Eye-fixation",
          text: "Ask the client to comfortably focus on a stationary point. Never force prolonged eye strain.",
        },
        {
          heading: "3. Breathing",
          text: "Use slow, comfortable breathing. Objective: focused attention and relaxation — not hyperventilation.",
        },
        {
          heading: "4. Counting",
          text: "Guide attention through a descending count — for example, 10 toward 1 — into progressive relaxation.",
        },
        {
          heading: "5. Staircase visualization",
          text: "Invite imagining ten comfortable steps. Imagery exercise — not literal proof of a special physiological depth.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Inductions",
      title: "10 Hypnotic Induction Methods — 6 to 10",
      lead: "Continue with imagery, ideomotor, fractionation, and permissive conversational styles.",
      image: {
        src: asset("slide-hypno-inductions.png"),
        alt: "Radiant lotus of focused attention and receptive calm",
        ...landscape,
      },
      sections: [
        {
          heading: "6. Safe-place visualization",
          items: ["Visual details", "Sounds", "Temperature", "Textures", "Comfortable sensations"],
        },
        {
          heading: "7. Hand levitation / ideomotor",
          text: "Explore spontaneous movement through imagination and suggestion. Never pressure a particular response.",
        },
        {
          heading: "8. Confusion / pattern-break",
          text: "Temporary interruption of habitual attention — only with proper training and consent. Avoid frightening, deception, humiliation, or manipulation.",
        },
        {
          heading: "9. Fractionation",
          text: "Relax → briefly open eyes → close eyes → deepen. Repetition strengthens familiarity with the procedure.",
        },
        {
          heading: "10. Conversational / Ericksonian-style",
          text: "Ordinary conversation with permissive language and imagery. Teach as a communication style — not covert control.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Technique",
      title: "Deepening Techniques",
      lead: "Increase relaxation and focused attention after induction.",
      image: {
        src: asset("slide-hypno-deepening.png"),
        alt: "Descending staircase of soft golden light into peaceful violet mist",
        ...landscape,
      },
      sections: [
        {
          heading: "Methods",
          items: [
            "Counting down — 10 → 1",
            "Elevator visualization — descending gradually",
            "Staircase — step-by-step relaxation",
            "Floating — lighter and more comfortable",
            "Safe place — return to the client’s peaceful environment",
          ],
        },
        {
          heading: "Deepening script",
          text: "“And now, without needing to force anything, allow this comfortable state to become a little deeper. You don’t need to try. Simply allow.”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Language",
      title: "Therapeutic Suggestions",
      lead: "Students learn how to construct effective, ethical suggestions.",
      image: {
        src: asset("slide-hypno-suggestions.png"),
        alt: "Soft golden suggestion-light rising above an open cream journal",
        ...landscape,
      },
      sections: [
        {
          heading: "Poor suggestion",
          text: "“You will never feel nervous again.”",
        },
        {
          heading: "Better suggestion",
          text: "“You are learning to respond to challenging situations with increasing calm, confidence and choice.”",
          tone: "honor",
        },
        {
          heading: "Make suggestions",
          items: [
            "Positive",
            "Realistic",
            "Specific",
            "Client-centred",
            "Behaviourally oriented",
            "Respectful of autonomy",
          ],
        },
        {
          heading: "Avoid negative framing",
          text: "Instead of “Don’t smoke,” use: “You are developing new choices that support the kind of life you want.”",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Applications",
      title: "Self-Confidence & Self-Esteem",
      lead: "Support clients in developing confidence, positive self-talk, assertiveness, and performance calm.",
      image: {
        src: asset("slide-hypno-confidence.png"),
        alt: "Confident calm figure standing in soft golden dawn light with violet aura",
        ...landscape,
      },
      sections: [
        {
          heading: "Visualization — Past → Present → Future",
          text: "Ask: “What would the confident version of you look like?” Then rehearse posture, breathing, voice, eye contact, calmness, and decision-making.",
        },
        {
          heading: "Future-pacing script",
          text: "“Imagine yourself several weeks from now, entering that situation with greater calm and confidence. Notice how you stand, how you breathe and how naturally you respond.”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Applications",
      title: "Habit Change",
      lead: "Understand the habit loop: Trigger → Behaviour → Reward.",
      image: {
        src: asset("slide-hypno-habit.png"),
        alt: "Three connected golden-violet light nodes representing a habit cycle",
        ...landscape,
      },
      sections: [
        {
          heading: "Examples",
          items: [
            "Stress → snacking → comfort",
            "Boredom → scrolling → stimulation",
            "Anxiety → avoidance → temporary relief",
          ],
        },
        {
          heading: "Therapeutic process",
          items: [
            "Identify trigger",
            "Identify automatic behaviour",
            "Identify underlying need",
            "Develop healthier alternative",
            "Rehearse alternative",
            "Future pace",
            "Reinforce choice",
          ],
        },
        {
          heading: "Suggestion example",
          text: "“When you notice the familiar trigger, you can pause, breathe, notice the choice available to you, and choose the response that better supports your goals.”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Ethics & scope",
      title: "Support for Substance-Use Behaviour",
      lead: "Present hypnotherapy as complementary behavioural support — not a stand-alone cure for substance-use disorders.",
      image: {
        src: asset("slide-hypno-ethics.png"),
        alt: "Protective golden heart of light held in open hands — ethical practice",
        ...landscape,
      },
      sections: [
        {
          heading: "A hypnotherapist may support",
          items: [
            "Motivation",
            "Confidence",
            "Coping strategies",
            "Habit awareness",
            "Relaxation",
            "Behavioural rehearsal",
            "Commitment to recovery",
          ],
        },
        {
          heading: "Never",
          items: [
            "Tell someone to stop prescribed medication",
            "Replace addiction treatment",
            "Promise a cure",
            "Use hypnosis without informed consent",
            "Secretly hypnotize someone",
            "Use coercion",
          ],
          tone: "honor",
        },
      ],
      closing: "Where appropriate, refer clients to qualified medical / addiction professionals.",
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Ethics & scope",
      title: "Depression & Anxiety: Ethical Application",
      lead: "Teach this as supportive hypnotherapy — not medical treatment.",
      image: {
        src: asset("slide-hypno-anxiety-support.png"),
        alt: "Peaceful dock over a calm lavender lake at soft sunrise",
        ...landscape,
      },
      sections: [
        {
          heading: "Anxiety-support focus",
          items: [
            "Breathing",
            "Grounding",
            "Relaxation",
            "Safe-place imagery",
            "Confidence",
            "Present-moment attention",
            "Future rehearsal",
          ],
        },
        {
          heading: "Depression-support complementary goals",
          items: [
            "Self-compassion",
            "Motivation",
            "Positive activity rehearsal",
            "Strength identification",
            "Relaxation",
            "Future-oriented imagery",
          ],
        },
        {
          heading: "Refer when needed",
          text: "If a client has significant depression, suicidal thoughts, psychosis, mania, severe trauma symptoms, or another serious mental-health concern, refer to an appropriate licensed professional rather than attempting to manage the condition through hypnosis alone.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Applications",
      title: "Pain Control with Hypnotherapy",
      lead: "Hypnosis may be used by appropriately trained practitioners as an adjunctive pain-management technique.",
      image: {
        src: asset("slide-hypno-pain.png"),
        alt: "Gentle hand on shoulder with luminous violet-gold healing light vortex",
        ...landscape,
      },
      sections: [
        {
          heading: "Teach",
          items: [
            "Attention shifting — breath, sound, imagery, temperature, neutral sensations",
            "Glove anesthesia imagery — comfortable numbing or cooling in the hand",
            "Temperature imagery — cool ease spreading through the area",
            "Dissociation — observe sensations without immediate reaction",
          ],
        },
        {
          heading: "Important safety rule",
          text: "Do not suggest that hypnosis has eliminated the underlying cause of pain. Persistent, severe, unexplained, or worsening pain requires appropriate medical assessment.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Applications",
      title: "Hypnosis for Study & Exam Performance",
      lead: "Support concentration, motivation, confidence, memory strategies, and reduced performance anxiety.",
      image: {
        src: asset("slide-hypno-study.png"),
        alt: "Peaceful study desk by a window in soft morning gold light",
        ...landscape,
      },
      sections: [
        {
          heading: "Study visualization",
          items: [
            "Sitting at the study area",
            "Putting away distractions",
            "Beginning the task",
            "Maintaining attention",
            "Taking appropriate breaks",
            "Completing the session",
            "Feeling satisfied with effort",
          ],
        },
        {
          heading: "Suggestion",
          text: "“Each time you begin your study routine, it becomes easier to settle your attention and begin.”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Special populations",
      title: "Hypnotherapy for Children",
      lead: "Helping children develop good habits through hypnosis — with special consideration and guardian involvement.",
      image: {
        src: asset("slide-hypno-children.png"),
        alt: "Soft glowing calmness orb held gently — child-friendly visualization metaphor",
        ...landscape,
      },
      sections: [
        {
          heading: "Appropriate areas",
          items: [
            "Bedtime relaxation",
            "Study routines",
            "Confidence",
            "Performance preparation",
            "Positive habits",
            "Relaxation skills",
          ],
        },
        {
          heading: "Child-friendly technique",
          items: ["Stories", "Imagination", "Characters", "Adventure metaphors", "Drawing", "Breathing games"],
        },
        {
          heading: "Example",
          text: "“Imagine you have a special calmness button inside you. Every time you take a slow breath, you can imagine turning that button on.”",
          tone: "honor",
        },
      ],
      closing:
        "Do not use hypnosis to manipulate children into obedience or to force disclosure of private information.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Technique",
      title: "Therapeutic Metaphors",
      lead: "Learn to create stories that represent the desired change.",
      image: {
        src: asset("slide-hypno-metaphor.png"),
        alt: "Luminous garden path watered with golden light — mind as a garden metaphor",
        ...landscape,
      },
      sections: [
        {
          heading: "Example — The Garden Metaphor",
          text: "“Imagine your mind is like a garden. Whatever you repeatedly water receives attention and grows. You can begin choosing which thoughts and behaviours deserve your energy.”",
          tone: "honor",
        },
        {
          heading: "Teach",
          items: [
            "Metaphorical storytelling",
            "Symbolism",
            "Client-specific language",
            "Positive imagery",
            "Future orientation",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Technique",
      title: "Anchoring",
      lead: "Associate a chosen physical cue with a calm state — a learned association, not a magical mechanism.",
      image: {
        src: asset("slide-hypno-anchoring.png"),
        alt: "Elegant hands gently pressing thumb and finger with soft golden calm light",
        ...landscape,
      },
      sections: [
        {
          heading: "Process",
          items: [
            "Establish relaxation",
            "Build the desired emotional state",
            "Gently press thumb and finger together",
            "Repeat",
            "Release",
            "Repeat later",
            "Practice outside sessions",
          ],
        },
        {
          heading: "Example",
          text: "“Whenever you gently bring these fingers together, you can use it as a reminder to pause, breathe and reconnect with this calm state.”",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Ethics & safety",
      title: "Regression: Ethics & Safety",
      lead: "Hypnosis does not guarantee accurate memory retrieval.",
      image: {
        src: asset("slide-hypno-ethics.png"),
        alt: "Sacred ethical light — integrity and safety in advanced practice",
        ...landscape,
      },
      sections: [
        {
          heading: "Avoid",
          text: "“Go back and find the person who caused this.”",
        },
        {
          heading: "Prefer",
          text: "“Allow whatever imagery, thoughts or memories arise naturally, without assuming that every detail is historically accurate.”",
          tone: "honor",
        },
      ],
      closing:
        "Suggestive questioning can contribute to false memories — teach this distinction carefully.",
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Practice",
      title: "Complete Hypnotherapy Session",
      lead: "Students practice the complete sequence.",
      image: {
        src: asset("slide-hypno-session.png"),
        alt: "Complete calm session flow from welcome through reorientation",
        ...landscape,
      },
      sections: [
        {
          heading: "Sequence",
          items: [
            "1. Welcome",
            "2. Intake",
            "3. Goal setting",
            "4. Consent",
            "5. Pre-talk",
            "6. Induction",
            "7. Deepening",
            "8. Therapeutic intervention",
            "9. Future pacing",
            "10. Reorientation",
            "11. Discussion",
            "12. Home practice",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Script",
      title: "Complete Sample Script — Relaxation + Confidence",
      lead: "A teaching script for demonstration and practice.",
      image: {
        src: asset("slide-hypno-confidence.png"),
        alt: "Calm confidence session atmosphere with soft golden presence",
        ...landscape,
      },
      sections: [
        {
          heading: "Opening → Breathing → Relaxation",
          text: "Settle attention. Notice breathing. Soften shoulders, hands, and face — nothing to prove, nothing to force.",
        },
        {
          heading: "Deepening",
          text: "Count from 5 down to 1 into deeper relaxation and focus.",
        },
        {
          heading: "Confidence + future pace",
          text: "Imagine the situation with greater calm. Standing comfortably. Breathing calmly. Speaking clearly. Not perfect — present.",
        },
        {
          heading: "Anchor + return",
          text: "Thumb and finger together as a reminder of calm confidence. Count 1 to 5 — eyes open, alert, comfortable, ready.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Practice",
      title: "Self-Hypnosis",
      lead: "Every practitioner should learn self-hypnosis before guiding others.",
      image: {
        src: asset("slide-hypno-self.png"),
        alt: "Serene self-hypnosis practice with soft golden countdown light rings",
        ...landscape,
      },
      sections: [
        {
          heading: "5–10 minute routine",
          items: [
            "Sit comfortably",
            "Choose a positive goal",
            "Relax breathing",
            "Focus attention",
            "Use a countdown",
            "Repeat therapeutic suggestions",
            "Visualize desired behaviour",
            "Future pace",
            "Count upward",
            "Return to normal activity",
          ],
        },
        {
          heading: "Daily practice",
          text: "Students maintain a journal of goals, suggestions used, and observations.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Professional practice",
      title: "Client Intake & Record Keeping",
      lead: "Learn professional documentation — collect only what is needed to provide the service safely.",
      image: {
        src: asset("slide-hypno-session.png"),
        alt: "Professional calm intake atmosphere in a wellness practice",
        ...landscape,
      },
      sections: [
        {
          heading: "Record",
          items: [
            "Client’s stated goal",
            "Relevant background",
            "Current treatments",
            "Consent",
            "Session objectives",
            "Technique used",
            "Client response",
            "Follow-up plan",
          ],
        },
        {
          heading: "Do not",
          text: "Record unnecessary sensitive information. Only collect information relevant to providing the service safely and appropriately.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Professional practice",
      title: "Contraindications, Referrals & Ethics",
      lead: "Students learn when not to proceed — and when to refer.",
      image: {
        src: asset("slide-hypno-ethics.png"),
        alt: "Ethical protective light representing referral and professional boundaries",
        ...landscape,
      },
      sections: [
        {
          heading: "Special caution / referral",
          items: [
            "Psychosis or hallucinations",
            "Severe dissociation",
            "Mania",
            "Suicidal thoughts",
            "Serious untreated mental-health symptoms",
            "Significant cognitive impairment",
            "Unexplained medical symptoms",
            "Severe or unexplained pain",
            "Acute intoxication",
            "Situations requiring emergency care",
          ],
        },
        {
          heading: "Never",
          items: [
            "Guarantee results",
            "Claim to cure disease",
            "Diagnose unless legally qualified",
            "Tell clients to stop medication",
            "Create dependency",
            "Use hypnosis without informed consent",
            "Exploit vulnerability",
            "Use sexualized hypnotic practices",
            "Implant suggestions for personal gain",
            "Conduct covert hypnosis",
          ],
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Practical training",
      title: "Supervised Exercises",
      lead: "Students complete supervised practice throughout the day.",
      image: {
        src: asset("slide-hypno-inductions.png"),
        alt: "Lotus of focused practice — supervised hypnotherapy skill building",
        ...landscape,
      },
      sections: [
        {
          heading: "Practice set",
          items: [
            "Practice 1 — 5-minute relaxation induction",
            "Practice 2 — 10-minute deepening exercise",
            "Practice 3 — Deliver confidence suggestions",
            "Practice 4 — Personalized safe-place visualization",
            "Practice 5 — Study-performance session",
            "Practice 6 — Habit-change session",
            "Practice 7 — Self-hypnosis",
            "Practice 8 — Sample audios for hypnotherapy",
          ],
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      eyebrow: "Assessment",
      title: "Final Practical Assessment",
      lead: "Theory, practical demonstration, and a written treatment plan.",
      image: {
        src: asset("slide-hypno-welcome.png"),
        alt: "Clear luminous path of learning — final assessment readiness",
        ...landscape,
      },
      sections: [
        {
          heading: "Theory",
          items: [
            "Definition of hypnosis",
            "Hypnotherapy principles",
            "Ethics",
            "Contraindications / referral",
            "Suggestion construction",
          ],
        },
        {
          heading: "Practical",
          items: [
            "Client intake",
            "Pre-talk",
            "Induction",
            "Deepening",
            "Therapeutic intervention",
            "Future pacing",
            "Reorientation",
          ],
        },
        {
          heading: "Written assignment",
          text: "Create a complete treatment plan for one non-medical goal — confidence, public speaking, study routine, relaxation, or habit change.",
          tone: "honor",
        },
      ],
    },
    {
      kind: "topic-sections",
      density: "compact",
      layout: "stack",
      eyebrow: "Pathway",
      title: "Hypnotherapy Training Levels",
      lead: "A clear path from foundations to advanced professional practice.",
      image: {
        src: asset("slide-hypno-mind-iceberg.png"),
        alt: "Depths of mastery — foundations to advanced hypnotherapy pathway",
        ...landscape,
      },
      sections: [
        {
          heading: "Level 1 — Hypnosis Foundations",
          items: [
            "Understanding hypnosis",
            "10 inductions",
            "Relaxation",
            "Self-hypnosis",
            "Suggestion",
            "Basic confidence work",
            "Ethics",
          ],
        },
        {
          heading: "Level 2 — Hypnotherapy Practitioner",
          items: [
            "Complete sessions",
            "Habit change",
            "Anxiety / stress support",
            "Confidence",
            "Study / performance",
            "Pain-management support",
            "Metaphors",
            "Anchoring",
            "Client assessment",
            "Advanced scripts",
          ],
        },
        {
          heading: "Level 3 — Advanced Hypnotherapy",
          items: [
            "Advanced conversational approaches",
            "Advanced imagery",
            "Parts / inner-resource work",
            "Regression as imagery exploration",
            "Advanced habit-change protocols",
            "Complex case formulation",
            "Professional practice",
            "Supervised sessions",
            "Referral and scope-of-practice",
          ],
          tone: "honor",
        },
      ],
      closing:
        "Optional resource: teacher may share the recommended book / PDF link with students after class.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Closing",
      title: "Closing the Day",
      lead: "You now hold the foundations of ethical, practical hypnotherapy.",
      sections: [
        {
          heading: "Today you explored",
          items: [
            "Hypnosis vs hypnotherapy",
            "Conscious and subconscious mind",
            "Complete session structure",
            "Ten inductions and deepening",
            "Suggestions, metaphors, and anchoring",
            "Ethics, contraindications, and referral",
            "Supervised practical training",
          ],
        },
        {
          heading: "Carry forward",
          text: "Practice self-hypnosis daily. Protect consent. Prefer presence over performance. Refer when needed.",
          tone: "honor",
        },
      ],
      closing:
        "End of Clinical Hypnotherapy Practitioner Training — Mind · Subconscious · Transformation.",
    },
    {
      kind: "questions",
      title: "Questions?",
      lead: "Share reflections, practice notes, and anything you want clarified before you leave today.",
    },
  ],
};
