"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import { MobileNavMenu, mobileNavItemVariants } from "@/components/sections/MobileNavMenu";

const expandVariants = {
  closed: {
    height: 0,
    opacity: 0,
    marginTop: 0,
  },
  open: {
    height: "auto",
    opacity: 1,
    marginTop: 16,
    transition: {
      height: {
        type: "spring",
        stiffness: 380,
        damping: 36,
        mass: 0.9,
      },
      opacity: { duration: 0.28, delay: 0.04 },
      marginTop: {
        type: "spring",
        stiffness: 380,
        damping: 36,
        mass: 0.9,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    marginTop: 0,
    transition: {
      height: { duration: 0.26, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.18 },
      marginTop: { duration: 0.26, ease: [0.4, 0, 0.2, 1] },
    },
  },
} as const;

export function Header() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: -10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-10">
        <Logo variant="light" className="ml-2 min-w-0 max-w-[68%] sm:ml-3 sm:max-w-none md:ml-4" />

        <nav
          className="hidden flex-1 items-center justify-center gap-7 lg:flex xl:gap-10"
          aria-label="Main"
        >
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-cream/92 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative z-40 flex shrink-0 items-center gap-3">
          <motion.button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-gold transition-colors hover:text-gold-light lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <MenuToggleIcon open={open} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="header-expand"
            className="overflow-hidden lg:hidden"
            variants={reduceMotion ? undefined : expandVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <MobileNavMenu>
              {site.nav.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-cream/90 hover:text-gold"
                  variants={reduceMotion ? undefined : mobileNavItemVariants}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </MobileNavMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
