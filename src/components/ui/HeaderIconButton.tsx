"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { CartIcon } from "@/components/ui/CartIcon";
import { HEADER_CART_TARGET_ID } from "@/lib/cart/types";

type HeaderIconButtonProps = {
  label: string;
  icon: "login" | "cart";
  active?: boolean;
  onClick?: () => void;
  badgeCount?: number;
  pulse?: boolean;
};

function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.15rem] w-[1.15rem]" aria-hidden>
      <path
        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6 21v-1a6 6 0 0 1 12 0v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[1.15rem] w-[1.15rem]" aria-hidden>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

const rotateTransition = {
  duration: 0.38,
  ease: [0.4, 0, 0.2, 1] as const,
};

const iconFadeTransition = {
  duration: 0.16,
  ease: "easeInOut" as const,
};

function RotatingToggleIcon({
  active,
  idleIcon,
}: {
  active: boolean;
  idleIcon: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return active ? <CloseIcon /> : idleIcon;
  }

  return (
    <motion.span
      className="relative flex h-[1.15rem] w-[1.15rem] items-center justify-center"
      animate={{ rotate: active ? -90 : 0 }}
      transition={rotateTransition}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: active ? 0 : 1,
          scale: active ? 0.88 : 1,
        }}
        transition={{
          ...iconFadeTransition,
          delay: active ? 0 : 0.12,
        }}
      >
        {idleIcon}
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: active ? 1 : 0,
          scale: active ? 1 : 0.88,
        }}
        transition={{
          ...iconFadeTransition,
          delay: active ? 0.12 : 0,
        }}
      >
        <CloseIcon />
      </motion.span>
    </motion.span>
  );
}

const buttonClassName = (active: boolean) =>
  [
    "relative flex h-10 w-10 items-center justify-center overflow-visible rounded-full border transition-colors duration-300",
    active
      ? "border-gold/55 bg-cream/10 text-gold"
      : "border-cream/15 text-cream/90 hover:border-gold/45 hover:text-gold",
  ].join(" ");

export function HeaderIconButton({
  label,
  icon,
  active = false,
  onClick,
  badgeCount = 0,
  pulse = false,
}: HeaderIconButtonProps) {
  const reduceMotion = useReducedMotion();
  const idleIcon =
    icon === "login" ? (
      <LoginIcon />
    ) : (
      <CartIcon className="h-[1.15rem] w-[1.15rem]" />
    );

  const slideIndicator = !reduceMotion ? (
    <AnimatePresence>
      {active ? (
        <motion.span
          key={`${icon}-indicator`}
          className="absolute inset-x-2 bottom-1 h-px origin-center bg-gold/70"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 480, damping: 34 }}
        />
      ) : null}
    </AnimatePresence>
  ) : null;

  const showBadge = icon === "cart" && badgeCount > 0 && !active;

  return (
    <motion.div
      whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      animate={pulse && !reduceMotion ? { scale: [1, 1.14, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        id={icon === "cart" ? HEADER_CART_TARGET_ID : undefined}
        aria-label={
          icon === "cart" && badgeCount > 0 ? `${label} (${badgeCount} items)` : label
        }
        aria-expanded={active}
        onClick={onClick}
        className={buttonClassName(active)}
      >
        <span className="relative flex h-[1.15rem] w-[1.15rem] items-center justify-center overflow-hidden">
          <RotatingToggleIcon active={active} idleIcon={idleIcon} />
        </span>
        {slideIndicator}
        <AnimatePresence>
          {showBadge ? (
            <motion.span
              key="cart-badge"
              className="header-cart-badge"
              initial={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
              animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
              exit={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 480, damping: 28 }}
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
