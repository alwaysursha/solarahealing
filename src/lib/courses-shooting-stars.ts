export type ShootingStarConfig = {
  top: number;
  left: number;
  duration: number;
  angle: number;
  distanceX: number;
  distanceY: number;
};

function hash(n: number): number {
  let t = n + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function createLeadStar(seed: number): ShootingStarConfig {
  const roll = hash(seed);
  const roll2 = hash(seed + 900);
  const roll3 = hash(seed + 1800);
  const roll4 = hash(seed + 2700);
  const roll5 = hash(seed + 3600);

  return {
    top: 2 + roll * 12,
    left: 2 + roll2 * 18,
    duration: 3 + roll3 * 3,
    angle: 34 + roll4 * 5,
    distanceX: 480 + roll5 * 140,
    distanceY: 300 + hash(seed + 4500) * 120,
  };
}

export function createFollowerStar(seed: number, lead: ShootingStarConfig): ShootingStarConfig {
  const roll = hash(seed);
  const roll2 = hash(seed + 1100);
  const roll3 = hash(seed + 2200);

  const leadRatio = lead.distanceY / lead.distanceX;
  const followerRatio = leadRatio + 0.12 + roll * 0.18;
  const distanceX = lead.distanceX * (0.82 + roll2 * 0.12);

  return {
    top: Math.max(0.5, lead.top - (4 + roll * 6)),
    left: Math.max(0.5, lead.left - (3 + roll2 * 5)),
    duration: 3.2 + hash(seed + 3300) * 2.8,
    angle: lead.angle + 8 + roll3 * 10,
    distanceX,
    distanceY: distanceX * followerRatio,
  };
}

export function isPairEvent(seed: number): boolean {
  return hash(seed) > 0.42;
}

export function pairStaggerDelay(seed: number): number {
  return 2.8 + hash(seed + 7700) * 2.4;
}

export function eventGapDelay(seed: number): number {
  return 7 + hash(seed + 8800) * 9;
}
