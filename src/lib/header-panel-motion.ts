export const HEADER_PANEL_SHELL_EXPAND_MS = 360;
export const HEADER_PANEL_EXIT_MS = 240;

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
      gridTemplateRows: { duration: 0.36, ease: [0.4, 0, 0.2, 1] },
      marginTop: { duration: 0.36, ease: [0.4, 0, 0.2, 1] },
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
        ease: [0.4, 0, 0.2, 1],
        delay: HEADER_PANEL_EXIT_MS / 1000,
      },
      marginTop: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        delay: HEADER_PANEL_EXIT_MS / 1000,
      },
      opacity: { duration: 0.16, delay: HEADER_PANEL_EXIT_MS / 1000 },
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
