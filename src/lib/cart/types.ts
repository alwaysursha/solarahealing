export type CartItemType = "course" | "workshop" | "private_session";

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

const cartTypeRank: Record<CartItemType, number> = {
  workshop: 0,
  private_session: 1,
  course: 2,
};

export function sortCartItemsWorkshopsFirst(items: CartItem[]): CartItem[] {
  return [...items].sort((a, b) => {
    const rankDiff = cartTypeRank[a.type] - cartTypeRank[b.type];
    if (rankDiff !== 0) return rankDiff;
    return 0;
  });
}

export function cartTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotalCad(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCad * item.quantity, 0);
}

export function cartTypeLabel(type: CartItemType): string {
  switch (type) {
    case "workshop":
      return "Workshop";
    case "private_session":
      return "Private session";
    case "course":
      return "Course";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}
