"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/site";
import {
  HEADER_PANEL_EXIT_MS,
  HEADER_PANEL_SHELL_EXPAND_MS,
  headerPanelShellVariants,
  headerPanelShellVariantsChrome,
  headerPanelSlideVariants,
  headerPanelSlideVariantsChrome,
  mobileNavExpandVariantsChrome,
} from "@/lib/header-panel-motion";
import { useCompositorProfile } from "@/lib/compositor-profile";
import { Logo } from "@/components/ui/Logo";
import { HeaderIconButton } from "@/components/ui/HeaderIconButton";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import { HeaderCartPanel } from "@/components/sections/HeaderCartPanel";
import { HeaderLoginPanel } from "@/components/sections/HeaderLoginPanel";
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
  const compositorProfile = useCompositorProfile();
  const chromeTouch = compositorProfile === "chrome-touch";
  const panelShellVariants = chromeTouch ? headerPanelShellVariantsChrome : headerPanelShellVariants;
  const panelSlideVariants = chromeTouch ? headerPanelSlideVariantsChrome : headerPanelSlideVariants;
  const navExpandVariants = chromeTouch ? mobileNavExpandVariantsChrome : expandVariants;
  const [navOpen, setNavOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPanelReady, setLoginPanelReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPanelReady, setCartPanelReady] = useState(false);

  const closeNav = useCallback(() => setNavOpen(false), []);

  const closeOtherPanels = useCallback(() => {
    setLoginPanelReady(false);
    setCartPanelReady(false);
    setLoginOpen(false);
    setCartOpen(false);
  }, []);

  const beginCloseLogin = useCallback(() => {
    setLoginPanelReady(false);
    if (reduceMotion || chromeTouch) {
      setLoginOpen(false);
      return;
    }
    window.setTimeout(() => setLoginOpen(false), HEADER_PANEL_EXIT_MS);
  }, [chromeTouch, reduceMotion]);

  const beginCloseCart = useCallback(() => {
    setCartPanelReady(false);
    if (reduceMotion || chromeTouch) {
      setCartOpen(false);
      return;
    }
    window.setTimeout(() => setCartOpen(false), HEADER_PANEL_EXIT_MS);
  }, [chromeTouch, reduceMotion]);

  const closeLogin = useCallback(() => {
    beginCloseLogin();
  }, [beginCloseLogin]);

  const closeCart = useCallback(() => {
    beginCloseCart();
  }, [beginCloseCart]);

  const toggleLogin = useCallback(() => {
    if (loginOpen) {
      beginCloseLogin();
      return;
    }
    setCartOpen(false);
    setCartPanelReady(false);
    setNavOpen(false);
    setLoginOpen(true);
  }, [beginCloseLogin, loginOpen]);

  const toggleCart = useCallback(() => {
    if (cartOpen) {
      beginCloseCart();
      return;
    }
    setLoginOpen(false);
    setLoginPanelReady(false);
    setNavOpen(false);
    setCartOpen(true);
  }, [beginCloseCart, cartOpen]);

  const toggleNav = useCallback(() => {
    setNavOpen((open) => !open);
    closeOtherPanels();
  }, [closeOtherPanels]);

  useEffect(() => {
    if (!loginOpen) {
      setLoginPanelReady(false);
      return;
    }

    if (reduceMotion || chromeTouch) {
      setLoginPanelReady(true);
      return;
    }

    const timer = window.setTimeout(() => setLoginPanelReady(true), HEADER_PANEL_SHELL_EXPAND_MS);
    return () => window.clearTimeout(timer);
  }, [chromeTouch, loginOpen, reduceMotion]);

  useEffect(() => {
    if (!cartOpen) {
      setCartPanelReady(false);
      return;
    }

    if (reduceMotion || chromeTouch) {
      setCartPanelReady(true);
      return;
    }

    const timer = window.setTimeout(() => setCartPanelReady(true), HEADER_PANEL_SHELL_EXPAND_MS);
    return () => window.clearTimeout(timer);
  }, [cartOpen, chromeTouch, reduceMotion]);

  useEffect(() => {
    if (!loginOpen && !cartOpen && !navOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (cartOpen) {
        beginCloseCart();
      } else if (loginOpen) {
        beginCloseLogin();
      } else {
        setNavOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [beginCloseCart, beginCloseLogin, cartOpen, loginOpen, navOpen]);

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

        <div className="relative z-40 flex shrink-0 items-center gap-1.5 sm:gap-2">
          <HeaderIconButton
            label={loginOpen ? "Close sign in" : "Open sign in"}
            icon="login"
            active={loginOpen}
            onClick={toggleLogin}
          />
          <HeaderIconButton
            label={cartOpen ? "Close cart" : "Open cart"}
            icon="cart"
            active={cartOpen}
            onClick={toggleCart}
          />

          <motion.button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-gold transition-colors hover:text-gold-light lg:hidden"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            onClick={toggleNav}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <MenuToggleIcon open={navOpen} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {loginOpen && (
          <motion.div
            key="header-login-expand"
            className={chromeTouch ? "overflow-hidden" : "grid overflow-hidden"}
            variants={reduceMotion ? undefined : panelShellVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <div className={chromeTouch ? "overflow-hidden" : "min-h-0 overflow-hidden"}>
              <motion.div
                className="origin-top"
                variants={reduceMotion ? undefined : panelSlideVariants}
                initial={reduceMotion ? undefined : "closed"}
                animate={reduceMotion ? undefined : loginPanelReady ? "open" : "closed"}
                exit={reduceMotion ? undefined : "exit"}
              >
                <HeaderLoginPanel onClose={closeLogin} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {cartOpen && (
          <motion.div
            key="header-cart-expand"
            className={chromeTouch ? "overflow-hidden" : "grid overflow-hidden"}
            variants={reduceMotion ? undefined : panelShellVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <div className={chromeTouch ? "overflow-hidden" : "min-h-0 overflow-hidden"}>
              <motion.div
                className="origin-top"
                variants={reduceMotion ? undefined : panelSlideVariants}
                initial={reduceMotion ? undefined : "closed"}
                animate={reduceMotion ? undefined : cartPanelReady ? "open" : "closed"}
                exit={reduceMotion ? undefined : "exit"}
              >
                <HeaderCartPanel onClose={closeCart} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {navOpen && (
          <motion.div
            key="header-nav-expand"
            className="overflow-hidden lg:hidden"
            variants={reduceMotion ? undefined : navExpandVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <MobileNavMenu>
              {site.nav.map((item) =>
                chromeTouch ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-cream/90 hover:text-gold"
                    onClick={closeNav}
                  >
                    {item.label}
                  </a>
                ) : (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="text-cream/90 hover:text-gold"
                    variants={reduceMotion ? undefined : mobileNavItemVariants}
                    onClick={closeNav}
                  >
                    {item.label}
                  </motion.a>
                ),
              )}
              {chromeTouch ? (
                <>
                  <button
                    type="button"
                    className="text-left text-cream/90 hover:text-gold"
                    onClick={() => {
                      closeNav();
                      setLoginOpen(true);
                    }}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    className="text-left text-cream/90 hover:text-gold"
                    onClick={() => {
                      closeNav();
                      setCartOpen(true);
                    }}
                  >
                    Cart
                  </button>
                </>
              ) : (
                <>
                  <motion.button
                    type="button"
                    className="text-left text-cream/90 hover:text-gold"
                    variants={reduceMotion ? undefined : mobileNavItemVariants}
                    onClick={() => {
                      closeNav();
                      setLoginOpen(true);
                    }}
                  >
                    Log in
                  </motion.button>
                  <motion.button
                    type="button"
                    className="text-left text-cream/90 hover:text-gold"
                    variants={reduceMotion ? undefined : mobileNavItemVariants}
                    onClick={() => {
                      closeNav();
                      setCartOpen(true);
                    }}
                  >
                    Cart
                  </motion.button>
                </>
              )}
            </MobileNavMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
