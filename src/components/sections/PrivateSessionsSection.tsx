"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useEnrollmentGate } from "@/components/auth/EnrollmentGateProvider";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { toImageObjectPosition } from "@/lib/image-focus";
import { formatCad, privateSessions, privateSessionsIntro } from "@/lib/site";

type SessionItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  priceCad: number;
  image: string;
  imageAlt: string;
  imageFocusX?: number;
  imageFocusY?: number;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headReveal = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const gridStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

function sessionImagePosition(session: SessionItem) {
  return toImageObjectPosition(session.imageFocusX ?? 50, session.imageFocusY ?? 50);
}

function BookButton({
  session,
}: {
  session: Pick<SessionItem, "id" | "title" | "priceCad" | "image">;
}) {
  const reduceMotion = useReducedMotion();
  const { requestEnrollment } = useEnrollmentGate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className="private-sessions-book"
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      onClick={() =>
        requestEnrollment(
          {
            id: session.id,
            type: "private_session",
            title: session.title,
            priceCad: session.priceCad,
            image: session.image,
          },
          buttonRef.current,
          Boolean(reduceMotion),
        )
      }
    >
      Book a Session
    </motion.button>
  );
}

function SessionCard({ session }: { session: SessionItem }) {
  return (
    <article className="private-sessions-card group">
      <Link href={`/sessions/${session.id}`} className="private-sessions-card-media">
        <Image
          src={session.image}
          alt={session.imageAlt}
          fill
          sizes="(max-width: 900px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: sessionImagePosition(session) }}
        />
        <span className="private-sessions-card-veil" aria-hidden />
      </Link>

      <div className="private-sessions-card-body">
        <p className="private-sessions-card-duration">{session.duration}</p>
        <h3 className="private-sessions-card-title">
          <Link href={`/sessions/${session.id}`}>{session.title}</Link>
        </h3>
        <p className="private-sessions-card-copy">{session.description}</p>

        <div className="private-sessions-card-footer">
          <div>
            <p className="private-sessions-card-fee-label">Session fee</p>
            <p className="private-sessions-card-price">{formatCad(session.priceCad)}</p>
          </div>
          <BookButton session={session} />
        </div>

        <Link href={`/sessions/${session.id}`} className="private-sessions-card-details">
          View details
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

export function PrivateSessionsSection({
  sessions,
  intro = privateSessionsIntro,
}: {
  sessions?: SessionItem[];
  intro?: typeof privateSessionsIntro;
}) {
  const catalog = sessions && sessions.length > 0 ? sessions : [...privateSessions];
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(sectionRef);

  if (catalog.length === 0) {
    return null;
  }

  return (
    <section
      id="sessions"
      ref={sectionRef}
      className={`private-sessions site-scroll-section${animationsActive ? "" : " animations-paused"}`}
    >
      <div className="private-sessions-aura" aria-hidden />
      <div className="private-sessions-grain" aria-hidden />

      <div className="private-sessions-inner">
        <motion.header
          className="private-sessions-head"
          variants={headReveal}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
        >
          <h2 className="private-sessions-title">
            {intro.title}{" "}
            <span>{intro.titleAccent}</span>
          </h2>
          <p className="private-sessions-description">{intro.description}</p>
        </motion.header>

        <motion.div
          className="private-sessions-grid"
          variants={gridStagger}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.15, margin: "-40px" }}
        >
          {catalog.map((session) => (
            <motion.div key={session.id} variants={cardReveal} className="h-full">
              <SessionCard session={session} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
