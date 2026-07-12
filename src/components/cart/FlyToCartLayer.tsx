"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

const FLY_DURATION_MS = 720;

export function FlyToCartLayer() {
  const { flyParticle, completeFly } = useCart();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!flyParticle || reduceMotion) return;
    const timer = window.setTimeout(() => completeFly(), FLY_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [flyParticle, completeFly, reduceMotion]);

  return (
    <AnimatePresence>
      {flyParticle ? (
        <motion.div
          key={flyParticle.id}
          className="cart-fly-particle pointer-events-none fixed z-[80]"
          initial={{
            left: flyParticle.from.x,
            top: flyParticle.from.y,
            x: "-50%",
            y: "-50%",
            scale: 1,
            opacity: 1,
          }}
          animate={{
            left: flyParticle.to.x,
            top: flyParticle.to.y,
            x: "-50%",
            y: "-50%",
            scale: 0.35,
            opacity: 0.85,
          }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: FLY_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <span className="cart-fly-particle-inner">
            {flyParticle.image ? (
              <img src={flyParticle.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="cart-fly-particle-fallback" />
            )}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
