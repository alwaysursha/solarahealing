const MANDALA_RAYS = [0, 45, 90, 135, 180, 225, 270, 315] as const;
const MANDALA_PETALS = [0, 60, 120, 180, 240, 300] as const;

function polarString(cx: number, cy: number, radius: number, degrees: number) {
  const rad = (degrees * Math.PI) / 180;
  return {
    x: (cx + radius * Math.cos(rad)).toFixed(2),
    y: (cy + radius * Math.sin(rad)).toFixed(2),
  };
}

const MANDALA_RAY_LINES = MANDALA_RAYS.map((angle) => ({
  angle,
  ...polarString(60, 60, 50, angle),
}));

const MANDALA_PETAL_CIRCLES = MANDALA_PETALS.map((angle) => ({
  angle,
  ...polarString(60, 60, 25, angle),
}));

export function MandalaPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
      aria-hidden
    >
      <defs>
        <pattern
          id="mandala"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="60" cy="60" r="50" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="35" fill="none" stroke="white" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="20" fill="none" stroke="white" strokeWidth="0.5" />
          {MANDALA_RAY_LINES.map((ray) => (
            <line
              key={ray.angle}
              x1="60"
              y1="60"
              x2={ray.x}
              y2={ray.y}
              stroke="white"
              strokeWidth="0.3"
            />
          ))}
          {MANDALA_PETAL_CIRCLES.map((petal) => (
            <circle
              key={`petal-${petal.angle}`}
              cx={petal.x}
              cy={petal.y}
              r="8"
              fill="none"
              stroke="white"
              strokeWidth="0.3"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mandala)" />
    </svg>
  );
}
