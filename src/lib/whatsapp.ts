/** Digits only — suitable for wa.me links and storage. */
export function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/** E.164-style length without the leading +. */
export function isValidWhatsAppNumber(value: string): boolean {
  const digits = normalizeWhatsAppNumber(value);
  return digits.length >= 8 && digits.length <= 15;
}

export function formatWhatsAppDisplay(value: string): string {
  const digits = normalizeWhatsAppNumber(value);
  if (!digits) {
    return "";
  }
  return `+${digits}`;
}
