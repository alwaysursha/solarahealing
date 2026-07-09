export const HERO_REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Staggered hero entrance — image, text, caption, then controls */
export const HERO_IMAGE_DELAY_S = 0.15;
export const HERO_TEXT_DELAY_S = 0.28;
export const HERO_CAPTION_DELAY_S = 0.4;
export const HERO_CONTROLS_DELAY_S = HERO_TEXT_DELAY_S + 0.55 + 0.14;
export const HERO_ENTRANCE_DURATION_S = 0.72;

/** About and below wait until the hero entrance finishes */
export const HOME_HERO_ENTRANCE_MS = Math.round(
  (HERO_IMAGE_DELAY_S + HERO_ENTRANCE_DURATION_S) * 1000,
);

/** Slide-to-slide transitions (after initial entrance) */
export const HERO_SLIDE_CHANGE_DURATION_S = 0.72;
export const HERO_SLIDE_BG_DURATION_S = 0.95;
export const HERO_SLIDE_CHANGE_EASE: [number, number, number, number] = [
  0.45, 0, 0.15, 1,
];
