const WHEEL_ITEMS = [
  { label: ["Promotes Deep", "Relaxation"], color: "#f4b8c8", fontSize: 19 },
  { label: ["Relief of Stress", "and Anxiety"], color: "#b8e0c8", fontSize: 19 },
  { label: ["Promotes", "Pain Relief"], color: "#cbb8e8", fontSize: 19 },
  { label: ["Eases Muscle", "Tension"], color: "#a8d8e8", fontSize: 19 },
  { label: ["Peace of Mind", "and Body"], color: "#f0c8a8", fontSize: 19 },
  { label: ["Increases Rate", "of Recovery", "from Injury"], color: "#f0b0b0", fontSize: 16.75 },
  { label: ["Energizes and", "balances the", "whole body"], color: "#b8dcc0", fontSize: 16.75 },
  { label: ["Strengthens", "Immune System"], color: "#d0b8e8", fontSize: 19 },
] as const;

export function ReikiBenefitsWheel({ className = "" }: { className?: string }) {
  const size = 700;
  const center = size / 2;
  const hubRadius = 84;
  const nodeRadius = 82;
  const orbit = 230;

  return (
    <svg
      className={["cm-reiki-wheel", className].filter(Boolean).join(" ")}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Reiki benefits diagram"
    >
      <defs>
        <radialGradient id="cm-reiki-hub" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#eaf7ff" />
          <stop offset="45%" stopColor="#b9e0f8" />
          <stop offset="100%" stopColor="#7ebce8" />
        </radialGradient>
        <filter id="cm-reiki-soft" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="rgba(58, 37, 96, 0.2)" />
        </filter>
        {WHEEL_ITEMS.map((item, index) => (
          <marker
            key={`arrow-${index}`}
            id={`cm-reiki-arrow-${index}`}
            markerWidth="5"
            markerHeight="5"
            refX="3.2"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L5,2.5 L0,5 Z" fill={item.color} />
          </marker>
        ))}
      </defs>

      {WHEEL_ITEMS.map((item, index) => {
        const angle = (Math.PI * 2 * index) / WHEEL_ITEMS.length - Math.PI / 2;
        const x = center + Math.cos(angle) * orbit;
        const y = center + Math.sin(angle) * orbit;
        const hubEdgeX = center + Math.cos(angle) * (hubRadius + 4);
        const hubEdgeY = center + Math.sin(angle) * (hubRadius + 4);
        const nodeEdgeX = x - Math.cos(angle) * (nodeRadius + 8);
        const nodeEdgeY = y - Math.sin(angle) * (nodeRadius + 8);
        const lineHeight = item.fontSize + 2;
        const textStartY = y - ((item.label.length - 1) * lineHeight) / 2;

        return (
          <g key={item.label.join("-")}>
            <line
              x1={hubEdgeX}
              y1={hubEdgeY}
              x2={nodeEdgeX}
              y2={nodeEdgeY}
              stroke={item.color}
              strokeWidth="13"
              strokeLinecap="round"
              markerEnd={`url(#cm-reiki-arrow-${index})`}
            />
            <circle cx={x} cy={y} r={nodeRadius} fill={item.color} filter="url(#cm-reiki-soft)" />
            <circle cx={x} cy={y} r={nodeRadius - 4} fill="rgba(255,255,255,0.24)" />
            <text
              x={x}
              y={textStartY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#2a1640"
              style={{ fontSize: `${item.fontSize}px`, fontWeight: 700 }}
            >
              {item.label.map((line, lineIndex) => (
                <tspan key={line} x={x} dy={lineIndex === 0 ? 0 : lineHeight}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r={hubRadius} fill="url(#cm-reiki-hub)" filter="url(#cm-reiki-soft)" />
      <circle cx={center} cy={center} r={hubRadius - 5} fill="rgba(255,255,255,0.3)" />
      <text
        x={center}
        y={center + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1c102e"
        style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "0.1em" }}
      >
        REIKI
      </text>
    </svg>
  );
}
