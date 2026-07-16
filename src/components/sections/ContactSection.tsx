"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { ChakraDivider } from "@/components/ui/ChakraDivider";
import {
  submitContactFormAction,
  type ContactFormState,
} from "@/lib/contact-actions";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";

export type ContactSectionInfo = {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
};

const initialFormState: ContactFormState = { ok: false };

function ContactIcon({ kind }: { kind: "email" | "phone" | "location" }) {
  switch (kind) {
    case "email":
      return (
        <svg viewBox="0 0 24 24" className="contact-detail-icon" aria-hidden>
          <path
            fill="currentColor"
            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
          />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className="contact-detail-icon" aria-hidden>
          <path
            fill="currentColor"
            d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
          />
        </svg>
      );
    case "location":
      return (
        <svg viewBox="0 0 24 24" className="contact-detail-icon" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
          />
        </svg>
      );
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function buildWhatsAppMessage(name: string, email: string, message: string) {
  return [
    "Hello Soulara Healing Academy,",
    "",
    "I'd like to get in touch:",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export function ContactSection({ contact }: { contact: ContactSectionInfo }) {
  const reduceMotion = useReducedMotion();
  const [state, formAction, pending] = useActionState(submitContactFormAction, initialFormState);
  const [clientError, setClientError] = useState<string | null>(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const whatsappDigits = normalizeWhatsAppNumber(contact.whatsapp);
  const phoneHref = contact.phone.replace(/[^\d+]/g, "");
  const showSuccess = state.ok || whatsappOpened;

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  const sendViaWhatsApp = () => {
    setClientError(null);
    const form = formRef.current;
    if (!form) return;

    if (!form.reportValidity()) return;

    if (!whatsappDigits) {
      setClientError("WhatsApp is not configured yet. Please use email instead.");
      return;
    }

    const data = new FormData(form);
    const name = data.get("name")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const message = data.get("message")?.toString().trim() ?? "";

    const text = buildWhatsAppMessage(name, email, message);
    const href = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(text)}`;
    window.open(href, "_blank", "noopener,noreferrer");
    setWhatsappOpened(true);
    form.reset();
  };

  return (
    <section id="contact" className="contact-section" aria-label="Contact Us">
      <div className="contact-section-aura" aria-hidden />
      <div className="contact-section-inner">
        <SectionReveal>
          <ChakraDivider />
          <p className="contact-eyebrow">Begin your journey</p>
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-lede">
            Reach out for sessions, courses, or quiet guidance — we respond with care.
          </p>
        </SectionReveal>

        <div className="contact-grid">
          <SectionReveal delay={0.08}>
            <div className="contact-details">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="contact-detail">
                  <span className="contact-detail-icon-wrap">
                    <ContactIcon kind="email" />
                  </span>
                  <span className="contact-detail-copy">
                    <span className="contact-detail-label">Email</span>
                    <span className="contact-detail-value">{contact.email}</span>
                  </span>
                </a>
              ) : null}

              {contact.phone ? (
                <a href={`tel:${phoneHref}`} className="contact-detail">
                  <span className="contact-detail-icon-wrap">
                    <ContactIcon kind="phone" />
                  </span>
                  <span className="contact-detail-copy">
                    <span className="contact-detail-label">Phone</span>
                    <span className="contact-detail-value">{contact.phone}</span>
                  </span>
                </a>
              ) : null}

              {contact.location ? (
                <div className="contact-detail">
                  <span className="contact-detail-icon-wrap">
                    <ContactIcon kind="location" />
                  </span>
                  <span className="contact-detail-copy">
                    <span className="contact-detail-label">Location</span>
                    <span className="contact-detail-value">{contact.location}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.16}>
            <div className="contact-form-panel">
              {showSuccess ? (
                <div className="contact-success" role="status">
                  <p className="contact-success-title">Thank you for reaching out</p>
                  <p className="contact-success-copy">
                    {state.ok
                      ? "Your email is on its way. We typically reply within 24 hours."
                      : "WhatsApp should open with your message ready to send. Tap send to complete."}
                  </p>
                  {whatsappOpened && !state.ok ? (
                    <button
                      type="button"
                      className="contact-success-reset"
                      onClick={() => setWhatsappOpened(false)}
                    >
                      Send another message
                    </button>
                  ) : null}
                </div>
              ) : (
                <form ref={formRef} action={formAction} className="contact-form">
                  <label className="contact-field">
                    <span>Your name</span>
                    <input name="name" required autoComplete="name" placeholder="Full name" />
                  </label>
                  <label className="contact-field">
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="contact-field">
                    <span>Message</span>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="How can we support your healing journey?"
                    />
                  </label>

                  {state.error || clientError ? (
                    <p className="contact-form-error" role="alert">
                      {clientError || state.error}
                    </p>
                  ) : null}

                  <p className="contact-send-hint">Choose how you’d like to send this message</p>

                  <div className="contact-submit-row">
                    <motion.button
                      type="submit"
                      className="contact-submit glow-btn-primary"
                      disabled={pending}
                      whileHover={reduceMotion || pending ? undefined : { scale: 1.02 }}
                      whileTap={reduceMotion || pending ? undefined : { scale: 0.98 }}
                    >
                      {!reduceMotion ? (
                        <span className="glow-btn-primary-glow pointer-events-none absolute inset-0 rounded-full blur-xl" />
                      ) : null}
                      <span className="relative">{pending ? "Sending…" : "Send Email"}</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      className="contact-submit contact-submit-whatsapp"
                      disabled={pending || !whatsappDigits}
                      onClick={sendViaWhatsApp}
                      whileHover={
                        reduceMotion || pending || !whatsappDigits ? undefined : { scale: 1.02 }
                      }
                      whileTap={
                        reduceMotion || pending || !whatsappDigits ? undefined : { scale: 0.98 }
                      }
                    >
                      <svg viewBox="0 0 24 24" className="contact-submit-whatsapp-icon" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-1.6-.7-3-2.4-3.5-3.6-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5 0-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.4 3.9 2.6 1.1 2.6.7 3.1.7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1 0-.3-.1-.6-.2zM12.1 21c-1.6 0-3.1-.4-4.5-1.2L4 21l1.2-3.5C4.3 16 3.8 14.3 3.8 12.5 3.8 7.9 7.5 4.2 12.1 4.2s8.3 3.7 8.3 8.3-3.7 8.5-8.3 8.5zm0-15.1c-3.7 0-6.6 3-6.6 6.6 0 1.5.5 2.9 1.4 4.1l-.9 2.7 2.8-.9c1.1.7 2.3 1.1 3.5 1.1 3.7 0 6.6-3 6.6-6.6s-3-7-6.8-7z"
                        />
                      </svg>
                      <span>Send WhatsApp</span>
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
