export type CartItemType = "course" | "workshop";

export type CartItem = {
  id: string;
  type: CartItemType;
  title: string;
  priceCad: number;
  image?: string;
  quantity: number;
};

export type CartAddInput = {
  id: string;
  type: CartItemType;
  title: string;
  priceCad: number;
  image?: string;
  quantity?: number;
};

export const CART_STORAGE_KEY = "soulara-cart";
export const HEADER_CART_TARGET_ID = "header-cart-target";

export function cartLineKey(item: Pick<CartItem, "id" | "type">) {
  return `${item.type}:${item.id}`;
}

export function sortCartItemsWorkshopsFirst(items: CartItem[]): CartItem[] {
  return [...items].sort((a, b) => {
    if (a.type === b.type) return 0;
    return a.type === "workshop" ? -1 : 1;
  });
}

export function cartTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotalCad(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCad * item.quantity, 0);
}

export function cartTypeLabel(type: CartItemType): string {
  return type === "workshop" ? "Workshop" : "Course";
}
