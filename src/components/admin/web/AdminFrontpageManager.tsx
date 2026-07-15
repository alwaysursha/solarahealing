"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useTransition } from "react";
import { AdminMediaUploader } from "@/components/admin/AdminMediaUploader";
import { AdminPanel } from "@/components/admin/AdminShell";
import {
  saveAboutContentAction,
  saveAboutQuoteAction,
  saveHeroSlidesAction,
  saveSiteMenuAction,
} from "@/lib/admin/frontpage-actions";
import {
  DEFAULT_QUOTE_LABEL,
  NAV_ICON_OPTIONS,
  defaultHeroButtons,
  type AboutContent,
  type HeroSlide,
  type HeroSlideButton,
  type SiteNavItem,
} from "@/lib/frontpage-content";

function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const AdminRichTextEditor = dynamic(
  () =>
    import("@/components/admin/AdminRichTextEditor").then((mod) => mod.AdminRichTextEditor),
  {
    ssr: false,
    loading: () => <div className="min-h-[280px] rounded-xl bg-[var(--admin-input-bg)]" />,
  },
);

type Pane = "menu" | "hero" | "quote" | "about";

const PANES: { id: Pane; label: string; blurb: string }[] = [
  { id: "menu", label: "Site Menu", blurb: "Add, edit, reorder header navigation." },
  { id: "hero", label: "Hero Section", blurb: "Slides, buttons, and live preview." },
  { id: "quote", label: "Quote Section", blurb: "Healing begins from within box." },
  { id: "about", label: "About Us", blurb: "Rich text and About image." },
];

type AdminFrontpageManagerProps = {
  initialNav: SiteNavItem[];
  initialHero: HeroSlide[];
  initialAbout: AboutContent;
  ctaLabel: string;
};

function fieldClass() {
  return "admin-field-input mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none";
}

function SaveBar({
  pending,
  saved,
  onSave,
  label = "Save changes",
}: {
  pending: boolean;
  saved: boolean;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={onSave}
        className="admin-submit rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Saving…" : label}
      </button>
      {saved ? <p className="text-sm text-emerald-600">Saved. Live site will refresh shortly.</p> : null}
    </div>
  );
}

function HeroPreview({ slide }: { slide: HeroSlide }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-gradient-to-br from-[#f7f4fc] via-white to-[#f4eef8]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative min-h-[220px] bg-purple-deep/10">
          {slide.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.image}
              alt={slide.imageAlt || ""}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: slide.imagePosition || "50% 50%" }}
            />
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-[var(--admin-text-muted)]">
              Upload a hero image
            </div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">{slide.eyebrowSub}</p>
          <h3 className="font-serif text-2xl text-purple-deep">
            {slide.title} <span className="text-gold">{slide.titleAccent}</span>
          </h3>
          <p className="text-sm leading-relaxed text-purple-deep/65">{slide.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {slide.buttons.map((button) => (
              <span
                key={button.id}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  button.style === "primary"
                    ? "bg-purple-deep text-cream"
                    : "border border-purple-deep/20 text-purple-deep",
                ].join(" ")}
              >
                {button.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminFrontpageManager({
  initialNav,
  initialHero,
  initialAbout,
  ctaLabel,
}: AdminFrontpageManagerProps) {
  const [pane, setPane] = useState<Pane>("menu");
  const [nav, setNav] = useState(initialNav);
  const [slides, setSlides] = useState(initialHero);
  const [activeSlideId, setActiveSlideId] = useState(initialHero[0]?.id ?? "");
  const [quote, setQuote] = useState(initialAbout.quote);
  const [quoteLabel, setQuoteLabel] = useState(initialAbout.quoteLabel || DEFAULT_QUOTE_LABEL);
  const [bodyHtml, setBodyHtml] = useState(initialAbout.bodyHtml);
  const [aboutImage, setAboutImage] = useState(initialAbout.image ?? "");
  const [aboutImageAlt, setAboutImageAlt] = useState(initialAbout.imageAlt ?? "");
  const [savedPane, setSavedPane] = useState<Pane | null>(null);
  const [pending, startTransition] = useTransition();

  const activeSlide = useMemo(
    () => slides.find((slide) => slide.id === activeSlideId) ?? slides[0],
    [activeSlideId, slides],
  );

  const updateSlide = (id: string, patch: Partial<HeroSlide>) => {
    setSlides((current) => current.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)));
  };

  const updateButtons = (id: string, buttons: HeroSlideButton[]) => {
    updateSlide(id, { buttons });
  };

  const markSaved = (current: Pane) => {
    setSavedPane(current);
    window.setTimeout(() => setSavedPane((value) => (value === current ? null : value)), 2500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="admin-panel h-fit rounded-2xl p-3 shadow-sm">
        <p className="px-3 pb-2 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text-muted)]">
          Frontpage
        </p>
        <nav className="space-y-1">
          {PANES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPane(item.id)}
              className={[
                "w-full rounded-xl px-3 py-3 text-left transition",
                pane === item.id
                  ? "bg-[var(--admin-submit-bg)] text-[var(--admin-submit-text)]"
                  : "hover:bg-[var(--admin-input-bg)]",
              ].join(" ")}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span
                className={[
                  "mt-1 block text-xs",
                  pane === item.id ? "opacity-80" : "text-[var(--admin-text-muted)]",
                ].join(" ")}
              >
                {item.blurb}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="space-y-6">
        {pane === "menu" ? (
          <AdminPanel title="Site Menu">
            <p className="mb-5 text-sm text-[var(--admin-text-muted)]">
              These links appear in the website header on desktop and mobile.
            </p>
            <div className="space-y-4">
              {nav.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-2xl border border-[var(--admin-border)] p-4 md:grid-cols-[1fr_1fr_160px_auto]"
                >
                  <label className="admin-field text-sm">
                    <span className="admin-field-label font-medium">Label</span>
                    <input
                      className={fieldClass()}
                      value={item.label}
                      onChange={(event) =>
                        setNav((current) =>
                          current.map((row) =>
                            row.id === item.id ? { ...row, label: event.target.value } : row,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="admin-field text-sm">
                    <span className="admin-field-label font-medium">Link</span>
                    <input
                      className={fieldClass()}
                      value={item.href}
                      onChange={(event) =>
                        setNav((current) =>
                          current.map((row) =>
                            row.id === item.id ? { ...row, href: event.target.value } : row,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className="admin-field text-sm">
                    <span className="admin-field-label font-medium">Icon</span>
                    <select
                      className={fieldClass()}
                      value={item.icon}
                      onChange={(event) =>
                        setNav((current) =>
                          current.map((row) =>
                            row.id === item.id
                              ? { ...row, icon: event.target.value as SiteNavItem["icon"] }
                              : row,
                          ),
                        )
                      }
                    >
                      {NAV_ICON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[var(--admin-border)] px-3 py-2 text-xs"
                      disabled={index === 0}
                      onClick={() =>
                        setNav((current) => {
                          if (index === 0) return current;
                          const next = [...current];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          return next;
                        })
                      }
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[var(--admin-border)] px-3 py-2 text-xs"
                      disabled={index === nav.length - 1}
                      onClick={() =>
                        setNav((current) => {
                          if (index >= current.length - 1) return current;
                          const next = [...current];
                          [next[index + 1], next[index]] = [next[index], next[index + 1]];
                          return next;
                        })
                      }
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-red-300 px-3 py-2 text-xs text-red-600"
                      onClick={() => setNav((current) => current.filter((row) => row.id !== item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full border border-[var(--admin-border)] px-4 py-2 text-sm"
                onClick={() =>
                  setNav((current) => [
                    ...current,
                    {
                      id: createClientId(),
                      label: "NEW LINK",
                      href: "#",
                      icon: "reiki",
                    },
                  ])
                }
              >
                Add menu item
              </button>
              <SaveBar
                pending={pending}
                saved={savedPane === "menu"}
                onSave={() =>
                  startTransition(async () => {
                    await saveSiteMenuAction(nav);
                    markSaved("menu");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "hero" && activeSlide ? (
          <>
            <AdminPanel title="Live preview">
              <HeroPreview slide={activeSlide} />
            </AdminPanel>

            <AdminPanel title="Hero slides">
              <div className="mb-5 flex flex-wrap gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideId(slide.id)}
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-semibold",
                      slide.id === activeSlide.id
                        ? "bg-[var(--admin-submit-bg)] text-[var(--admin-submit-text)]"
                        : "border border-[var(--admin-border)]",
                    ].join(" ")}
                  >
                    Slide {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="rounded-full border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold"
                  onClick={() => {
                    const id = createClientId();
                    const next: HeroSlide = {
                      id,
                      variant: "photo",
                      image: "",
                      imageAlt: "",
                      imagePosition: "50% 50%",
                      eyebrow: "",
                      eyebrowSub: "New slide",
                      title: "New",
                      titleAccent: "Headline",
                      description: "Describe this slide for visitors.",
                      buttons: defaultHeroButtons(ctaLabel),
                    };
                    setSlides((current) => [...current, next]);
                    setActiveSlideId(id);
                  }}
                >
                  + Add slide
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Eyebrow</span>
                  <input
                    className={fieldClass()}
                    value={activeSlide.eyebrowSub}
                    onChange={(event) => updateSlide(activeSlide.id, { eyebrowSub: event.target.value })}
                  />
                </label>
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Variant</span>
                  <select
                    className={fieldClass()}
                    value={activeSlide.variant}
                    onChange={(event) =>
                      updateSlide(activeSlide.id, {
                        variant: event.target.value === "illustrated" ? "illustrated" : "photo",
                      })
                    }
                  >
                    <option value="photo">Photo</option>
                    <option value="illustrated">Illustrated</option>
                  </select>
                </label>
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Title</span>
                  <input
                    className={fieldClass()}
                    value={activeSlide.title}
                    onChange={(event) => updateSlide(activeSlide.id, { title: event.target.value })}
                  />
                </label>
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Title accent</span>
                  <input
                    className={fieldClass()}
                    value={activeSlide.titleAccent}
                    onChange={(event) => updateSlide(activeSlide.id, { titleAccent: event.target.value })}
                  />
                </label>
                <label className="admin-field text-sm lg:col-span-2">
                  <span className="admin-field-label font-medium">Description</span>
                  <textarea
                    className={fieldClass()}
                    rows={3}
                    value={activeSlide.description}
                    onChange={(event) => updateSlide(activeSlide.id, { description: event.target.value })}
                  />
                </label>
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Image alt</span>
                  <input
                    className={fieldClass()}
                    value={activeSlide.imageAlt}
                    onChange={(event) => updateSlide(activeSlide.id, { imageAlt: event.target.value })}
                  />
                </label>
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Focus position</span>
                  <input
                    className={fieldClass()}
                    value={activeSlide.imagePosition || "50% 50%"}
                    onChange={(event) => updateSlide(activeSlide.id, { imagePosition: event.target.value })}
                    placeholder="50% 40%"
                  />
                </label>
              </div>

              <div className="mt-5">
                <AdminMediaUploader
                  label="Hero image"
                  folder="hero"
                  value={activeSlide.image}
                  onChange={(url) => updateSlide(activeSlide.id, { image: url })}
                />
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-medium text-[var(--admin-text)]">Buttons</h4>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--admin-border)] px-3 py-1.5 text-xs"
                    onClick={() =>
                      updateButtons(activeSlide.id, [
                        ...activeSlide.buttons,
                        {
                          id: createClientId(),
                          label: "New button",
                          href: "#",
                          style: activeSlide.buttons.some((b) => b.style === "primary")
                            ? "secondary"
                            : "primary",
                        },
                      ])
                    }
                  >
                    Add button
                  </button>
                </div>
                {activeSlide.buttons.map((button) => (
                  <div
                    key={button.id}
                    className="grid gap-3 rounded-2xl border border-[var(--admin-border)] p-4 md:grid-cols-[1fr_1fr_140px_auto]"
                  >
                    <label className="admin-field text-sm">
                      <span className="admin-field-label font-medium">Label</span>
                      <input
                        className={fieldClass()}
                        value={button.label}
                        onChange={(event) =>
                          updateButtons(
                            activeSlide.id,
                            activeSlide.buttons.map((row) =>
                              row.id === button.id ? { ...row, label: event.target.value } : row,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field text-sm">
                      <span className="admin-field-label font-medium">Link</span>
                      <input
                        className={fieldClass()}
                        value={button.href}
                        onChange={(event) =>
                          updateButtons(
                            activeSlide.id,
                            activeSlide.buttons.map((row) =>
                              row.id === button.id ? { ...row, href: event.target.value } : row,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="admin-field text-sm">
                      <span className="admin-field-label font-medium">Style</span>
                      <select
                        className={fieldClass()}
                        value={button.style}
                        onChange={(event) =>
                          updateButtons(
                            activeSlide.id,
                            activeSlide.buttons.map((row) =>
                              row.id === button.id
                                ? {
                                    ...row,
                                    style: event.target.value === "secondary" ? "secondary" : "primary",
                                  }
                                : row,
                            ),
                          )
                        }
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </label>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className="rounded-full border border-red-300 px-3 py-2 text-xs text-red-600"
                        onClick={() =>
                          updateButtons(
                            activeSlide.id,
                            activeSlide.buttons.filter((row) => row.id !== button.id),
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-600"
                  disabled={slides.length <= 1}
                  onClick={() => {
                    const next = slides.filter((slide) => slide.id !== activeSlide.id);
                    setSlides(next);
                    setActiveSlideId(next[0]?.id ?? "");
                  }}
                >
                  Delete this slide
                </button>
                <SaveBar
                  pending={pending}
                  saved={savedPane === "hero"}
                  label="Save hero section"
                  onSave={() =>
                    startTransition(async () => {
                      await saveHeroSlidesAction(slides);
                      markSaved("hero");
                    })
                  }
                />
              </div>
            </AdminPanel>
          </>
        ) : null}

        {pane === "quote" ? (
          <AdminPanel title="Quote Section">
            <p className="mb-5 text-sm text-[var(--admin-text-muted)]">
              Linked to the About section box: “Healing begins from within” / heart of our practice.
            </p>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-5">
                <label className="admin-field block text-sm">
                  <span className="admin-field-label font-medium">Quote</span>
                  <textarea
                    className={fieldClass()}
                    rows={4}
                    value={quote}
                    onChange={(event) => setQuote(event.target.value)}
                  />
                </label>
                <label className="admin-field block text-sm">
                  <span className="admin-field-label font-medium">Label under quote</span>
                  <input
                    className={fieldClass()}
                    value={quoteLabel}
                    onChange={(event) => setQuoteLabel(event.target.value)}
                  />
                </label>
              </div>
              <div className="about-quote-shadow rounded-xl bg-white/70 p-4">
                <blockquote className="border-l-2 border-purple-mid/55 pl-3.5">
                  <p className="font-serif text-xl text-purple-deep">{quote}</p>
                  <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-purple-deep">
                    {quoteLabel}
                  </p>
                </blockquote>
              </div>
            </div>
            <div className="mt-6 border-t border-[var(--admin-border)] pt-5">
              <SaveBar
                pending={pending}
                saved={savedPane === "quote"}
                onSave={() =>
                  startTransition(async () => {
                    await saveAboutQuoteAction({ quote, quoteLabel });
                    markSaved("quote");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "about" ? (
          <AdminPanel title="About Us">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="space-y-4">
                <AdminRichTextEditor value={bodyHtml} onChange={setBodyHtml} />
                <SaveBar
                  pending={pending}
                  saved={savedPane === "about"}
                  label="Save About Us"
                  onSave={() =>
                    startTransition(async () => {
                      await saveAboutContentAction({
                        bodyHtml,
                        image: aboutImage,
                        imageAlt: aboutImageAlt,
                      });
                      markSaved("about");
                    })
                  }
                />
              </div>
              <div className="space-y-4">
                <AdminMediaUploader
                  label="About image"
                  folder="about"
                  value={aboutImage}
                  onChange={setAboutImage}
                />
                <label className="admin-field text-sm">
                  <span className="admin-field-label font-medium">Image alt text</span>
                  <input
                    className={fieldClass()}
                    value={aboutImageAlt}
                    onChange={(event) => setAboutImageAlt(event.target.value)}
                  />
                </label>
                <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-input-bg)] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--admin-text-muted)]">
                    Preview
                  </p>
                  <div
                    className="prose prose-sm max-w-none text-[var(--admin-text)]"
                    dangerouslySetInnerHTML={{ __html: bodyHtml }}
                  />
                </div>
              </div>
            </div>
          </AdminPanel>
        ) : null}
      </div>
    </div>
  );
}
