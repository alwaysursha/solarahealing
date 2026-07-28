import type { CourseMaterialDeck } from "@/lib/admin/course-material";

const asset = (file: string) => `/course-material/reiki-level-1/day-1/${file}`;

const brandLogo = {
  src: "/course-material/reiki-level-1/cover-logo.png",
  alt: "Soulara Healing Training Academy",
  width: 939,
  height: 271,
} as const;

export const reikiLevel1Day1: CourseMaterialDeck = {
  slug: "reiki-level-1-day-1",
  title: "Reiki Level 1",
  series: "Reiki Level 1",
  dayLabel: "Day 1",
  duration: "2 Hours",
  sessionDurationMinutes: 120,
  status: "ready",
  description:
    "Day 1 of the two-day Reiki Level 1 certification — awakening, energy systems, chakras, aura, and attunement.",
  brandLogo,
  slides: [
    {
      kind: "session-start",
      eyebrow: "Day 1 · Two-day certification",
      title: "Reiki Level 1",
    },
    {
      kind: "story",
      eyebrow: "Welcome",
      title: "Welcome to Soulara Healing Reiki Level 1 – The Awakening.",
      paragraphs: [
        "Today is not only about learning a healing technique. It is about reconnecting with the healing wisdom that already exists within you.",
        "Every person has the natural ability to experience and share healing energy. Reiki does not give you something that you do not have; it helps you awaken the connection that has always been present.",
      ],
      image: {
        src: asset("slide-asset-01.png"),
        alt: "Welcome to Reiki Level 1 – The Awakening",
        width: 1408,
        height: 768,
      },
    },
    {
      kind: "bullets",
      eyebrow: "Opening",
      title: "Introduction Exercise",
      lead: "Whatever reason brought you here today, Reiki meets you exactly where you are.",
      items: [
        "I want to reduce stress.",
        "I want emotional healing.",
        "I want to help my family.",
        "I feel spiritually guided.",
        "I want to understand energy.",
        "I am looking for my purpose.",
        "Some people come because they are experiencing challenges. Some come because they feel called toward spiritual growth. Some come because they want to support others. There is no right or wrong reason. Reiki works with your intention.",
      ],
      image: {
        src: asset("slide-asset-02.jpg"),
        alt: "Reasons people begin Reiki Level 1",
        width: 1206,
        height: 586,
      },
    },
    {
      kind: "definition",
      eyebrow: "The path",
      title: "Explain the Reiki Journey",
      lead: "Three stages of growth — begin by healing yourself.",
      columns: [
        {
          term: "Reiki Level 1",
          meaning: "The Awakening · Healing Yourself",
          points: [
            "Self-awareness",
            "Energy awareness",
            "Emotional balance",
            "Physical relaxation",
            "Connecting with Reiki energy",
          ],
        },
        {
          term: "Reiki Level 2",
          meaning: "The Reinforcement · Healing Others",
          points: [
            "Reiki symbols",
            "Distance healing",
            "Emotional healing",
            "Practitioner development",
          ],
        },
        {
          term: "Reiki Level 3",
          meaning: "The Advanced Healer",
          points: [
            "Advanced energy work",
            "Attunement",
            "Psychic Surgery",
            "Cord Cutting",
            "Master Symbol",
          ],
        },
      ],
      result:
        "Level 1 is the foundation. Before we learn to support others, we learn to connect and understand ourselves.",
    },
    {
      kind: "definition",
      eyebrow: "Foundations",
      title: "What is Reiki?",
      lead: "The word Reiki comes from the Japanese language.",
      columns: [
        {
          term: "Rei",
          meaning: "Universal",
          points: [
            "Universal Wisdom",
            "Divine Intelligence",
            "Higher Consciousness",
            "Sacred Energy",
          ],
        },
        {
          term: "Ki",
          meaning: "Energy",
          points: [
            "Life Force Energy",
            "The invisible energy flowing through every living being.",
          ],
        },
      ],
      result:
        "Together, Reiki means: Universal Life Force Energy. Reiki is not only a hands-on healing method; it is a spiritual practice that teaches awareness, compassion, and balance.",
      image: {
        src: "/course-material/introduction-to-reiki/what-is-reiki.png",
        alt: "Hand holding radiant universal life force energy",
        width: 1536,
        height: 1024,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-03-wide.png"),
        alt: "Conscious and subconscious mind teaching visual",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-04-wide.png"),
        alt: "Where are you holding your emotions body map",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-05-wide.png"),
        alt: "Ida Pingala and Sushumna energy channels teaching visual",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "story",
      eyebrow: "Energy foundations",
      title: "Human Energy System & Chakras",
      paragraphs: [
        "Let's understand the energetic body before learning Reiki Healing.",
        "Your physical body is only one layer of your existence. Ancient healing traditions describe humans as having an energetic system that interacts with our emotions, thoughts, and physical wellbeing.",
      ],
      image: {
        src: asset("slide-asset-06.png"),
        alt: "Human energy system and chakras overview",
        width: 1009,
        height: 1024,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-07-wide.png"),
        alt: "Energy bodies physical emotional mental spiritual layers",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "story",
      eyebrow: "Chakras",
      title: "Chakras",
      paragraphs: [
        "The word chakra comes from Sanskrit and means wheel or spinning energy center.",
        "Chakras are traditionally described as energy centers that influence different aspects of our physical, emotional, and spiritual experience.",
      ],
      image: {
        src: asset("slide-asset-08-wide.png"),
        alt: "The seven chakras with symbols and Sanskrit names",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 1",
      title: "Root Chakra (Muladhara)",
      lead: "Element: Earth (Prithvi)",
      image: {
        src: asset("slide-asset-09-tall.png"),
        alt: "Root chakra Muladhara blocked signs health issues and action step",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: ["Stability", "Grounding", "Safety", "Physical body", "Survival", "Security"],
        },
        {
          heading: "Balanced Earth Element",
          items: [
            "Feel safe",
            "Financial stability",
            "Good physical health",
            "Confidence",
            "Patience",
            "Strong immune system",
          ],
        },
        {
          heading: "Imbalanced Earth Element",
          items: [
            "Fear",
            "Anxiety",
            "Insecurity",
            "Feeling disconnected",
            "Financial worries",
            "Fatigue",
          ],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki grounds excess energy, calms fear, and restores feelings of safety and stability.",
        },
        {
          heading: "Affirmation",
          text: "I am safe, grounded, and supported by life.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 2",
      title: "Sacral Chakra (Svadhisthana)",
      lead: "Element: Water (Jala)",
      image: {
        src: asset("slide-asset-10-tall.png"),
        alt: "Sacral chakra Svadhisthana blocked signs health issues and action step",
        width: 1712,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: [
            "Emotions",
            "Relationships",
            "Creativity",
            "Pleasure",
            "Adaptability",
            "Sexual energy",
          ],
        },
        {
          heading: "Balanced Water Element",
          items: [
            "Healthy emotions",
            "Creativity",
            "Joy",
            "Emotional flexibility",
            "Healthy relationships",
          ],
        },
        {
          heading: "Imbalanced Water Element",
          items: [
            "Emotional instability",
            "Guilt",
            "Creative block",
            "Dependency",
            "Lack of passion",
          ],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki allows emotional energy to flow naturally and supports emotional healing.",
        },
        {
          heading: "Affirmation",
          text: "I allow life to flow through me with joy.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 3",
      title: "Solar Plexus Chakra (Manipura)",
      lead: "Element: Fire (Agni)",
      image: {
        src: asset("slide-asset-11-tall.png"),
        alt: "Solar plexus chakra Manipura blocked signs health issues and action step",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: [
            "Personal power",
            "Confidence",
            "Willpower",
            "Motivation",
            "Transformation",
            "Digestion",
          ],
        },
        {
          heading: "Balanced Fire Element",
          items: [
            "Confidence",
            "Healthy boundaries",
            "Strong determination",
            "Positive self-esteem",
            "Good digestion",
          ],
        },
        {
          heading: "Imbalanced Fire Element",
          items: [
            "Anger",
            "Low confidence",
            "Control issues",
            "Digestive problems",
            "Lack of motivation",
          ],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki strengthens inner power while calming excessive emotional heat.",
        },
        {
          heading: "Affirmation",
          text: "I am confident, powerful, and capable.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 4",
      title: "Heart Chakra (Anahata)",
      lead: "Element: Air (Vayu)",
      image: {
        src: asset("slide-asset-12-tall.png"),
        alt: "Heart chakra Anahata blocked signs health issues and action step",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: ["Love", "Compassion", "Forgiveness", "Acceptance", "Kindness", "Connection"],
        },
        {
          heading: "Balanced Air Element",
          items: [
            "Compassion",
            "Healthy relationships",
            "Emotional balance",
            "Inner peace",
            "Gratitude",
          ],
        },
        {
          heading: "Imbalanced Air Element",
          items: [
            "Resentment",
            "Loneliness",
            "Grief",
            "Bitterness",
            "Difficulty trusting others",
          ],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki opens the heart to unconditional love and emotional healing.",
        },
        {
          heading: "Affirmation",
          text: "I give and receive love freely.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 5",
      title: "Throat Chakra (Vishuddha)",
      lead: "Element: Ether (Akasha / Space)",
      image: {
        src: asset("slide-asset-13-tall.png"),
        alt: "Throat chakra Vishuddha blocked signs health issues and action step",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: ["Communication", "Truth", "Self-expression", "Listening", "Authenticity"],
        },
        {
          heading: "Balanced Ether Element",
          items: [
            "Honest communication",
            "Confidence in speaking",
            "Good listening skills",
            "Clear expression",
          ],
        },
        {
          heading: "Imbalanced Ether Element",
          items: [
            "Fear of speaking",
            "Miscommunication",
            "Shyness",
            "Gossip",
            "Suppressed emotions",
          ],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki clears energetic blockages that prevent authentic communication.",
        },
        {
          heading: "Affirmation",
          text: "I express my truth with confidence and kindness.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 6",
      title: "Third Eye Chakra (Ajna)",
      lead:
        "Element: Light (or Mind) — traditionally associated with light, awareness, or the mind rather than one of the five physical elements.",
      image: {
        src: asset("slide-asset-14-tall.png"),
        alt: "Third eye chakra Ajna blocked signs health issues and action step",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: ["Intuition", "Wisdom", "Insight", "Imagination", "Inner vision"],
        },
        {
          heading: "Balanced",
          items: [
            "Strong intuition",
            "Mental clarity",
            "Discernment",
            "Good concentration",
            "Spiritual awareness",
          ],
        },
        {
          heading: "Imbalanced",
          items: ["Confusion", "Overthinking", "Lack of intuition", "Poor focus", "Mental fog"],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki quiets mental chatter and enhances inner awareness and intuition.",
        },
        {
          heading: "Affirmation",
          text: "I trust my inner wisdom.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Chakra 7",
      title: "Crown Chakra (Sahasrara)",
      lead:
        "Element: Pure Consciousness (Spirit) — transcends the five physical elements and connects with universal energy.",
      image: {
        src: asset("slide-asset-15-tall.png"),
        alt: "Crown chakra Sahasrara blocked signs health issues and action step",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Represents",
          items: [
            "Spiritual awakening",
            "Divine connection",
            "Enlightenment",
            "Universal consciousness",
            "Inner peace",
          ],
        },
        {
          heading: "Balanced",
          items: [
            "Inner peace",
            "Spiritual connection",
            "Wisdom",
            "Gratitude",
            "Trust in life",
          ],
        },
        {
          heading: "Imbalanced",
          items: [
            "Feeling disconnected",
            "Spiritual emptiness",
            "Lack of purpose",
            "Cynicism",
            "Isolation",
          ],
        },
        {
          heading: "How Reiki Helps",
          text: "Reiki strengthens the connection to universal life force energy, fostering peace and spiritual awareness.",
        },
        {
          heading: "Affirmation",
          text: "I am one with the infinite wisdom of the Universe.",
        },
      ],
    },
    {
      kind: "topic-sections",
      eyebrow: "Practice",
      title: "How to Check If Chakras are Open or Blocked?",
      image: {
        src: asset("slide-asset-16-tall.png"),
        alt: "How to check chakras with a pendulum open closed blocked states",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Prepare the pendulum",
          items: [
            "Hold the chain: pinch the end between your thumb and index finger, letting the pendulum hang steady about 3 to 6 inches down.",
            "Draw the symbols: hold the pendulum in your non-dominant hand and visualize or draw your attuned Reiki symbols (such as Cho Ku Rei) over it.",
            "State your intent: dedicate the tool strictly for highest-good healing, chakra scanning, and energy balancing.",
            "Connect your vibe: hold the pendulum against your palm or heart center to sync with your energy field.",
          ],
        },
        {
          heading: "Programming responses",
          items: [
            'Establish "Yes": ask the pendulum to show you a Yes response and note the swing pattern.',
            'Establish "No": ask for a No and observe the distinct change in direction.',
            "Test accuracy: ask simple baseline questions you already know are true or false before an active session.",
          ],
        },
      ],
    },
    {
      kind: "aura",
      title: "Understanding Aura",
      lead:
        "Aura is the energetic field surrounding the body. Everything alive creates an energetic field. The aura is traditionally described as the subtle energy field surrounding the physical body. Many healing traditions believe this field reflects our emotional, mental, and spiritual state.",
      image: {
        src: asset("slide-asset-17.png"),
        alt: "Aura energy field illustration with seven chakras",
        width: 1200,
        height: 1800,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-18-wide-v2.png"),
        alt: "The 7 layers of aura teaching visual",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Practice",
      title: "Aura Seeing Exercises",
      image: {
        src: asset("slide-asset-19-tall-v2.png"),
        alt: "How to read aura three techniques mirror hand gazing partner reading",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Exercise 1",
          items: [
            "Set intention to see your aura.",
            "Rub palms 21 times.",
            "Slowly move them apart.",
            "Place your hand away from your body.",
            "Place it against a white wall or surface.",
            "Look at the thin lining around your hand.",
          ],
        },
        {
          heading: "Exercise 2",
          items: [
            "Set intention to see your aura.",
            "Rub palms 21 times.",
            "Rub your index finger and thumb together.",
            "Place it against a white wall or surface.",
            "Look at the thin lining around your thumb.",
          ],
        },
      ],
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-20-wide.png"),
        alt: "Aura cleansing six practices guide teaching visual",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "image-focus",
      image: {
        src: asset("slide-asset-21-wide.png"),
        alt: "Improving your aura with gratitude and forgiveness teaching visual",
        width: 1920,
        height: 1080,
      },
    },
    {
      kind: "topic-sections",
      eyebrow: "Practice",
      title: "Preparing Yourself As A Reiki Practitioner",
      image: {
        src: asset("slide-asset-22-tall.png"),
        alt: "Preparing yourself as a Reiki practitioner sacred space grounding protection",
        width: 1095,
        height: 1528,
      },
      sections: [
        {
          heading: "Preparation exercise",
          items: [
            "Wash your hands.",
            "Sit in a quiet space.",
            "Keep your spine straight.",
            "Take a deep breath through the nose and exhale through the mouth.",
            'Set intention: “Highest Energies of Universe please connect with me and activate my Reiki Healing Powers.”',
          ],
        },
        {
          heading: "Hand preparation exercise",
          items: [
            "Rub palms together gently 21 times.",
            "Hold your hands facing each other about 6–8 inches apart.",
            "Slowly move your hands closer together and then further apart.",
            "Notice: heat, tingling, energy sensation, gentle pressure, or a feeling of holding a soft ball.",
          ],
        },
      ],
      closing: "This is your awareness increasing. Everyone experiences energy differently.",
    },
    {
      kind: "topic-sections",
      eyebrow: "Day 1 closing",
      title: "Reiki Level 1 Attunement",
      lead: "This is the sacred initiation where students are introduced to Reiki energy.",
      sections: [
        {
          heading: "Purpose",
          text: "Sacred initiation into Reiki energy.",
        },
        {
          heading: "Intention",
          text: "Highest Energies of Universe please connect with me and Activate my Reiki.",
        },
        {
          heading: "After attunement — practice",
          items: ["7 Chakra Healing", "24 Point Self Healing", "Heal others — Touch"],
        },
        {
          heading: "21-Day Cleansing Period",
          items: [
            "Energy awareness increases",
            "Emotional patterns may surface",
            "Old thoughts may release",
            "Healing continues",
            "Recommend: daily Reiki practice, drinking water, journaling, meditation",
          ],
        },
        {
          heading: "End of Day 1 Closing Circle",
          text: "Place your hands on your heart. Take a moment to honor yourself for beginning this journey. Today you opened yourself to a new awareness. Reiki is not something you master overnight. It is a lifelong journey of compassion, healing, and connection.",
        },
        {
          heading: "Homework after Day 1",
          items: [
            "Self-Reiki for 15 minutes",
            "Write a gratitude journal",
            "Observe emotional changes",
            "Practice Reiki principles",
            "Drink enough water",
            "Rest well",
          ],
        },
      ],
    },
  ],
};
