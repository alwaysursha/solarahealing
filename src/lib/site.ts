export const site = {
  name: "Soulara Healing Academy",
  tagline: "Ancient healing energy for modern souls",
  sanskrit: "सर्वे भवन्तु सुखिनः",
  sanskritMeaning: "May all beings be happy",
  description:
    "Experience the transformative power of Reiki — a sacred Japanese-Indian healing practice that channels universal life energy to restore balance, peace, and vitality.",
  nav: [
    { label: "REIKI", href: "/reiki", icon: "reiki" },
    { label: "COURSES", href: "/courses", icon: "courses" },
    { label: "BOOK A SESSION", href: "/sessions", icon: "sessions" },
    { label: "ARTICLES", href: "/articles", icon: "blog" },
    { label: "CONTACT US", href: "/#contact", icon: "contact" },
  ],
  cta: "Book a Session",
  contact: {
    email: "hello@pranareiki.com",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    location: "New Delhi, India",
  },
} as const;

export const aboutContent = {
  opener: "At Soulara Healing Academy,",
  quote: "Healing begins from within.",
  paragraphs: [
    "we believe in the profound power of energy healing and the ability of Reiki to support balance, relaxation, and inner transformation. Our mission is to create a safe, nurturing, and welcoming space where individuals can reconnect with themselves, restore harmony, and embrace their natural healing journey.",
    "Through authentic Reiki practices, compassionate guidance, and thoughtfully designed learning experiences, Soulara Healing Academy is committed to making this ancient healing art accessible to everyone. Whether you are seeking personal growth, emotional balance, stress relief, or a deeper spiritual connection, our approach is centered around respect, mindfulness, and the belief that healing begins from within.",
    "At Soulara Healing Academy, we honor each person's unique path and strive to inspire a greater sense of peace, awareness, and wellbeing through the gentle and transformative practice of Reiki.",
  ],
} as const;

export const heroSlides = [
  {
    id: "awaken",
    variant: "illustrated",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "Peaceful meditation in a serene healing practice",
    imagePosition: "94% 40%",
    eyebrow: "सर्वे भवन्तु सुखिनः",
    eyebrowSub: "May all beings be happy",
    title: "Awaken Your Inner",
    titleAccent: "Light",
    description:
      "Ancient healing energy for modern souls. Channel universal life energy through authentic Reiki healing rooted in Indian spiritual wisdom.",
    caption: "Universal energy, infinite peace",
    captionSub: "In-person & distance healing available",
  },
  {
    id: "chakras",
    variant: "photo",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "Peaceful meditation session in a serene healing space",
    imagePosition: "68% center",
    eyebrow: "चक्र संतुलन",
    eyebrowSub: "Balance of the seven chakras",
    title: "Restore Your Energy",
    titleAccent: "Centers",
    description:
      "Gentle hands-on and energetic work to clear blockages and bring harmony to body, mind, and spirit.",
  },
  {
    id: "distance",
    variant: "photo",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80",
    imageAlt: "Peaceful distance Reiki session from a calm home setting",
    imagePosition: "92% 18%",
    eyebrow: "दूर संचार",
    eyebrowSub: "Healing beyond distance",
    title: "Heal From",
    titleAccent: "Anywhere",
    description:
      "Receive powerful distance Reiki from the comfort of home — energy flows wherever you are in the world.",
  },
] as const;

export const services = [
  {
    title: "In-Person Healing",
    description:
      "A deeply restorative hands-on session in a serene, sacred space. Feel tension dissolve as universal energy flows through every chakra.",
    duration: "60 min",
    icon: "hands",
  },
  {
    title: "Distance Reiki",
    description:
      "Energy knows no boundaries. Receive powerful healing from anywhere in the world — perfect for those unable to visit in person.",
    duration: "45 min",
    icon: "waves",
  },
  {
    title: "Chakra Balancing",
    description:
      "Targeted alignment of your seven energy centers using traditional Indian chakra wisdom combined with Reiki attunement.",
    duration: "75 min",
    icon: "chakra",
  },
  {
    title: "Reiki Attunement",
    description:
      "Begin your own healing journey. Level I & II attunement courses rooted in authentic lineage and spiritual discipline.",
    duration: "Full day",
    icon: "lotus",
  },
] as const;

export const workshops = [
  {
    id: "reiki-foundations",
    title: "Reiki Level I Foundations",
    description:
      "Learn sacred hand positions, energy sensing, and self-healing rituals in an intimate live online circle.",
    date: "Sat, 18 Jan · 10:00 AM EST",
    duration: "3 hours · online",
    badge: "Scheduled Live",
    priceCad: 189,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Guided Reiki foundations workshop in a calm studio setting",
  },
  {
    id: "chakra-masterclass",
    title: "Chakra Healing Masterclass",
    description:
      "Deep-dive into all seven chakras with guided scans, balancing techniques, and live Q&A with your facilitator.",
    date: "Sun, 26 Jan · 6:00 PM EST",
    duration: "2.5 hours · online",
    badge: "Scheduled Live",
    priceCad: 249,
    image:
      "https://images.unsplash.com/photo-1518199336456-b69c30b1516c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Chakra healing masterclass with candles and serene atmosphere",
  },
  {
    id: "distance-reiki",
    title: "Distance Reiki Intensive",
    description:
      "Master sending healing across space — protocols, intention setting, and paired practice in real time.",
    date: "Fri, 31 Jan · 1:00 PM EST",
    duration: "2 hours · online",
    badge: "Scheduled Live",
    priceCad: 169,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Online distance Reiki workshop via live video session",
  },
  {
    id: "meditation-circle",
    title: "Mindful Energy Circle",
    description:
      "A restorative group session blending breathwork, Reiki meditation, and collective energy activation.",
    date: "Wed, 5 Feb · 7:30 PM EST",
    duration: "90 min · online",
    badge: "Scheduled Live",
    priceCad: 79,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Mindful energy and meditation circle in peaceful setting",
  },
] as const;

export const workshopsIntro =
  "Join our live online Reiki workshops and experience guided, interactive training from the comfort of your home. Whether you're beginning your Reiki journey or advancing your practice, each workshop offers hands-on learning, personalized guidance, and a supportive community to help you build confidence, deepen your understanding, and awaken your natural healing abilities. Reserve your spot and take the next step on your path to healing and personal transformation.";

export function formatCad(price: number) {
  if (!Number.isFinite(price) || price <= 0) {
    return "FREE";
  }

  return `${new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)}/-`;
}

export const articlesIntro = {
  eyebrow: "Healing Insights",
  title: "Wisdom for your",
  titleAccent: "journey inward",
  description:
    "Explore curated guides on Reiki, energy healing, and conscious living — written to inspire clarity, balance, and transformation.",
} as const;

export const articlesFeatured = {
  slug: "sacred-art-of-reiki",
  category: "Foundations",
  title: "The Sacred Art of Reiki",
  excerpt:
    "Discover how universal life energy has guided healers for centuries — and how you can begin channeling it today with intention and grace.",
  image:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=90",
  imageAlt: "Practitioner in peaceful meditation surrounded by natural light",
  cta: "Read the guide",
} as const;

export const articlesSecondary = [
  {
    slug: "energy-healing-basics",
    category: "Healing",
    title: "Energy Healing",
    excerpt: "Restore flow, release tension, and return to your natural state of balance.",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb2?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Gentle hands-on Reiki healing session",
    cta: "Explore",
  },
  {
    slug: "mindful-nutrition",
    category: "Wellness",
    title: "Mindful Living",
    excerpt: "Nourish body and spirit with rituals that align your daily life with healing energy.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Vibrant nourishing bowl of fresh whole foods",
    cta: "Explore",
  },
] as const;

export const articlesList = [
  {
    slug: "transformation",
    title: "Transformation",
    description:
      "Understand how Reiki supports deep personal change — releasing old patterns and opening space for renewal.",
    linkLabel: "Learn more",
    image:
      "https://images.unsplash.com/photo-1499205798772-66a89db83f24?auto=format&fit=crop&w=800&q=90",
    imageAlt: "Inspirational message about creating your life",
  },
  {
    slug: "test-your-aura",
    title: "Know Your Aura",
    description:
      "Learn to sense the energy field around you — what it reveals about your emotional and spiritual state.",
    linkLabel: "Take the guide",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=90",
    imageAlt: "Colorful aura energy visualization",
  },
  {
    slug: "chakra-wisdom",
    title: "Chakra Wisdom",
    description:
      "A refined introduction to the seven energy centers — and how to bring each one into harmonious balance.",
    linkLabel: "Read article",
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=90",
    imageAlt: "Serene yoga and chakra alignment practice",
  },
  {
    slug: "distance-healing",
    title: "Distance Healing",
    description:
      "Energy transcends space. Explore how remote Reiki sessions deliver profound results across any distance.",
    linkLabel: "Discover how",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=90",
    imageAlt: "Peaceful online healing session at home",
  },
  {
    slug: "daily-practice",
    title: "Daily Practice",
    description:
      "Simple morning and evening rituals to keep your energy clear, grounded, and aligned with your highest self.",
    linkLabel: "Start today",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=90",
    imageAlt: "Morning meditation in a calm healing space",
  },
] as const;

export const coursesIntro = {
  eyebrow: "Learn at your pace",
  title: "Soulara Healing Academy",
  titleAccent: "Online Courses",
  description:
    "{count} immersive programs — from foundational Reiki to master-level attunement. Study on your schedule with lifetime access, guided modules, and practices you can return to again and again.",
} as const;

/** Spell small counts for course intro copy; fall back to numerals. */
export function formatCourseCountLabel(count: number): string {
  const words = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
    "Twenty",
  ] as const;

  if (count >= 0 && count < words.length) {
    return words[count];
  }

  return String(count);
}

export function resolveCoursesIntroDescription(template: string, count: number): string {
  const label = formatCourseCountLabel(count);
  return template
    .replace(/\{count\}/gi, label)
    .replace(/\bSeven\b/, label);
}

export const scheduleBooking = {
  eyebrow: "Online Bookings",
  title: "Schedule a Healing Session",
  cta: "Schedule Appointment",
  ctaHref: "#contact",
  socialProof: {
    count: "50+",
    label: "Experienced Healers & Doctors",
    avatars: [
      {
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        alt: "Experienced healer portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        alt: "Healing practitioner portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=200&q=80",
        alt: "Wellness doctor portrait",
      },
    ],
  },
  image:
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=90",
  imageAlt: "Woman in peaceful meditation for a healing session",
} as const;

export const onlineCourses = [
  {
    id: "introduction-to-reiki",
    title: "Introduction to Reiki",
    description:
      "Begin your Reiki path with a free, gentle foundation — core principles, energy awareness, and practices you can return to anytime.",
    date: "Start anytime",
    duration: "4 modules · self-paced",
    badge: "Free",
    priceCad: 0,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Introduction to Reiki free online course",
    category: "REIKI" as const,
    level: "BEGINNER" as const,
  },
  {
    id: "reiki-level-1",
    title: "Reiki Level I Certification",
    description:
      "Master sacred hand positions, energy sensing, and self-healing rituals through guided video modules you can revisit anytime.",
    date: "Start anytime",
    duration: "8 modules · self-paced",
    badge: "",
    priceCad: 299,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Reiki Level I online certification course",
    category: "REIKI" as const,
    level: "BEGINNER" as const,
  },
  {
    id: "reiki-level-2",
    title: "Reiki Level II Advanced",
    description:
      "Expand your practice with distance healing symbols, emotional release techniques, and advanced energetic protocols.",
    date: "Lifetime access",
    duration: "10 modules · self-paced",
    badge: "",
    priceCad: 449,
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6d708b348?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Advanced Reiki Level II online training",
    category: "REIKI" as const,
    level: "INTERMEDIATE" as const,
  },
  {
    id: "chakra-mastery",
    title: "Chakra Mastery Program",
    description:
      "Deep-dive into all seven chakras with guided scans, balancing practices, and integration exercises for daily life.",
    date: "Lifetime access",
    duration: "12 modules · self-paced",
    badge: "",
    priceCad: 329,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Chakra mastery online healing program",
    category: "NON_REIKI" as const,
    level: "INTERMEDIATE" as const,
  },
  {
    id: "distance-practitioner",
    title: "Distance Healing Practitioner",
    description:
      "Learn to send healing across space with confidence — protocols, intention setting, and client-ready distance sessions.",
    date: "Lifetime access",
    duration: "9 modules · self-paced",
    badge: "",
    priceCad: 279,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Distance Reiki practitioner course online",
    category: "REIKI" as const,
    level: "INTERMEDIATE" as const,
  },
  {
    id: "master-teacher",
    title: "Reiki Master Teacher Path",
    description:
      "The complete attunement and teaching pathway for those called to guide others — lineage, ethics, and mastery curriculum.",
    date: "Lifetime access",
    duration: "16 modules · certification",
    badge: "",
    priceCad: 899,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Reiki master teacher certification path",
    category: "REIKI" as const,
    level: "MASTER" as const,
  },
  {
    id: "energy-anatomy",
    title: "Energy Anatomy & Aura",
    description:
      "Understand the subtle body, aura layers, and energetic anatomy — essential knowledge for any serious healing practice.",
    date: "Lifetime access",
    duration: "7 modules · self-paced",
    badge: "",
    priceCad: 199,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Energy anatomy and aura reading course",
    category: "NON_REIKI" as const,
    level: "BEGINNER" as const,
  },
  {
    id: "sacred-symbols",
    title: "Sacred Symbols & Attunement",
    description:
      "Study the sacred Reiki symbols with reverence — their meaning, application, and role in attunement and healing work.",
    date: "Lifetime access",
    duration: "11 modules · self-paced",
    badge: "",
    priceCad: 379,
    image:
      "https://images.unsplash.com/photo-1499205798772-66a89db83f24?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Sacred Reiki symbols and attunement course",
    category: "REIKI" as const,
    level: "ADVANCED" as const,
  },
  {
    id: "crystal-reiki",
    title: "Crystal Reiki Integration",
    description:
      "Blend crystal allies with Reiki flows — placement maps, cleansing rituals, and session design for grounded, luminous results.",
    date: "Lifetime access",
    duration: "8 modules · self-paced",
    badge: "",
    priceCad: 269,
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Crystal Reiki integration online course",
    category: "REIKI" as const,
    level: "INTERMEDIATE" as const,
  },
  {
    id: "intuitive-presence",
    title: "Intuitive Presence Training",
    description:
      "Strengthen inner listening, ethical intuition, and client-ready presence so your healing sessions feel clear and trustworthy.",
    date: "Lifetime access",
    duration: "6 modules · self-paced",
    badge: "",
    priceCad: 219,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Intuitive presence training for healers",
    category: "NON_REIKI" as const,
    level: "BEGINNER" as const,
  },
  {
    id: "sound-and-breath",
    title: "Sound, Breath & Energy",
    description:
      "Pair breathwork and gentle sound with Reiki to deepen calm, release tension, and support lasting energetic balance.",
    date: "Lifetime access",
    duration: "9 modules · self-paced",
    badge: "",
    priceCad: 249,
    image:
      "https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Sound and breath energy healing course",
    category: "NON_REIKI" as const,
    level: "BEGINNER" as const,
  },
] as const;


export const privateSessionsIntro = {
  eyebrow: "One-to-One",
  title: "Book Private",
  titleAccent: "Sessions",
  description:
    "Book a personal session for deep guidance — scheduling is arranged with you after checkout by WhatsApp or email.",
} as const;

export const privateSessions = [
  {
    id: "akashic-reading",
    title: "Akashic Reading",
    description:
      "Receive a private Akashic Records reading to illuminate soul patterns, clarify purpose, and open next steps with grounded guidance.",
    duration: "60 minutes · one-to-one",
    priceCad: 180,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Quiet candlelit space prepared for an Akashic reading",
  },
  {
    id: "past-life-regression",
    title: "Past Life Regression",
    description:
      "A gentle guided regression to explore formative soul memories, release lingering imprints, and integrate insights into present healing.",
    duration: "75 minutes · one-to-one",
    priceCad: 220,
    image:
      "https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Soft contemplative light for past life regression",
  },
  {
    id: "reiki-healing-session",
    title: "Reiki Healing Session",
    description:
      "A private Reiki healing session focused on balance, calm, and energetic restoration — scheduled with you after purchase.",
    duration: "60 minutes · one-to-one",
    priceCad: 140,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Hands in a calm Reiki healing posture",
  },
] as const;

export const testimonialsIntro = {
  eyebrow: "Client Stories",
  title: "Voices of",
  titleAccent: "Transformation",
  description:
    "Real experiences from souls who found balance, clarity, and renewal through Soulara Healing Academy.",
} as const;

export const footerColumns = [
  {
    groups: [
      {
        title: "About Soulara Healing Academy",
        links: [
          { label: "Who We Are", href: "#about" },
          { label: "Vision & Mission", href: "/vision-mission" },
          { label: "Leadership", href: "#about" },
          { label: "Our Services", href: "#schedule" },
          { label: "Articles", href: "/articles" },
        ],
      },
      {
        title: "Reiki Courses",
        links: [
          { label: "Reiki Level 1 (Free)", href: "/reiki" },
          { label: "Reiki Level 2", href: "/courses" },
          { label: "Reiki Level 3", href: "/courses" },
          { label: "Reiki Mastership", href: "/courses" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: "Non-Reiki Online Courses",
        links: [
          { label: "Dowsing", href: "#courses" },
          { label: "Wealth & Success", href: "#courses" },
          { label: "Past Life Regression", href: "#courses" },
          { label: "Past-Life Master Course", href: "#courses" },
          { label: "Clinical Hypnotherapy", href: "#courses" },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: "Contact Us",
        links: [
          { label: "Soulara Healing Academy", href: "#schedule" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms & Conditions", href: "/legal/terms" },
          { label: "Refund or Replacement Policy", href: "/legal/refund" },
          { label: "Shipping and Delivery Policy", href: "/legal/shipping" },
          { label: "Privacy Policy", href: "/legal/privacy" },
          { label: "Disclaimer of Warranty", href: "/legal/disclaimer" },
          { label: "Limitations of Liability", href: "/legal/liability" },
          { label: "Termination Provisions", href: "/legal/termination" },
        ],
      },
    ],
  },
] as const;

export const footerSocial = {
  title: "Social",
  links: [
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  communityTitle: "Join the Soulara Healing Academy Family",
  communityDescription:
    "Join our WhatsApp Community with over 1 million members worldwide and receive daily wisdom.",
  communityCta: "Join Our WhatsApp Community",
  communityProof: "Join the community",
  communityAvatars: [
    {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      alt: "Community member",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      alt: "Community member",
    },
    {
      src: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=200&q=80",
      alt: "Community member",
    },
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      alt: "Community member",
    },
  ],
} as const;

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "After just three sessions, my chronic anxiety melted away. I felt a warmth I'd never experienced — like being held by light itself.",
    name: "Priya Sharma",
    location: "Mumbai, India",
  },
  {
    quote:
      "The distance healing worked when nothing else did. I could feel the energy across continents. Truly miraculous.",
    name: "James Mitchell",
    location: "London, UK",
  },
  {
    quote:
      "Her chakra balancing session was life-changing. I left feeling lighter, clearer, and deeply connected to something greater.",
    name: "Ananya Reddy",
    location: "Bangalore, India",
  },
  {
    quote:
      "I joined from Lahore feeling restless and heavy. After my session, sleep returned and my heart felt open again — as if someone had quietly reset my energy.",
    name: "Ayesha Khan",
    location: "Lahore, Pakistan",
  },
  {
    quote:
      "Soulara's Reiki course gave me a language for what I had always sensed. The practices are gentle, profound, and now part of my every morning.",
    name: "Rohan Mehta",
    location: "Delhi, India",
  },
  {
    quote:
      "From Toronto, the distance session still felt intimate. My shoulders softened, my mind quieted, and I carried that calm through the whole week.",
    name: "Sophie Chen",
    location: "Toronto, Canada",
  },
  {
    quote:
      "I came skeptical from New York. One private session shifted years of held tension — I finally felt safe in my own body again.",
    name: "Marcus Ellison",
    location: "New York, USA",
  },
  {
    quote:
      "Living in Edinburgh, I longed for grounded spiritual support. Soulara’s guidance is warm, clear, and deeply trustworthy.",
    name: "Emily Hughes",
    location: "Edinburgh, UK",
  },
];
