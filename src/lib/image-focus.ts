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
