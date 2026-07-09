export type NightStar = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

function hash(n: number): number {
  let t = n + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function buildNightStarfield(count: number): NightStar[] {
  return Array.from({ length: count }, (_, i) => {
    const roll = hash(i);
    const roll2 = hash(i + 5000);
    const roll3 = hash(i + 12000);
    const roll4 = hash(i + 24000);

    return {
      x: roll * 100,
      y: roll2 * 100,
      size: roll3 > 0.97 ? 2.4 : roll3 > 0.9 ? 1.8 : roll3 > 0.55 ? 1.15 : 0.8,
      opacity: 0.3 + roll4 * 0.7,
    };
  });
}

export const NIGHT_STARFIELD = buildNightStarfield(380);
