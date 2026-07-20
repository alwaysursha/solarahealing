const ENERGY_TAKER_TIPS = [
  {
    tone: "deep",
    text: "Recognize the people or activities that drain your energy or negatively impact your well-being.",
  },
  {
    tone: "soft",
    text: "Establish clear boundaries to protect your time, emotions, and energy from being depleted.",
  },
  {
    tone: "mid",
    text: "Seek out uplifting and supportive individuals who inspire and motivate you.",
  },
  {
    tone: "mid",
    text: "Make self-care a priority by engaging in activities that replenish your energy and bring you joy.",
  },
  {
    tone: "deep",
    text: "Failing to establish clear boundaries with others can lead to feeling overwhelmed.",
  },
  {
    tone: "soft",
    text: "Living or working in a cluttered and disorganized environment can create mental and physical stress.",
  },
] as const;

function SparkleIcon() {
  return (
    <svg className="cm-energy-takers-sparkle" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 1.5 L13.85 9.15 L21.5 12 L13.85 14.85 L12 22.5 L10.15 14.85 L2.5 12 L10.15 9.15 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function EnergyTakersVisual({ className = "" }: { className?: string }) {
  return (
    <div className={["cm-energy-takers", className].filter(Boolean).join(" ")}>
      <div className="cm-energy-takers-head">
        <p className="cm-energy-takers-kicker">How to avoid</p>
        <h3 className="cm-energy-takers-title">Energy Takers</h3>
      </div>

      <div className="cm-energy-takers-grid">
        {ENERGY_TAKER_TIPS.slice(0, 3).map((tip) => (
          <article key={tip.text} className={`cm-energy-takers-card tone-${tip.tone}`}>
            <SparkleIcon />
            <p>{tip.text}</p>
          </article>
        ))}
      </div>

      <div className="cm-energy-takers-wave" aria-hidden>
        <svg viewBox="0 0 720 36" preserveAspectRatio="none">
          <path
            d="M0 22 C50 8, 100 34, 150 22 S250 8, 300 22 S400 34, 450 22 S550 8, 600 22 S670 34, 720 22"
            fill="none"
            stroke="rgba(184, 150, 210, 0.7)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M0 18 C50 4, 100 30, 150 18 S250 4, 300 18 S400 30, 450 18 S550 4, 600 18 S670 30, 720 18"
            fill="none"
            stroke="#b7d94a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M0 14 C50 0, 100 26, 150 14 S250 0, 300 14 S400 26, 450 14 S550 0, 600 14 S670 26, 720 14"
            fill="none"
            stroke="rgba(184, 150, 210, 0.55)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="cm-energy-takers-grid">
        {ENERGY_TAKER_TIPS.slice(3).map((tip) => (
          <article key={tip.text} className={`cm-energy-takers-card tone-${tip.tone}`}>
            <SparkleIcon />
            <p>{tip.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
