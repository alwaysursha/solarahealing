/** Clamp a discount percent to a whole number between 0 and 100. */
export function clampDiscountPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Regular list price with an optional percent-off applied (whole CAD dollars). */
export function effectivePriceCad(priceCad: number, discountPercent: number): number {
  const price = Math.max(0, Math.round(priceCad));
  const discount = clampDiscountPercent(discountPercent);
  if (discount <= 0) return price;
  if (discount >= 100) return 0;
  return Math.round((price * (100 - discount)) / 100);
}

/** Format whole CAD dollars for slide cards (e.g. "$200", "Free"). */
export function formatSlidePrice(priceCad: number): string {
  if (priceCad <= 0) return "Free";
  return `$${priceCad}`;
}

/** Apply a percent discount to a slide price string like "$200" or "Free". */
export function discountedSlidePrice(price: string, discountPercent: number): string | null {
  const trimmed = price.trim();
  if (/^free$/i.test(trimmed)) return null;
  const amount = Number(trimmed.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(amount)) return null;
  const discount = clampDiscountPercent(discountPercent);
  if (discount <= 0) return null;
  return formatSlidePrice(effectivePriceCad(amount, discount));
}
