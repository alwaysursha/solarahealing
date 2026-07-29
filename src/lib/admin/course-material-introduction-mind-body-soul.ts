import type { CourseMaterialSlide } from "@/lib/admin/course-material";

const asset = (file: string) =>
  `/course-material/introduction-to-reiki/mind-body-soul/${file}`;

const pricingAsset = (file: string) =>
  `/course-material/introduction-to-reiki/pricing/${file}`;

/** Mind, Body & Soul block — placed after Beyond Reiki, before Your Reiki Journey. */
export const introductionMindBodySoulSlides: CourseMaterialSlide[] = [
  {
    kind: "story",
    eyebrow: "Foundations",
    title: "Reiki Works on the Mind, Body & Soul",
    paragraphs: [
      "Before we begin learning Reiki, it is important to understand one fundamental truth:",
      "Human beings are not just physical bodies. We are made of three interconnected parts: the Mind, the Body, and the Soul (Spirit).",
      "These three aspects constantly influence one another. When one becomes imbalanced, the others are eventually affected. True healing works only when we nurture all three dimensions of ourselves.",
    ],
    image: {
      src: asset("slide-01.png"),
      alt: "Mind, body, and soul connected through radiant healing light",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "The Mind",
    title: "The Mind",
    lead: "The mind is where we think, believe, imagine, remember, and create. It controls:",
    items: [
      "Thoughts, emotions, beliefs, memories, habits, and decisions",
      "Our stress response — every thought creates a chemical reaction in the brain",
      "Positive thoughts release serotonin, dopamine, oxytocin, and endorphins",
      "Negative thoughts trigger stress hormones such as cortisol and adrenaline",
      'Repeating thoughts like “I’m not good enough,” “Nobody loves me,” or “I always fail” can keep the body in survival mode',
    ],
    image: {
      src: asset("slide-02.png"),
      alt: "Silhouette of the human mind illuminated with energy",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "Mind & Body",
    title: "How the Mind Affects the Body",
    lead: "Modern science has shown that prolonged stress contributes to many health conditions, including:",
    items: [
      "High blood pressure and poor sleep",
      "Digestive problems and headaches",
      "Low immunity, fatigue, and muscle tension",
      "Anxiety and depression",
      "Many illnesses begin long before physical symptoms appear — emotional stress can influence physical well-being over time",
    ],
    image: {
      src: asset("slide-03.png"),
      alt: "Mind–body connection with stress and healing pathways",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "Emotional Energy",
    title: "Emotional Energy",
    lead: "Every emotion carries energy.",
    items: [
      "Love expands. Fear contracts.",
      "Joy raises our energy. Anger creates tension.",
      "Resentment blocks emotional flow.",
      "Grief can leave us feeling heavy and withdrawn.",
      "When emotions remain unprocessed, people often describe feeling emotionally “stuck.” Many healing traditions view this as an important part of emotional and energetic well-being.",
    ],
    image: {
      src: asset("slide-04.png"),
      alt: "Emotional energy flowing through the heart and body",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "The Body",
    title: "The Body",
    lead: "The body is the vehicle through which we experience life. It communicates continuously.",
    items: [
      "Pain is communication.",
      "Fatigue is communication.",
      "Headaches are communication.",
      "Illness often signals that something needs attention.",
      "Instead of asking “Why is this happening to me?”, ask “What is my body trying to tell me?”",
    ],
    image: {
      src: asset("slide-05.png"),
      alt: "Human body as a vessel of living energy",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "The Body",
    title: "What Happens When We Ignore the Body?",
    lead: "Imagine driving your car while ignoring a low-fuel warning, engine light, flat tires, or strange noises. Eventually the car stops working. Our bodies are no different.",
    items: [
      "Ignoring stress can quietly reduce our resilience",
      "Poor nutrition and lack of sleep wear the system down",
      "Emotional exhaustion often shows up as physical symptoms",
      "Listening early supports lasting well-being",
    ],
    image: {
      src: asset("slide-06.png"),
      alt: "Warning signs we should not ignore in the body",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "The Soul",
    title: "The Soul (Spirit)",
    lead: "In many spiritual traditions, the soul is our deepest essence — the part of us connected to love, purpose, compassion, and inner wisdom. The soul is often associated with:",
    items: [
      "Purpose, intuition, and inner peace",
      "Compassion, joy, and connection",
      "Spiritual growth",
      "Even when someone appears successful externally, they may still feel empty or sense that there must be more to life",
      "These feelings can arise when a person longs for greater meaning or connection",
    ],
    image: {
      src: asset("slide-07.png"),
      alt: "Soul and spirit represented as luminous inner light",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "The Soul",
    title: "Signs the Soul Needs Healing",
    lead: "People may experience:",
    items: [
      "Feeling disconnected",
      "Lack of purpose",
      "Emotional emptiness",
      "Constant dissatisfaction",
      "Loss of inspiration",
      "Feeling spiritually exhausted",
    ],
    image: {
      src: asset("slide-08-signs-soul-needs-healing.png"),
      alt: "Signs the soul needs healing: disconnected from purpose, emotional pain, exhaustion, and struggling to feel love or connection",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "topic-sections",
    eyebrow: "Mind · Body · Soul",
    title: "How the Three Work Together",
    lead: "Imagine someone loses their job. One event can affect all three aspects of life.",
    sections: [
      {
        heading: "Mind",
        items: ["“I’m a failure.”", "“I’ll never succeed.”"],
      },
      {
        heading: "Body",
        items: [
          "Stress hormones rise",
          "Sleep becomes disturbed",
          "Appetite changes",
          "Energy decreases",
        ],
      },
      {
        heading: "Soul",
        items: [
          "Purpose feels lost",
          "Hope diminishes",
          "They feel disconnected from themselves",
        ],
      },
    ],
  },
  {
    kind: "topic-sections",
    eyebrow: "Mind · Body · Soul",
    title: "When Healing Begins",
    lead: "Now imagine someone begins meditation, Reiki, self-care, gratitude, forgiveness, healthy eating, exercise, and prayer or spiritual reflection.",
    sections: [
      {
        heading: "Mind",
        text: "Thoughts become calmer.",
      },
      {
        heading: "Body",
        items: ["Stress reduces", "Sleep improves", "Energy increases"],
      },
      {
        heading: "Soul",
        items: ["Hope returns", "Inner peace grows", "Purpose becomes clearer"],
      },
    ],
    closing: "Healing in one area often supports healing in the others.",
  },
  {
    kind: "topic-sections",
    eyebrow: "Holistic wellness",
    title: "How Reiki Works on All Three",
    lead: "Reiki is often practiced as a holistic wellness approach. It aims to support balance by helping people relax deeply and reconnect with themselves. Many practitioners believe Reiki can support:",
    image: {
      src: asset("slide-11.png"),
      alt: "Reiki supporting mind, body, and soul together",
      width: 1536,
      height: 1024,
    },
    sections: [
      {
        heading: "The Mind",
        items: [
          "Reduces stress",
          "Encourages relaxation",
          "Improves mental clarity",
          "Supports emotional balance",
        ],
      },
      {
        heading: "The Body",
        items: [
          "Promotes deep relaxation",
          "Helps release physical tension",
          "Supports the body’s natural healing processes",
          "Encourages restorative rest",
        ],
      },
      {
        heading: "The Soul",
        items: [
          "Deepens spiritual awareness",
          "Strengthens intuition",
          "Encourages compassion",
          "Supports a greater sense of peace and connection",
        ],
      },
    ],
  },
  {
    kind: "story",
    eyebrow: "Analogy",
    title: "A Simple Analogy",
    paragraphs: [
      "Imagine a beautiful garden. The flowers represent your body. The soil represents your mind. The sunlight represents your soul.",
      "If the soil is unhealthy, the flowers struggle. If there is no sunlight, growth slows. If the flowers are neglected, the garden loses its beauty.",
      "Only when all three are cared for does the garden truly flourish. We are that garden.",
    ],
    image: {
      src: asset("slide-12.png"),
      alt: "Garden analogy for mind, body, and soul",
      width: 1536,
      height: 1024,
    },
  },
  {
    kind: "bullets",
    eyebrow: "Practice",
    title: "Reflection Exercise",
    lead: "Close your eyes and silently reflect on these questions. Allow a few minutes of quiet reflection, and share if you feel comfortable.",
    items: [
      "How is my body asking for attention?",
      "What thoughts do I repeat every day?",
      "What emotions am I holding onto?",
      "When did I last feel truly peaceful?",
      "What brings meaning and purpose to my life?",
      "Which part of me — mind, body, or soul — needs the most care today?",
    ],
  },
  {
    kind: "story",
    eyebrow: "Closing",
    title: "Closing Message",
    paragraphs: [
      "At Soulara Healing, we believe true transformation doesn’t come from treating only symptoms. It comes from creating harmony between the mind, the body, and the soul.",
      "When your thoughts become peaceful, your body begins to relax. When your body relaxes, your energy flows more freely. And when your energy flows freely, your soul shines through.",
      "Reiki is not just a healing technique — it is a journey back to your authentic self, where health, inner peace, and purpose naturally begin to unfold.",
    ],
  },
];

/** Second-to-last Intro slide — after Your Reiki Journey. */
export const introductionCoursePricingSlide: CourseMaterialSlide = {
  kind: "course-pricing",
  eyebrow: "Next steps",
  title: "Course Pricing",
  banner: "Upto 50% off if you sign up today",
  items: [
    {
      name: "Reiki Level 1",
      price: "$200",
      catalogSlug: "reiki-level-1",
      catalogKind: "course",
      image: {
        src: pricingAsset("reiki-1.png"),
        alt: "Reiki Level 1 course cover",
        width: 640,
        height: 640,
      },
    },
    {
      name: "Reiki Level 2",
      price: "$300",
      catalogSlug: "reiki-level-2",
      catalogKind: "course",
      image: {
        src: pricingAsset("reiki-2.png"),
        alt: "Reiki Level 2 course cover",
        width: 640,
        height: 640,
      },
    },
    {
      name: "Reiki Level 3",
      price: "$500",
      catalogSlug: "reiki-level-3",
      catalogKind: "course",
      image: {
        src: pricingAsset("reiki-3.png"),
        alt: "Reiki Level 3 course cover",
        width: 640,
        height: 640,
      },
    },
    {
      name: "Reiki Master",
      price: "$800",
      catalogSlug: "master-teacher",
      catalogKind: "course",
      image: {
        src: pricingAsset("reiki-master.png"),
        alt: "Reiki Master course cover",
        width: 640,
        height: 640,
      },
    },
    {
      name: "Past Life Regression & Future Progression",
      price: "$200",
      note: "Session",
      catalogSlug: "past-life-regression",
      catalogKind: "private_session",
      image: {
        src: pricingAsset("plr-session.png"),
        alt: "Past Life Regression and Future Progression session cover",
        width: 640,
        height: 370,
      },
    },
    {
      name: "Past Life Regression Master",
      price: "$500",
      catalogSlug: "past-life-regression-master",
      catalogKind: "course",
      image: {
        src: pricingAsset("plr-master.png"),
        alt: "Past Life Regression Master course cover",
        width: 640,
        height: 426,
      },
    },
    {
      name: "Akashic Records Reading",
      price: "$150",
      catalogSlug: "akashic-reading",
      catalogKind: "private_session",
      image: {
        src: pricingAsset("akashic-reading.png"),
        alt: "Akashic Records Reading cover",
        width: 640,
        height: 640,
      },
    },
    {
      name: "Akashic Records Reader Master",
      price: "$500",
      catalogSlug: "akashic-records-reader-master",
      catalogKind: "course",
      image: {
        src: pricingAsset("akashic-reading.png"),
        alt: "Akashic Records Reader Master cover",
        width: 640,
        height: 640,
      },
    },
    {
      name: "Clinical Hypnotherapy",
      price: "$300",
      note: "Session",
      catalogSlug: "clinical-hypnotherapy",
      catalogKind: "private_session",
      image: {
        src: pricingAsset("hypnotherapy.png"),
        alt: "Clinical Hypnotherapy session cover",
        width: 480,
        height: 640,
      },
    },
    {
      name: "Pendulum Dowsing",
      price: "$300",
      catalogSlug: "pendulum-dowsing",
      catalogKind: "course",
      image: {
        src: pricingAsset("dowsing.png"),
        alt: "Pendulum Dowsing certification cover",
        width: 426,
        height: 640,
      },
    },
  ],
};

/** Final Intro slide. */
export const introductionQuestionsSlide: CourseMaterialSlide = {
  kind: "questions",
  title: "Questions?",
  lead: "What would you like to explore further about Reiki, energy healing, or your next step on this path?",
};
