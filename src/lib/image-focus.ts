export function clampImageFocus(value: number) {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function parseImageFocusValue(value: FormDataEntryValue | null | undefined, fallback = 50) {
  const parsed = Number(value ?? fallback);
  return clampImageFocus(Number.isFinite(parsed) ? parsed : fallback);
}

export function toImageObjectPosition(focusX = 50, focusY = 50) {
  return `${clampImageFocus(focusX)}% ${clampImageFocus(focusY)}%`;
}

function parsePositionToken(token: string | undefined, fallback: number) {
  if (!token) return fallback;
  const value = token.trim().toLowerCase();
  if (value === "center") return 50;
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return 100;
  if (value.endsWith("%")) {
    const parsed = Number(value.slice(0, -1));
    return Number.isFinite(parsed) ? clampImageFocus(parsed) : fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clampImageFocus(parsed) : fallback;
}

/** Parse CSS object-position values like `72% 40%` or `right center`. */
export function parseImageObjectPosition(value?: string | null): { x: number; y: number } {
  if (!value?.trim()) {
    return { x: 50, y: 50 };
  }

  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const only = parsePositionToken(parts[0], 50);
    return { x: only, y: 50 };
  }

  return {
    x: parsePositionToken(parts[0], 50),
    y: parsePositionToken(parts[1], 50),
  };
}
