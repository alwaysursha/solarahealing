export const HEADER_PANEL_SHELL_EXPAND_MS = 360;
export const HEADER_PANEL_EXIT_MS = 240;

const shellEase: [number, number, number, number] = [0.4, 0, 0.2, 1];
const shellCloseEase: [number, number, number, number] = [0.4, 0, 1, 1];

export const headerPanelShellVariants = {
  closed: {
    gridTemplateRows: "0fr",
    marginTop: 0,
    opacity: 0,
  },
  open: {
    gridTemplateRows: "1fr",
    marginTop: 14,
    opacity: 1,
    transition: {
      gridTemplateRows: { duration: 0.36, ease: shellEase },
      marginTop: { duration: 0.36, ease: shellEase },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    gridTemplateRows: "0fr",
    marginTop: 0,
    opacity: 0,
    transition: {
      gridTemplateRows: {
        duration: 0.3,
        ease: shellEase,
        delay: HEADER_PANEL_EXIT_MS / 1000,
      },
      marginTop: {
        duration: 0.3,
        ease: shellEase,
        delay: HEADER_PANEL_EXIT_MS / 1000,
      },
      opacity: { duration: 0.16, delay: HEADER_PANEL_EXIT_MS / 1000 },
    },
  },
} as const;

/** Chrome mobile — grid 0fr/1fr + transformed ancestors fail to expand the header shell */
export const headerPanelShellVariantsChrome = {
  closed: {
    maxHeight: 0,
    marginTop: 0,
    overflow: "hidden",
  },
  open: {
    maxHeight: 360,
    marginTop: 14,
    overflow: "hidden",
    transition: {
      maxHeight: { duration: 0.32, ease: shellEase },
      marginTop: { duration: 0.32, ease: shellEase },
    },
  },
  exit: {
    maxHeight: 0,
    marginTop: 0,
    overflow: "hidden",
    transition: {
      maxHeight: { duration: 0.24, ease: shellCloseEase },
      marginTop: { duration: 0.24, ease: shellCloseEase },
    },
  },
} as const;

export const mobileNavExpandVariantsChrome = {
  closed: {
    maxHeight: 0,
    marginTop: 0,
    overflow: "hidden",
  },
  open: {
    maxHeight: 580,
    marginTop: 16,
    overflow: "hidden",
    transition: {
      maxHeight: { duration: 0.32, ease: shellEase },
      marginTop: { duration: 0.32, ease: shellEase },
    },
  },
  exit: {
    maxHeight: 0,
    marginTop: 0,
    overflow: "hidden",
    transition: {
      maxHeight: { duration: 0.22, ease: shellCloseEase },
      marginTop: { duration: 0.22, ease: shellCloseEase },
    },
  },
} as const;

export const headerPanelSlideVariants = {
  closed: {
    opacity: 0,
    y: 12,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
} as const;

export const headerPanelSlideVariantsChrome = {
  closed: { opacity: 1 },
  open: { opacity: 1 },
  exit: { opacity: 1 },
} as const;
