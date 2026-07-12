"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { cartTypeLabel } from "@/lib/cart/types";
import { formatCad } from "@/lib/site";

export function AddedToCartModal() {
  const { recentlyAdded, dismissAddedModal } = useCart();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!recentlyAdded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissAddedModal();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [recentlyAdded, dismissAddedModal]);

  return (
    <AnimatePresence>
      {recentlyAdded ? (
        <motion.div
          key="added-to-cart-modal"
          className="cart-added-modal-root"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <button
            type="button"
            className="cart-added-modal-backdrop"
            aria-label="Continue browsing"
            onClick={dismissAddedModal}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-added-title"
            className="cart-added-modal"
            initial={reduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <div className="cart-added-modal-glow" aria-hidden />
            <p className="cart-added-modal-eyebrow">Cart updated</p>
            <h2 id="cart-added-title" className="cart-added-modal-title">
              Added to your cart
            </h2>

            <div className="cart-added-modal-item">
              <div className="cart-added-modal-thumb">
                {recentlyAdded.image ? (
                  <Image
                    src={recentlyAdded.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                ) : (
                  <span className="cart-added-modal-thumb-fallback" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="cart-added-modal-type">{cartTypeLabel(recentlyAdded.type)}</p>
                <p className="cart-added-modal-name">{recentlyAdded.title}</p>
                <p className="cart-added-modal-meta">
                  Qty {recentlyAdded.quantity} · {formatCad(recentlyAdded.priceCad)}
                </p>
              </div>
            </div>

            <div className="cart-added-modal-actions">
              <Link
                href="/checkout"
                className="cart-added-modal-primary"
                onClick={dismissAddedModal}
              >
                Proceed to Payment
              </Link>
              <button type="button" className="cart-added-modal-secondary" onClick={dismissAddedModal}>
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
