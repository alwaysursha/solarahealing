"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { createPortal, flushSync } from "react-dom";
import type { CourseMaterialDeck, CourseMaterialSlide } from "@/lib/admin/course-material";
import {
  captureElementToCanvas,
  coursePdfFilename,
  saveLandscapePdfFromCanvases,
} from "@/lib/admin/export-course-slides-pdf";

type PdfMode = "all" | "range";

type PanelCoords = {
  top: number;
  left: number;
};

type SlideViewProps = {
  slide: CourseMaterialSlide;
  brandLogo: CourseMaterialDeck["brandLogo"];
  showStartSession?: boolean;
  onStartSession?: () => void;
  reduceMotion: boolean;
  forPdf?: boolean;
};

export function CourseMaterialPdfExport({ deck }: { deck: CourseMaterialDeck }) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<PanelCoords | null>(null);
  const [mode, setMode] = useState<PdfMode>("all");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captureIndex, setCaptureIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [SlideView, setSlideView] = useState<ComponentType<SlideViewProps> | null>(null);

  const count = deck.slides.length;
  const title = deck.dayLabel ? `${deck.title} · ${deck.dayLabel}` : deck.title;
  const captureSlide = captureIndex !== null ? deck.slides[captureIndex] : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const ensureSlideView = useCallback(async () => {
    if (SlideView) return SlideView;
    const mod = await import("@/components/admin/course-material/CourseMaterialPresenter");
    setSlideView(() => mod.CourseMaterialSlideView);
    return mod.CourseMaterialSlideView;
  }, [SlideView]);

  const updateCoords = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelWidth = Math.min(296, window.innerWidth - 24);
    const left = Math.min(
      Math.max(12, rect.right - panelWidth),
      window.innerWidth - panelWidth - 12,
    );
    const top = Math.min(rect.bottom + 8, window.innerHeight - 12);

    setCoords({ top, left });
  }, []);

  const toggleOpen = useCallback(() => {
    setError(null);
    setFrom(1);
    setTo(count);
    setMode("all");
    setOpen((value) => !value);
  }, [count]);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updateCoords();
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;

    const onReposition = () => updateCoords();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      if (!busy) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [busy, open]);

  const downloadPdf = useCallback(async () => {
    if (busy) return;

    let start = 1;
    let end = count;
    if (mode === "range") {
      start = Math.min(from, to);
      end = Math.max(from, to);
      start = Math.max(1, Math.min(count, start));
      end = Math.max(1, Math.min(count, end));
    }

    const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
    const host = captureRef.current;
    if (!host) {
      setError("PDF capture surface is not ready. Refresh and try again.");
      return;
    }

    setBusy(true);
    setError(null);
    const canvases: HTMLCanvasElement[] = [];

    try {
      await ensureSlideView();

      for (let step = 0; step < indices.length; step += 1) {
        const slideIndex = indices[step]!;
        setProgress(`Exporting slide ${slideIndex + 1} of ${count}…`);
        flushSync(() => {
          setCaptureIndex(slideIndex);
        });

        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
          });
        });
        await new Promise((resolve) => window.setTimeout(resolve, 200));

        const target = host.querySelector(".cm-slide-for-pdf");
        if (!(target instanceof HTMLElement)) {
          throw new Error(`Could not render slide ${slideIndex + 1}.`);
        }

        if (target.offsetWidth < 100 || target.offsetHeight < 100) {
          throw new Error(
            `Slide ${slideIndex + 1} capture size was invalid (${target.offsetWidth}×${target.offsetHeight}).`,
          );
        }

        canvases.push(await captureElementToCanvas(target));
      }

      await saveLandscapePdfFromCanvases(canvases, coursePdfFilename(title, start, end));
      setOpen(false);
    } catch (err) {
      console.error("[course-material] PDF export failed", err);
      const detail = err instanceof Error ? err.message : "Unknown error";
      setError(`Could not generate PDF. ${detail}`);
    } finally {
      setCaptureIndex(null);
      setProgress(null);
      setBusy(false);
    }
  }, [busy, count, ensureSlideView, from, mode, title, to]);

  if (count === 0) return null;

  const panel =
    open && coords && mounted
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className="cm-list-pdf-panel"
            role="dialog"
            aria-label={`Save ${title} as PDF`}
            style={{ top: coords.top, left: coords.left }}
          >
            <p className="cm-list-pdf-title">Download slides</p>
            <label className="cm-list-pdf-option">
              <input
                type="radio"
                name={`${panelId}-mode`}
                checked={mode === "all"}
                onChange={() => setMode("all")}
                disabled={busy}
              />
              All slides (1–{count})
            </label>
            <label className="cm-list-pdf-option">
              <input
                type="radio"
                name={`${panelId}-mode`}
                checked={mode === "range"}
                onChange={() => setMode("range")}
                disabled={busy}
              />
              Slide range
            </label>
            <div className="cm-list-pdf-range">
              <label>
                From
                <input
                  type="number"
                  min={1}
                  max={count}
                  value={from}
                  disabled={busy || mode !== "range"}
                  onChange={(event) => setFrom(Number(event.target.value) || 1)}
                />
              </label>
              <label>
                To
                <input
                  type="number"
                  min={1}
                  max={count}
                  value={to}
                  disabled={busy || mode !== "range"}
                  onChange={(event) => setTo(Number(event.target.value) || 1)}
                />
              </label>
            </div>
            <button
              type="button"
              className="cm-list-pdf-download"
              onClick={() => void downloadPdf()}
              disabled={busy}
            >
              {busy ? progress ?? "Generating…" : "Download PDF"}
            </button>
            {error ? (
              <p className="cm-list-pdf-error" role="alert">
                {error}
              </p>
            ) : null}
          </div>,
          document.body,
        )
      : null;

  const captureHost = mounted
    ? createPortal(
        <div ref={captureRef} className="cm-pdf-capture-host" aria-hidden>
          {captureSlide && SlideView ? (
            <SlideView
              slide={captureSlide}
              brandLogo={deck.brandLogo}
              showStartSession={false}
              reduceMotion
              forPdf
            />
          ) : null}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="cm-list-pdf">
      <button
        ref={triggerRef}
        type="button"
        className="cm-list-pdf-trigger"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-controls={panelId}
        disabled={busy}
      >
        {busy ? "Saving PDF…" : "Save PDF"}
      </button>

      {panel}
      {captureHost}
    </div>
  );
}
