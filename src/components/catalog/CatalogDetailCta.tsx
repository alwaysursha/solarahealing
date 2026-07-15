"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useEnrollmentGate } from "@/components/auth/EnrollmentGateProvider";
import type { CartItemType } from "@/lib/cart/types";

type CatalogAddPayload = {
  id: string;
  title: string;
  priceCad: number;
  image?: string;
};

function EnrolIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

export function CatalogDetailCta({
  type,
  item,
}: {
  type: CartItemType;
  item: CatalogAddPayload;
}) {
  const reduceMotion = useReducedMotion();
  const { requestEnrollment } = useEnrollmentGate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const label =
    type === "course" ? "Enroll Now" : type === "private_session" ? "Book a Session" : "Register Now";

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className="catalog-detail-cta"
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      onClick={() =>
        requestEnrollment(
          {
            id: item.id,
            type,
            title: item.title,
            priceCad: item.priceCad,
            image: item.image,
          },
          buttonRef.current,
          Boolean(reduceMotion),
        )
      }
    >
      <span className="catalog-detail-cta-shine" aria-hidden />
      {type === "course" || type === "private_session" ? <EnrolIcon className="relative h-4 w-4" /> : null}
      <span className="relative">{label}</span>
    </motion.button>
  );
}
