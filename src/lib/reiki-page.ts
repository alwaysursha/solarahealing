export type ReikiCta = {
  label: string;
  href: string;
};

export type ReikiHero = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  primaryCta: ReikiCta;
  secondaryCta: ReikiCta;
  image: string;
  imageAlt: string;
};

export type ReikiIntro = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  paragraphs: string[];
  visualCaption: string;
  image: string;
  imageAlt: string;
};

export type ReikiBenefitTabId = "mind" | "body" | "soul";

export type ReikiBenefitTab = {
  id: ReikiBenefitTabId;
  label: string;
  items: string[];
};

export type ReikiBenefits = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  tabs: ReikiBenefitTab[];
};

export type ReikiChakras = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
};

export type ReikiPathwayCard = {
  title: string;
  copy: string;
  href: string;
  cta: string;
};

export type ReikiPathways = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  session: ReikiPathwayCard;
  courses: ReikiPathwayCard;
};

export type ReikiClose = {
  title: string;
  titleAccent: string;
  description: string;
  cta: ReikiCta;
};

export type ReikiFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ReikiFaq = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  items: ReikiFaqItem[];
};

export type ReikiPageContent = {
  hero: ReikiHero;
  intro: ReikiIntro;
  benefits: ReikiBenefits;
  chakras: ReikiChakras;
  pathways: ReikiPathways;
  faq: ReikiFaq;
  close: ReikiClose;
};

export const REIKI_BENEFIT_TAB_IDS: ReikiBenefitTabId[] = ["mind", "body", "soul"];

/** Static defaults — also used when DB sections are missing. */
export const reikiPageDefaults: ReikiPageContent = {
  hero: {
    eyebrow: "Soulara Healing Academy",
    title: "Reiki",
    titleAccent: "healing",
    description:
      "Channel universal life energy to restore balance, ease the nervous system, and awaken peace within.",
    primaryCta: { label: "Book a Session", href: "/sessions" },
    secondaryCta: { label: "Explore Reiki courses", href: "/courses" },
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=85",
    imageAlt: "Serene hands in a calm Reiki healing atmosphere",
  },
  intro: {
    eyebrow: "What is Reiki",
    title: "Universal energy,",
    titleAccent: "gentle presence",
    visualCaption: "Rei · Ki — universal life energy",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Calm meditation and Reiki energy practice",
    paragraphs: [
      "Reiki is a traditional Japanese energy healing practice that promotes balance, relaxation, and overall well-being. It is a gentle, non-invasive therapy that supports the body's natural ability to restore harmony and has become increasingly embraced by people around the world.",
      "As a holistic healing modality, Reiki focuses on the whole person—mind, body, emotions, and spirit—rather than treating only physical symptoms. It recognizes that emotional, mental, and energetic imbalances can influence overall wellness. By encouraging balance within the body's energy system, Reiki helps create a greater sense of peace, clarity, and vitality.",
      "At Soulara Healing, Reiki sessions are provided online. Because Reiki works with universal life force energy, it is not limited by physical location. This allows you to receive the same supportive healing energy from the comfort and privacy of your own home, no matter where you are in the world.",
      "During a Distance Reiki session, your practitioner channels Reiki energy with focused intention while you relax in a quiet, comfortable space. Many clients describe the experience as deeply calming, peaceful, and restorative, often reporting sensations of warmth, relaxation, emotional release, or renewed clarity during or after the session.",
      "Reiki also works with the body's energy centres, known as chakras, helping to restore the natural flow of energy throughout the body. When energy flows more freely, many people experience reduced stress, improved emotional balance, enhanced mental clarity, better sleep, and an overall sense of well-being.",
      "Research suggests that Reiki may help reduce stress and anxiety, promote relaxation, support emotional wellness, and complement conventional medical care. While Reiki is not a replacement for medical treatment, it is widely used alongside other healthcare and wellness practices to support the body's natural healing process.",
      "Whether you are seeking relief from stress, emotional balance, spiritual growth, or simply a moment of deep relaxation, Soulara Healing's Reiki sessions provide a convenient, compassionate, and accessible way to experience the restorative benefits of Reiki—wherever you are in the world.",
    ],
  },
  benefits: {
    eyebrow: "Benefits of Reiki",
    title: "Mind, body,",
    titleAccent: "and soul",
    tabs: [
      {
        id: "mind",
        label: "Mind",
        items: [
          "Supports stress and anxiety reduction while inviting deeper relaxation and renewed energy.",
          "Helps create equilibrium between mind and emotions — a quieter clarity for everyday challenges.",
          "Can boost mental focus and support clearer memory and presence.",
        ],
      },
      {
        id: "body",
        label: "Body",
        items: [
          "Encourages the body’s natural healing processes and a stronger sense of vitality.",
          "Supports purification and balance across organs, glands, and energetic flow.",
          "May ease acute and chronic discomfort — including tension, migraines, and recovery after strain.",
          "Can support circulation and a calmer relationship with blood pressure patterns.",
          "Often used to complement recovery alongside medical and therapeutic care.",
        ],
      },
      {
        id: "soul",
        label: "Soul",
        items: [
          "Nurtures inner peace, harmony, and emotional spaciousness.",
          "A powerful companion for spiritual growth and self-connection.",
          "Supports wellbeing through gentle chakra balancing and energetic alignment.",
        ],
      },
    ],
  },
  chakras: {
    eyebrow: "Energy centers",
    title: "Flow through the",
    titleAccent: "chakras",
    description:
      "Chakras are the gateways through which energy enters and leaves the physical body and the aura. Reiki helps clear stagnation and restore coherent flow — so you can feel more grounded, open, and alive.",
  },
  pathways: {
    eyebrow: "Begin your path",
    title: "Receive healing, or",
    titleAccent: "learn the art",
    session: {
      title: "Private Reiki session",
      copy: "One-to-one healing with Soulara — in person or at a distance. Held with reverence, clarity, and care.",
      href: "/sessions",
      cta: "Book a Session",
    },
    courses: {
      title: "Reiki courses",
      copy: "From foundations to mastership — study at your pace with guided modules and lifetime access.",
      href: "/courses",
      cta: "View courses",
    },
  },
  close: {
    title: "Healing begins",
    titleAccent: "from within",
    description:
      "Whether you come to receive or to learn, Soulara Healing Academy offers a safe, nurturing space to reconnect with your natural energy.",
    cta: { label: "Book a Session", href: "/sessions" },
  },
  faq: {
    eyebrow: "Common questions",
    title: "Reiki",
    titleAccent: "FAQs",
    description:
      "Straightforward answers to help you feel at ease before your first session or course.",
    items: [
      {
        id: "faq-what-is-reiki",
        question: "What is Reiki?",
        answer:
          "Reiki is a gentle Japanese energy healing practice that supports relaxation, balance, and the body’s natural ability to restore harmony. A practitioner channels universal life force energy with focused intention — without force, diagnosis, or invasive technique.",
      },
      {
        id: "faq-distance",
        question: "Does distance Reiki really work?",
        answer:
          "Yes. Because Reiki works with energy rather than physical touch alone, sessions can be offered at a distance. Many people experience the same calm, warmth, and emotional release from the comfort of their own space.",
      },
      {
        id: "faq-feel",
        question: "What might I feel during a session?",
        answer:
          "Experiences vary. Common sensations include warmth, tingling, deep calm, emotional release, mental quiet, or simply a restorative rest. Some notice shifts during the session; others notice them in the hours or days afterward.",
      },
      {
        id: "faq-medical",
        question: "Is Reiki a replacement for medical care?",
        answer:
          "No. Reiki is a complementary wellness practice. It can sit alongside conventional care, but it is not a substitute for diagnosis, medication, or treatment from a licensed healthcare professional.",
      },
      {
        id: "faq-first-time",
        question: "Do I need experience to begin?",
        answer:
          "Not at all. Reiki welcomes beginners. Whether you book a private session or start with an introductory course, you’ll be guided with clarity, care, and no pressure to “perform.”",
      },
      {
        id: "faq-free-intro",
        question: "What is Introduction to Reiki?",
        answer:
          "Introduction to Reiki is our free foundational course — a gentle starting point to understand Reiki principles, energy awareness, and how to begin your path with confidence.",
      },
    ],
  },
};

/** @deprecated Prefer `reikiPageDefaults` — kept for existing imports. */
export const reikiPage = reikiPageDefaults;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeCta(value: unknown, fallback: ReikiCta): ReikiCta {
  const row = asRecord(value);
  if (!row) return { ...fallback };
  return {
    label: str(row.label, fallback.label),
    href: str(row.href, fallback.href),
  };
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  return items.length > 0 ? items : [...fallback];
}

export function normalizeReikiHero(value: unknown): ReikiHero {
  const d = reikiPageDefaults.hero;
  const row = asRecord(value);
  if (!row) return { ...d, primaryCta: { ...d.primaryCta }, secondaryCta: { ...d.secondaryCta } };
  return {
    eyebrow: str(row.eyebrow, d.eyebrow),
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    description: str(row.description, d.description),
    primaryCta: normalizeCta(row.primaryCta, d.primaryCta),
    secondaryCta: normalizeCta(row.secondaryCta, d.secondaryCta),
    image: str(row.image, d.image),
    imageAlt: str(row.imageAlt, d.imageAlt),
  };
}

export function normalizeReikiIntro(value: unknown): ReikiIntro {
  const d = reikiPageDefaults.intro;
  const row = asRecord(value);
  if (!row) return { ...d, paragraphs: [...d.paragraphs] };
  return {
    eyebrow: str(row.eyebrow, d.eyebrow),
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    visualCaption: str(row.visualCaption, d.visualCaption),
    image: str(row.image, d.image),
    imageAlt: str(row.imageAlt, d.imageAlt),
    paragraphs: normalizeStringList(row.paragraphs, d.paragraphs),
  };
}

function normalizeBenefitTab(id: ReikiBenefitTabId, value: unknown): ReikiBenefitTab {
  const fallback = reikiPageDefaults.benefits.tabs.find((tab) => tab.id === id)!;
  const row = asRecord(value);
  if (!row) return { id, label: fallback.label, items: [...fallback.items] };
  return {
    id,
    label: str(row.label, fallback.label),
    items: normalizeStringList(row.items, fallback.items),
  };
}

export function normalizeReikiBenefits(value: unknown): ReikiBenefits {
  const d = reikiPageDefaults.benefits;
  const row = asRecord(value);
  if (!row) {
    return {
      ...d,
      tabs: d.tabs.map((tab) => ({ ...tab, items: [...tab.items] })),
    };
  }

  const tabsRaw = Array.isArray(row.tabs) ? row.tabs : [];
  const byId = new Map<string, unknown>();
  for (const tab of tabsRaw) {
    const tabRow = asRecord(tab);
    if (!tabRow || typeof tabRow.id !== "string") continue;
    byId.set(tabRow.id, tab);
  }

  return {
    eyebrow: str(row.eyebrow, d.eyebrow),
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    tabs: REIKI_BENEFIT_TAB_IDS.map((id) => normalizeBenefitTab(id, byId.get(id))),
  };
}

export function normalizeReikiChakras(value: unknown): ReikiChakras {
  const d = reikiPageDefaults.chakras;
  const row = asRecord(value);
  if (!row) return { ...d };
  return {
    eyebrow: str(row.eyebrow, d.eyebrow),
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    description: str(row.description, d.description),
  };
}

function normalizePathwayCard(value: unknown, fallback: ReikiPathwayCard): ReikiPathwayCard {
  const row = asRecord(value);
  if (!row) return { ...fallback };
  return {
    title: str(row.title, fallback.title),
    copy: str(row.copy, fallback.copy),
    href: str(row.href, fallback.href),
    cta: str(row.cta, fallback.cta),
  };
}

export function normalizeReikiPathways(value: unknown): ReikiPathways {
  const d = reikiPageDefaults.pathways;
  const row = asRecord(value);
  if (!row) {
    return {
      ...d,
      session: { ...d.session },
      courses: { ...d.courses },
    };
  }
  return {
    eyebrow: str(row.eyebrow, d.eyebrow),
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    session: normalizePathwayCard(row.session, d.session),
    courses: normalizePathwayCard(row.courses, d.courses),
  };
}

export function normalizeReikiClose(value: unknown): ReikiClose {
  const d = reikiPageDefaults.close;
  const row = asRecord(value);
  if (!row) return { ...d, cta: { ...d.cta } };
  return {
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    description: str(row.description, d.description),
    cta: normalizeCta(row.cta, d.cta),
  };
}

function createFaqId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `faq-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `faq-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function normalizeReikiFaq(value: unknown): ReikiFaq {
  const d = reikiPageDefaults.faq;
  const row = asRecord(value);
  if (!row) {
    return {
      ...d,
      items: d.items.map((item) => ({ ...item })),
    };
  }

  const itemsRaw = Array.isArray(row.items) ? row.items : [];
  const items = itemsRaw
    .map((item, index) => {
      const itemRow = asRecord(item);
      if (!itemRow) return null;
      const question = str(itemRow.question, "");
      const answer = str(itemRow.answer, "");
      if (!question && !answer) return null;
      const fallback = d.items[index] ?? d.items[0];
      return {
        id: str(itemRow.id, fallback?.id ?? createFaqId()),
        question: question || fallback?.question || "Question",
        answer: answer || fallback?.answer || "",
      };
    })
    .filter((item): item is ReikiFaqItem => Boolean(item));

  return {
    eyebrow: str(row.eyebrow, d.eyebrow),
    title: str(row.title, d.title),
    titleAccent: str(row.titleAccent, d.titleAccent),
    description: str(row.description, d.description),
    items: items.length > 0 ? items : d.items.map((item) => ({ ...item })),
  };
}

export function normalizeReikiPageContent(input: {
  hero?: unknown;
  intro?: unknown;
  benefits?: unknown;
  chakras?: unknown;
  pathways?: unknown;
  faq?: unknown;
  close?: unknown;
}): ReikiPageContent {
  return {
    hero: normalizeReikiHero(input.hero),
    intro: normalizeReikiIntro(input.intro),
    benefits: normalizeReikiBenefits(input.benefits),
    chakras: normalizeReikiChakras(input.chakras),
    pathways: normalizeReikiPathways(input.pathways),
    faq: normalizeReikiFaq(input.faq),
    close: normalizeReikiClose(input.close),
  };
}

export const REIKI_SECTION_META = [
  { sectionKey: "hero", label: "Reiki hero" },
  { sectionKey: "intro", label: "What is Reiki" },
  { sectionKey: "benefits", label: "Benefits of Reiki" },
  { sectionKey: "chakras", label: "Chakras" },
  { sectionKey: "pathways", label: "Pathways" },
  { sectionKey: "faq", label: "FAQs" },
  { sectionKey: "close", label: "Closing CTA" },
] as const;

export type ReikiSectionKey = (typeof REIKI_SECTION_META)[number]["sectionKey"];
