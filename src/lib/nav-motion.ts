const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const revealEase: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const desktopNavStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.22,
    },
  },
} as const;

export const desktopNavItem = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: luxuryEase,
    },
  },
} as const;

export const mobileNavPanelVariants = {
  closed: {
    opacity: 0,
    y: -14,
    scale: 0.985,
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 34,
      mass: 0.88,
      delay: 0.05,
    },
  },
} as const;

export const mobileNavListVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.14,
    },
  },
} as const;

export const mobileNavItemVariants = {
  closed: {
    opacity: 0,
    x: -18,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 32,
      mass: 0.82,
    },
  },
} as const;

export const mobileNavFooterVariants = {
  closed: {
    opacity: 0,
    y: 10,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: revealEase,
      delay: 0.38,
    },
  },
} as const;
