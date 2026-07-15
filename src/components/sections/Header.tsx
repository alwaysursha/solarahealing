"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { consumePostLoginRedirect, getFirstName } from "@/lib/auth-utils";
import {
  HEADER_PANEL_EXIT_MS,
  HEADER_PANEL_SHELL_EXPAND_MS,
  headerPanelShellVariants,
  headerPanelSlideVariants,
} from "@/lib/header-panel-motion";
import { Logo } from "@/components/ui/Logo";
import { HeaderIconButton } from "@/components/ui/HeaderIconButton";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import { HeaderCartPanel } from "@/components/sections/HeaderCartPanel";
import { HeaderLoginPanel } from "@/components/sections/HeaderLoginPanel";
import { HeaderAccountPanel, HeaderUserGreeting } from "@/components/sections/HeaderAccountPanel";
import { MobileNavMenu } from "@/components/sections/MobileNavMenu";
import { DesktopNav } from "@/components/sections/nav/DesktopNav";
import { useEnrollmentGate } from "@/components/auth/EnrollmentGateProvider";
import { useCart } from "@/components/cart/CartProvider";
import { HEADER_LOGIN_TARGET_ID } from "@/lib/auth-utils";

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
  const router = useRouter();
  const { nav } = useSiteChrome();
  const { data: session, status } = useSession();
  const { totalQuantity, cartPulse } = useCart();
  const { accountPulse } = useEnrollmentGate();
  const postLoginRedirectHandled = useRef(false);
  const firstName = session?.user?.name ? getFirstName(session.user.name) : null;
  const isLoggedIn = status === "authenticated" && Boolean(session?.user);
  const [navOpen, setNavOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPanelReady, setLoginPanelReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartPanelReady, setCartPanelReady] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || postLoginRedirectHandled.current) {
      return;
    }

    const destination = consumePostLoginRedirect(
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
      session.user.role,
    );

    if (!destination || destination === window.location.pathname) {
      return;
    }

    postLoginRedirectHandled.current = true;
    router.replace(destination);
  }, [router, session, status]);

  const closeNav = useCallback(() => setNavOpen(false), []);

  const closeOtherPanels = useCallback(() => {
    setLoginPanelReady(false);
    setCartPanelReady(false);
    setLoginOpen(false);
    setCartOpen(false);
  }, []);

  const beginCloseLogin = useCallback(() => {
    setLoginPanelReady(false);
    if (reduceMotion) {
      setLoginOpen(false);
      return;
    }
    window.setTimeout(() => setLoginOpen(false), HEADER_PANEL_EXIT_MS);
  }, [reduceMotion]);

  const beginCloseCart = useCallback(() => {
    setCartPanelReady(false);
    if (reduceMotion) {
      setCartOpen(false);
      return;
    }
    window.setTimeout(() => setCartOpen(false), HEADER_PANEL_EXIT_MS);
  }, [reduceMotion]);

  const closeLogin = useCallback(() => {
    beginCloseLogin();
  }, [beginCloseLogin]);

  const closeCart = useCallback(() => {
    beginCloseCart();
  }, [beginCloseCart]);

  const handleLoggedOut = useCallback(() => {
    setLogoutMessage("You have signed out successfully.");
    window.setTimeout(() => setLogoutMessage(null), 4500);
  }, []);

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

    if (reduceMotion) {
      setLoginPanelReady(true);
      return;
    }

    const timer = window.setTimeout(() => setLoginPanelReady(true), HEADER_PANEL_SHELL_EXPAND_MS);
    return () => window.clearTimeout(timer);
  }, [loginOpen, reduceMotion]);

  useEffect(() => {
    if (!cartOpen) {
      setCartPanelReady(false);
      return;
    }

    if (reduceMotion) {
      setCartPanelReady(true);
      return;
    }

    const timer = window.setTimeout(() => setCartPanelReady(true), HEADER_PANEL_SHELL_EXPAND_MS);
    return () => window.clearTimeout(timer);
  }, [cartOpen, reduceMotion]);

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

        <DesktopNav />

        <div className="relative z-40 flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {isLoggedIn && firstName ? (
              <motion.button
                type="button"
                id={HEADER_LOGIN_TARGET_ID}
                className={[
                  "header-user-greeting-trigger flex",
                  loginOpen ? "header-user-greeting-trigger-active" : "",
                  accountPulse ? "header-account-pulse" : "",
                ].join(" ")}
                aria-expanded={loginOpen}
                aria-label={loginOpen ? "Close account menu" : "Open account menu"}
                onClick={toggleLogin}
                animate={
                  accountPulse && !reduceMotion
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <HeaderUserGreeting firstName={firstName} expanded={loginOpen} />
              </motion.button>
            ) : (
              <HeaderIconButton
                label={loginOpen ? "Close sign in" : "Open sign in"}
                icon="login"
                active={loginOpen}
                onClick={toggleLogin}
                pulse={accountPulse}
                targetId={HEADER_LOGIN_TARGET_ID}
              />
            )}
            <HeaderIconButton
              label={cartOpen ? "Close cart" : "Open cart"}
              icon="cart"
              active={cartOpen}
              onClick={toggleCart}
              badgeCount={totalQuantity}
              pulse={cartPulse}
            />
          </div>

          <motion.button
            type="button"
            className={[
              "relative flex h-10 w-10 items-center justify-center overflow-visible rounded-full border transition-colors duration-300 lg:hidden",
              navOpen
                ? "border-gold/55 bg-cream/10 text-gold"
                : "border-cream/15 text-cream/90 hover:border-gold/45 hover:text-gold",
            ].join(" ")}
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
        {logoutMessage ? (
          <motion.div
            key="header-logout-notice"
            className="header-logout-notice-wrap"
            initial={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.28 }}
          >
            <p className="header-logout-notice" role="status" aria-live="polite">
              {logoutMessage}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {loginOpen && (
          <motion.div
            key="header-login-expand"
            className="grid overflow-hidden"
            variants={reduceMotion ? undefined : headerPanelShellVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <div className="min-h-0 overflow-hidden">
              <motion.div
                className="origin-top"
                variants={reduceMotion ? undefined : headerPanelSlideVariants}
                initial={reduceMotion ? undefined : "closed"}
                animate={reduceMotion ? undefined : loginPanelReady ? "open" : "closed"}
                exit={reduceMotion ? undefined : "exit"}
              >
                {isLoggedIn ? (
                  <HeaderAccountPanel onClose={closeLogin} onLoggedOut={handleLoggedOut} />
                ) : (
                  <HeaderLoginPanel onClose={closeLogin} />
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {cartOpen && (
          <motion.div
            key="header-cart-expand"
            className="grid overflow-hidden"
            variants={reduceMotion ? undefined : headerPanelShellVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <div className="min-h-0 overflow-hidden">
              <motion.div
                className="origin-top"
                variants={reduceMotion ? undefined : headerPanelSlideVariants}
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
            variants={reduceMotion ? undefined : expandVariants}
            initial={reduceMotion ? undefined : "closed"}
            animate={reduceMotion ? undefined : "open"}
            exit={reduceMotion ? undefined : "exit"}
          >
            <MobileNavMenu
              items={nav}
              onClose={closeNav}
              onLogin={() => setLoginOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
