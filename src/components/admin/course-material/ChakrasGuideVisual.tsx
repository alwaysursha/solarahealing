import { ChakraWatermark } from "@/components/admin/course-material/ChakraWatermark";

const CHAKRA_ROWS = [
  {
    id: "crown",
    number: 7,
    name: "Crown",
    sanskrit: "Sahasrara",
    colorLabel: "Violet / White",
    color: "#7b4db8",
    soft: "rgba(123, 77, 184, 0.12)",
    glyph: "ॐ",
    mantra: "OM (A-U-M)",
    blockages: [
      "Lack of purpose",
      "Disconnection from higher self",
      "Confusion, doubt",
      "Closed-mindedness",
    ],
  },
  {
    id: "third-eye",
    number: 6,
    name: "Third Eye",
    sanskrit: "Ajna",
    colorLabel: "Indigo",
    color: "#3f4ea8",
    soft: "rgba(63, 78, 168, 0.12)",
    glyph: "ॐ",
    mantra: "OM (A-U-M)",
    blockages: [
      "Lack of clarity",
      "Poor intuition",
      "Mental confusion",
      "Headaches",
    ],
  },
  {
    id: "throat",
    number: 5,
    name: "Throat",
    sanskrit: "Vishuddha",
    colorLabel: "Blue",
    color: "#2f8fc4",
    soft: "rgba(47, 143, 196, 0.12)",
    glyph: "हं",
    mantra: "HAM (HUM)",
    blockages: [
      "Poor communication",
      "Fear of speaking",
      "Thyroid issues",
      "Difficulty expressing truth",
    ],
  },
  {
    id: "heart",
    number: 4,
    name: "Heart",
    sanskrit: "Anahata",
    colorLabel: "Green",
    color: "#3f9a58",
    soft: "rgba(63, 154, 88, 0.12)",
    glyph: "यं",
    mantra: "YAM (YUM)",
    blockages: [
      "Emotional pain",
      "Lack of empathy",
      "Isolation",
      "Heart or lung issues",
    ],
  },
  {
    id: "solar",
    number: 3,
    name: "Solar Plexus",
    sanskrit: "Manipura",
    colorLabel: "Yellow",
    color: "#d4a017",
    soft: "rgba(212, 160, 23, 0.14)",
    glyph: "रं",
    mantra: "RAM (RUM)",
    blockages: [
      "Low self-esteem",
      "Lack of motivation",
      "Digestive issues",
      "Anger, control issues",
    ],
  },
  {
    id: "sacral",
    number: 2,
    name: "Sacral",
    sanskrit: "Svadhisthana",
    colorLabel: "Orange",
    color: "#e07828",
    soft: "rgba(224, 120, 40, 0.12)",
    glyph: "वं",
    mantra: "VAM (VUM)",
    blockages: [
      "Emotional instability",
      "Lack of creativity",
      "Sexual imbalance",
      "Guilt or shame",
    ],
  },
  {
    id: "root",
    number: 1,
    name: "Root",
    sanskrit: "Muladhara",
    colorLabel: "Red",
    color: "#c0392b",
    soft: "rgba(192, 57, 43, 0.12)",
    glyph: "लं",
    mantra: "LAM (LUM)",
    blockages: [
      "Fear, anxiety",
      "Financial instability",
      "Survival issues",
      "Fatigue, lower back pain",
    ],
  },
] as const;

function ChakraSymbol({ color, id }: { color: string; id: string }) {
  return (
    <svg className="cm-chakras-guide-symbol" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="18" fill={color} opacity="0.18" />
      <circle cx="20" cy="20" r="12.5" fill="none" stroke={color} strokeWidth="1.6" />
      {id === "root" ? (
        <path d="M14 14 H26 V26 H14 Z M20 16 L24 24 H16 Z" fill="none" stroke={color} strokeWidth="1.4" />
      ) : null}
      {id === "sacral" ? (
        <path d="M12 22 A8 8 0 0 1 28 22" fill="none" stroke={color} strokeWidth="1.5" />
      ) : null}
      {id === "solar" ? <path d="M20 13 L26 25 H14 Z" fill="none" stroke={color} strokeWidth="1.5" /> : null}
      {id === "heart" ? (
        <path
          d="M20 12 L24 20 L20 28 L16 20 Z M12 20 L20 16 L28 20 L20 24 Z"
          fill="none"
          stroke={color}
          strokeWidth="1.3"
        />
      ) : null}
      {id === "throat" ? (
        <>
          <circle cx="20" cy="20" r="5.5" fill="none" stroke={color} strokeWidth="1.4" />
          <path d="M20 16 L23 24 H17 Z" fill="none" stroke={color} strokeWidth="1.3" />
        </>
      ) : null}
      {id === "third-eye" || id === "crown" ? (
        <circle cx="20" cy="20" r="4.2" fill={color} opacity="0.85" />
      ) : null}
      <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="1.2" opacity="0.55" />
    </svg>
  );
}

export function ChakrasGuideVisual() {
  return (
    <div className="cm-chakras-guide">
      <ChakraWatermark />

      <header className="cm-chakras-guide-head">
        <h2 className="cm-chakras-guide-title">The 7 Chakras</h2>
        <p className="cm-chakras-guide-subtitle">Energy Centers of Balance and Well-Being</p>
        <span className="cm-chakras-guide-lotus" aria-hidden>
          ✦
        </span>
      </header>

      <div className="cm-chakras-guide-body">
        <div className="cm-chakras-guide-table-wrap">
          <div className="cm-chakras-guide-table-head" aria-hidden>
            <span>Chakra</span>
            <span>Color</span>
            <span>Blockages May Cause</span>
            <span>Beej Mantra</span>
          </div>

          <div className="cm-chakras-guide-rows">
            {CHAKRA_ROWS.map((row) => (
              <article
                key={row.id}
                className="cm-chakras-guide-row"
                style={{ ["--chakra-soft" as string]: row.soft, ["--chakra-color" as string]: row.color }}
              >
                <div className="cm-chakras-guide-name">
                  <ChakraSymbol color={row.color} id={row.id} />
                  <div>
                    <p className="cm-chakras-guide-name-main">
                      {row.number}. {row.name}
                    </p>
                    <p className="cm-chakras-guide-name-sub">({row.sanskrit})</p>
                  </div>
                </div>

                <div className="cm-chakras-guide-color">
                  <span className="cm-chakras-guide-swatch" style={{ background: row.color }} />
                  <span>{row.colorLabel}</span>
                </div>

                <ul className="cm-chakras-guide-blockages">
                  {row.blockages.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="cm-chakras-guide-mantra">
                  <span className="cm-chakras-guide-glyph" style={{ color: row.color }}>
                    {row.glyph}
                  </span>
                  <span>{row.mantra}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <footer className="cm-chakras-guide-foot">
        <p>
          When energy flows freely through our chakras, we experience harmony, vitality, and a deep sense of
          connection with ourselves and the universe.
        </p>
      </footer>
    </div>
  );
}
