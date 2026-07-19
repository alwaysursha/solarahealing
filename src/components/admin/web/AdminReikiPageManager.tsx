"use client";

import { useState, useTransition } from "react";
import { AdminCatalogImageField } from "@/components/admin/AdminCatalogImageField";
import { AdminPanel } from "@/components/admin/AdminShell";
import {
  saveReikiBenefitsAction,
  saveReikiChakrasAction,
  saveReikiCloseAction,
  saveReikiFaqAction,
  saveReikiHeroAction,
  saveReikiIntroAction,
  saveReikiPathwaysAction,
} from "@/lib/admin/reiki-actions";
import {
  REIKI_BENEFIT_TAB_IDS,
  type ReikiBenefitTab,
  type ReikiBenefitTabId,
  type ReikiFaqItem,
  type ReikiPageContent,
} from "@/lib/reiki-page";

type Pane = "hero" | "intro" | "benefits" | "chakras" | "pathways" | "faq" | "close";

const PANES: { id: Pane; label: string; blurb: string }[] = [
  { id: "hero", label: "Hero", blurb: "Brand line, headline, CTAs, and image." },
  { id: "intro", label: "What is Reiki", blurb: "Heading, image, and body paragraphs." },
  { id: "benefits", label: "Benefits", blurb: "Mind, Body, and Soul bullet lists." },
  { id: "chakras", label: "Chakras", blurb: "Energy centers section copy." },
  { id: "pathways", label: "Pathways", blurb: "Session and courses cards." },
  { id: "faq", label: "FAQs", blurb: "Questions and answers accordion." },
  { id: "close", label: "Closing CTA", blurb: "Final headline and button." },
];

function createFaqId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `faq-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `faq-${Date.now()}`;
}

function fieldClass() {
  return "admin-field-input mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none";
}

function labelClass() {
  return "admin-field-label text-sm font-medium";
}

function SaveBar({
  pending,
  saved,
  onSave,
}: {
  pending: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={onSave}
        className="admin-submit rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
      {saved ? <p className="text-sm text-emerald-600">Saved. Live site will refresh shortly.</p> : null}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className={labelClass()}>{label}</span>
      {multiline ? (
        <textarea
          className={fieldClass()}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={fieldClass()}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

type AdminReikiPageManagerProps = {
  initialContent: ReikiPageContent;
};

export function AdminReikiPageManager({ initialContent }: AdminReikiPageManagerProps) {
  const [pane, setPane] = useState<Pane>("hero");
  const [hero, setHero] = useState(initialContent.hero);
  const [intro, setIntro] = useState(initialContent.intro);
  const [benefits, setBenefits] = useState(initialContent.benefits);
  const [chakras, setChakras] = useState(initialContent.chakras);
  const [pathways, setPathways] = useState(initialContent.pathways);
  const [faq, setFaq] = useState(initialContent.faq);
  const [close, setClose] = useState(initialContent.close);
  const [activeTabId, setActiveTabId] = useState<ReikiBenefitTabId>("mind");
  const [savedPane, setSavedPane] = useState<Pane | null>(null);
  const [pending, startTransition] = useTransition();

  const markSaved = (current: Pane) => {
    setSavedPane(current);
    window.setTimeout(() => setSavedPane((value) => (value === current ? null : value)), 2500);
  };

  const activeTab =
    benefits.tabs.find((tab) => tab.id === activeTabId) ?? benefits.tabs[0];

  const updateTab = (id: ReikiBenefitTabId, patch: Partial<ReikiBenefitTab>) => {
    setBenefits((current) => ({
      ...current,
      tabs: current.tabs.map((tab) => (tab.id === id ? { ...tab, ...patch } : tab)),
    }));
  };

  const updateTabItem = (id: ReikiBenefitTabId, index: number, value: string) => {
    setBenefits((current) => ({
      ...current,
      tabs: current.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        const items = [...tab.items];
        items[index] = value;
        return { ...tab, items };
      }),
    }));
  };

  const addTabItem = (id: ReikiBenefitTabId) => {
    setBenefits((current) => ({
      ...current,
      tabs: current.tabs.map((tab) =>
        tab.id === id ? { ...tab, items: [...tab.items, ""] } : tab,
      ),
    }));
  };

  const removeTabItem = (id: ReikiBenefitTabId, index: number) => {
    setBenefits((current) => ({
      ...current,
      tabs: current.tabs.map((tab) => {
        if (tab.id !== id) return tab;
        const items = tab.items.filter((_, i) => i !== index);
        return { ...tab, items: items.length > 0 ? items : [""] };
      }),
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="admin-panel h-fit rounded-2xl p-3 shadow-sm">
        <p className="px-3 pb-2 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text-muted)]">
          Reiki page
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
        {pane === "hero" ? (
          <AdminPanel title="Hero">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Eyebrow / brand line"
                value={hero.eyebrow}
                onChange={(value) => setHero((current) => ({ ...current, eyebrow: value }))}
              />
              <TextField
                label="Title"
                value={hero.title}
                onChange={(value) => setHero((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={hero.titleAccent}
                onChange={(value) => setHero((current) => ({ ...current, titleAccent: value }))}
              />
              <TextField
                label="Image alt text"
                value={hero.imageAlt}
                onChange={(value) => setHero((current) => ({ ...current, imageAlt: value }))}
              />
            </div>
            <div className="mt-4">
              <TextField
                label="Description"
                value={hero.description}
                onChange={(value) => setHero((current) => ({ ...current, description: value }))}
                multiline
                rows={3}
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TextField
                label="Primary CTA label"
                value={hero.primaryCta.label}
                onChange={(value) =>
                  setHero((current) => ({
                    ...current,
                    primaryCta: { ...current.primaryCta, label: value },
                  }))
                }
              />
              <TextField
                label="Primary CTA link"
                value={hero.primaryCta.href}
                onChange={(value) =>
                  setHero((current) => ({
                    ...current,
                    primaryCta: { ...current.primaryCta, href: value },
                  }))
                }
              />
              <TextField
                label="Secondary CTA label"
                value={hero.secondaryCta.label}
                onChange={(value) =>
                  setHero((current) => ({
                    ...current,
                    secondaryCta: { ...current.secondaryCta, label: value },
                  }))
                }
              />
              <TextField
                label="Secondary CTA link"
                value={hero.secondaryCta.href}
                onChange={(value) =>
                  setHero((current) => ({
                    ...current,
                    secondaryCta: { ...current.secondaryCta, href: value },
                  }))
                }
              />
            </div>
            <div className="mt-5">
              <AdminCatalogImageField
                label="Hero image"
                folder="hero"
                aspect="21:9"
                value={hero.image}
                onChange={(url) => setHero((current) => ({ ...current, image: url }))}
                showAltField={false}
                includeFocusHiddenInputs={false}
              />
            </div>
            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "hero"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiHeroAction(hero);
                    markSaved("hero");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "intro" ? (
          <AdminPanel title="What is Reiki">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={intro.eyebrow}
                onChange={(value) => setIntro((current) => ({ ...current, eyebrow: value }))}
              />
              <TextField
                label="Visual caption"
                value={intro.visualCaption}
                onChange={(value) => setIntro((current) => ({ ...current, visualCaption: value }))}
              />
              <TextField
                label="Title"
                value={intro.title}
                onChange={(value) => setIntro((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={intro.titleAccent}
                onChange={(value) => setIntro((current) => ({ ...current, titleAccent: value }))}
              />
            </div>
            <div className="mt-5">
              <AdminCatalogImageField
                label="Section image"
                folder="about"
                aspect="4:3"
                value={intro.image}
                altValue={intro.imageAlt}
                onChange={(url) => setIntro((current) => ({ ...current, image: url }))}
                onAltChange={(imageAlt) => setIntro((current) => ({ ...current, imageAlt }))}
                includeFocusHiddenInputs={false}
              />
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className={labelClass()}>Paragraphs</p>
                <button
                  type="button"
                  className="rounded-full border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold"
                  onClick={() =>
                    setIntro((current) => ({
                      ...current,
                      paragraphs: [...current.paragraphs, ""],
                    }))
                  }
                >
                  Add paragraph
                </button>
              </div>
              {intro.paragraphs.map((paragraph, index) => (
                <div key={`intro-p-${index}`} className="rounded-xl border border-[var(--admin-border)] p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                      Paragraph {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() =>
                        setIntro((current) => ({
                          ...current,
                          paragraphs:
                            current.paragraphs.length > 1
                              ? current.paragraphs.filter((_, i) => i !== index)
                              : [""],
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    className={fieldClass()}
                    rows={4}
                    value={paragraph}
                    onChange={(event) =>
                      setIntro((current) => {
                        const paragraphs = [...current.paragraphs];
                        paragraphs[index] = event.target.value;
                        return { ...current, paragraphs };
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "intro"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiIntroAction(intro);
                    markSaved("intro");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "benefits" ? (
          <AdminPanel title="Benefits">
            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Eyebrow"
                value={benefits.eyebrow}
                onChange={(value) => setBenefits((current) => ({ ...current, eyebrow: value }))}
              />
              <TextField
                label="Title"
                value={benefits.title}
                onChange={(value) => setBenefits((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={benefits.titleAccent}
                onChange={(value) => setBenefits((current) => ({ ...current, titleAccent: value }))}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {REIKI_BENEFIT_TAB_IDS.map((id) => {
                const tab = benefits.tabs.find((item) => item.id === id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTabId(id)}
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      activeTabId === id
                        ? "bg-[var(--admin-submit-bg)] text-[var(--admin-submit-text)]"
                        : "border border-[var(--admin-border)]",
                    ].join(" ")}
                  >
                    {tab?.label ?? id}
                  </button>
                );
              })}
            </div>

            {activeTab ? (
              <div className="mt-4 space-y-4 rounded-2xl border border-[var(--admin-border)] p-4">
                <TextField
                  label="Tab label"
                  value={activeTab.label}
                  onChange={(value) => updateTab(activeTab.id, { label: value })}
                />
                <div className="flex items-center justify-between gap-3">
                  <p className={labelClass()}>Bullet points</p>
                  <button
                    type="button"
                    className="rounded-full border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold"
                    onClick={() => addTabItem(activeTab.id)}
                  >
                    Add bullet
                  </button>
                </div>
                {activeTab.items.map((item, index) => (
                  <div key={`${activeTab.id}-${index}`} className="flex gap-2">
                    <textarea
                      className={fieldClass()}
                      rows={2}
                      value={item}
                      onChange={(event) => updateTabItem(activeTab.id, index, event.target.value)}
                    />
                    <button
                      type="button"
                      className="shrink-0 self-start rounded-full px-3 py-2 text-xs font-semibold text-red-600"
                      onClick={() => removeTabItem(activeTab.id, index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "benefits"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiBenefitsAction(benefits);
                    markSaved("benefits");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "chakras" ? (
          <AdminPanel title="Chakras">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={chakras.eyebrow}
                onChange={(value) => setChakras((current) => ({ ...current, eyebrow: value }))}
              />
              <TextField
                label="Title"
                value={chakras.title}
                onChange={(value) => setChakras((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={chakras.titleAccent}
                onChange={(value) => setChakras((current) => ({ ...current, titleAccent: value }))}
              />
            </div>
            <div className="mt-4">
              <TextField
                label="Description"
                value={chakras.description}
                onChange={(value) => setChakras((current) => ({ ...current, description: value }))}
                multiline
                rows={4}
              />
            </div>
            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "chakras"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiChakrasAction(chakras);
                    markSaved("chakras");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "pathways" ? (
          <AdminPanel title="Pathways">
            <div className="grid gap-4 md:grid-cols-3">
              <TextField
                label="Eyebrow"
                value={pathways.eyebrow}
                onChange={(value) => setPathways((current) => ({ ...current, eyebrow: value }))}
              />
              <TextField
                label="Title"
                value={pathways.title}
                onChange={(value) => setPathways((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={pathways.titleAccent}
                onChange={(value) => setPathways((current) => ({ ...current, titleAccent: value }))}
              />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] p-4">
                <p className="text-sm font-semibold">Private session card</p>
                <TextField
                  label="Title"
                  value={pathways.session.title}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      session: { ...current.session, title: value },
                    }))
                  }
                />
                <TextField
                  label="Copy"
                  value={pathways.session.copy}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      session: { ...current.session, copy: value },
                    }))
                  }
                  multiline
                  rows={3}
                />
                <TextField
                  label="CTA label"
                  value={pathways.session.cta}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      session: { ...current.session, cta: value },
                    }))
                  }
                />
                <TextField
                  label="CTA link"
                  value={pathways.session.href}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      session: { ...current.session, href: value },
                    }))
                  }
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-[var(--admin-border)] p-4">
                <p className="text-sm font-semibold">Courses card</p>
                <TextField
                  label="Title"
                  value={pathways.courses.title}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      courses: { ...current.courses, title: value },
                    }))
                  }
                />
                <TextField
                  label="Copy"
                  value={pathways.courses.copy}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      courses: { ...current.courses, copy: value },
                    }))
                  }
                  multiline
                  rows={3}
                />
                <TextField
                  label="CTA label"
                  value={pathways.courses.cta}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      courses: { ...current.courses, cta: value },
                    }))
                  }
                />
                <TextField
                  label="CTA link"
                  value={pathways.courses.href}
                  onChange={(value) =>
                    setPathways((current) => ({
                      ...current,
                      courses: { ...current.courses, href: value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "pathways"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiPathwaysAction(pathways);
                    markSaved("pathways");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "faq" ? (
          <AdminPanel title="FAQs">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={faq.eyebrow}
                onChange={(value) => setFaq((current) => ({ ...current, eyebrow: value }))}
              />
              <TextField
                label="Title"
                value={faq.title}
                onChange={(value) => setFaq((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={faq.titleAccent}
                onChange={(value) => setFaq((current) => ({ ...current, titleAccent: value }))}
              />
            </div>
            <div className="mt-4">
              <TextField
                label="Description"
                value={faq.description}
                onChange={(value) => setFaq((current) => ({ ...current, description: value }))}
                multiline
                rows={2}
              />
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className={labelClass()}>Questions</p>
                <button
                  type="button"
                  className="rounded-full border border-[var(--admin-border)] px-3 py-1.5 text-xs font-semibold"
                  onClick={() =>
                    setFaq((current) => ({
                      ...current,
                      items: [
                        ...current.items,
                        { id: createFaqId(), question: "", answer: "" } satisfies ReikiFaqItem,
                      ],
                    }))
                  }
                >
                  Add question
                </button>
              </div>
              {faq.items.map((item, index) => (
                <div key={item.id} className="space-y-3 rounded-2xl border border-[var(--admin-border)] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-muted)]">
                      FAQ {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() =>
                        setFaq((current) => ({
                          ...current,
                          items:
                            current.items.length > 1
                              ? current.items.filter((entry) => entry.id !== item.id)
                              : [{ id: createFaqId(), question: "", answer: "" }],
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <TextField
                    label="Question"
                    value={item.question}
                    onChange={(value) =>
                      setFaq((current) => ({
                        ...current,
                        items: current.items.map((entry) =>
                          entry.id === item.id ? { ...entry, question: value } : entry,
                        ),
                      }))
                    }
                  />
                  <TextField
                    label="Answer"
                    value={item.answer}
                    onChange={(value) =>
                      setFaq((current) => ({
                        ...current,
                        items: current.items.map((entry) =>
                          entry.id === item.id ? { ...entry, answer: value } : entry,
                        ),
                      }))
                    }
                    multiline
                    rows={3}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "faq"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiFaqAction(faq);
                    markSaved("faq");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}

        {pane === "close" ? (
          <AdminPanel title="Closing CTA">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Title"
                value={close.title}
                onChange={(value) => setClose((current) => ({ ...current, title: value }))}
              />
              <TextField
                label="Title accent"
                value={close.titleAccent}
                onChange={(value) => setClose((current) => ({ ...current, titleAccent: value }))}
              />
              <TextField
                label="CTA label"
                value={close.cta.label}
                onChange={(value) =>
                  setClose((current) => ({
                    ...current,
                    cta: { ...current.cta, label: value },
                  }))
                }
              />
              <TextField
                label="CTA link"
                value={close.cta.href}
                onChange={(value) =>
                  setClose((current) => ({
                    ...current,
                    cta: { ...current.cta, href: value },
                  }))
                }
              />
            </div>
            <div className="mt-4">
              <TextField
                label="Description"
                value={close.description}
                onChange={(value) => setClose((current) => ({ ...current, description: value }))}
                multiline
                rows={3}
              />
            </div>
            <div className="mt-6">
              <SaveBar
                pending={pending}
                saved={savedPane === "close"}
                onSave={() =>
                  startTransition(async () => {
                    await saveReikiCloseAction(close);
                    markSaved("close");
                  })
                }
              />
            </div>
          </AdminPanel>
        ) : null}
      </div>
    </div>
  );
}
