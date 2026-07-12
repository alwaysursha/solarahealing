import {
  CART_STORAGE_KEY,
  type CartItem,
  type CartItemType,
} from "@/lib/cart/types";

function isCartItemType(value: unknown): value is CartItemType {
  return value === "course" || value === "workshop";
}

function normalizeItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  if (typeof item.id !== "string" || !item.id) return null;
  if (!isCartItemType(item.type)) return null;
  if (typeof item.title !== "string" || !item.title) return null;
  if (typeof item.priceCad !== "number" || !Number.isFinite(item.priceCad)) return null;
  const quantity = typeof item.quantity === "number" && item.quantity > 0 ? Math.floor(item.quantity) : 1;
  const image = typeof item.image === "string" ? item.image : undefined;
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    priceCad: item.priceCad,
    image,
    quantity,
  };
}

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota / private mode failures.
  }
}
