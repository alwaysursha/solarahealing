import Image from "next/image";

const LEFT_PRACTICES = [
  {
    heading: "Breathing",
    text: "Deep, conscious breathing clears blocks and energizes your chakras.",
    accent: "#2f8fc4",
  },
  {
    heading: "Mindfulness",
    text: "Being present in the moment helps keep your energy balanced.",
    accent: "#3f9a88",
  },
  {
    heading: "Healthy Lifestyle",
    text: "Nutritious food, hydration, and quality sleep support vibrant energy flow.",
    accent: "#6a9a3f",
  },
  {
    heading: "Positive Relationships",
    text: "Surround yourself with love, support and positive energy that uplift and inspire you.",
    accent: "#c45f8f",
  },
  {
    heading: "Time in Nature",
    text: "Nature heals, grounds and restores balance to your entire system.",
    accent: "#3f9a58",
  },
] as const;

const RIGHT_PRACTICES = [
  {
    heading: "Meditation",
    text: "Calms the mind, centers your energy and improves focus.",
    accent: "#5c1470",
  },
  {
    heading: "Yoga",
    text: "Yoga postures and movement help open, activate and align your chakras.",
    accent: "#6b3fa0",
  },
  {
    heading: "Sound",
    text: "Sound vibrations and mantras clear blockages and raise your vibration.",
    accent: "#4a3f9a",
  },
  {
    heading: "Visualization",
    text: "Visualizing healing light and balanced chakras strengthens your energy centers.",
    accent: "#3f4ea8",
  },
  {
    heading: "Reiki",
    text: "Reiki (after appropriate training) helps clear blocks and restores natural balance.",
    accent: "#8f63b5",
  },
] as const;

function PracticeCard({
  heading,
  text,
  accent,
}: {
  heading: string;
  text: string;
  accent: string;
}) {
  return (
    <article className="cm-balancing-card" style={{ ["--balancing-accent" as string]: accent }}>
      <h3 className="cm-balancing-card-heading">{heading}</h3>
      <p className="cm-balancing-card-text">{text}</p>
    </article>
  );
}

export function BalancingChakrasVisual() {
  return (
    <div className="cm-balancing">
      <header className="cm-balancing-head">
        <h2 className="cm-balancing-title">Balancing Chakras</h2>
        <p className="cm-balancing-subtitle">Ways to Keep Your Energy Centers Balanced</p>
      </header>

      <div className="cm-balancing-body">
        <div className="cm-balancing-col">
          {LEFT_PRACTICES.map((practice) => (
            <PracticeCard key={practice.heading} {...practice} />
          ))}
        </div>

        <div className="cm-balancing-figure">
          <Image
            src="/course-material/introduction-to-reiki/balancing-chakras-center-figure.png"
            alt="Woman meditating with the seven chakras aligned along the spine"
            width={1024}
            height={1536}
            className="cm-balancing-figure-img"
            quality={95}
            priority
          />
        </div>

        <div className="cm-balancing-col">
          {RIGHT_PRACTICES.map((practice) => (
            <PracticeCard key={practice.heading} {...practice} />
          ))}
        </div>
      </div>

      <footer className="cm-balancing-foot">
        <p>Balance your chakras, balance your life.</p>
      </footer>
    </div>
  );
}
