"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useEnrollmentGate } from "@/components/auth/EnrollmentGateProvider";

const FLY_DURATION_MS = 780;

export function FlyToLoginLayer() {
  const { loginFlyParticle, completeLoginFly } = useEnrollmentGate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!loginFlyParticle || reduceMotion) return;
    const timer = window.setTimeout(() => completeLoginFly(), FLY_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [loginFlyParticle, completeLoginFly, reduceMotion]);

  return (
    <AnimatePresence>
      {loginFlyParticle ? (
        <motion.div
          key={loginFlyParticle.id}
          className="login-fly-particle pointer-events-none fixed z-[95]"
          initial={{
            left: loginFlyParticle.from.x,
            top: loginFlyParticle.from.y,
            x: "-50%",
            y: "-50%",
            scale: 1,
            opacity: 1,
          }}
          animate={{
            left: loginFlyParticle.to.x,
            top: loginFlyParticle.to.y,
            x: "-50%",
            y: "-50%",
            scale: 0.42,
            opacity: 0.92,
          }}
          exit={{ opacity: 0, scale: 0.25 }}
          transition={{ duration: FLY_DURATION_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <span className="login-fly-particle-inner">
            {loginFlyParticle.initial ?? "S"}
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
