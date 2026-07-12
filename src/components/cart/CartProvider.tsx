"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { readCartFromStorage, writeCartToStorage } from "@/lib/cart/storage";
import {
  HEADER_CART_TARGET_ID,
  cartLineKey,
  cartTotalCad,
  cartTotalQuantity,
  type CartAddInput,
  type CartItem,
  type CartItemType,
} from "@/lib/cart/types";

export type FlyParticle = {
  id: string;
  from: { x: number; y: number; width: number; height: number };
  to: { x: number; y: number };
  image?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalCad: number;
  hydrated: boolean;
  addItem: (input: CartAddInput) => CartItem;
  removeItem: (id: string, type: CartItemType) => void;
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void;
  clear: () => void;
  flyParticle: FlyParticle | null;
  cartPulse: boolean;
  recentlyAdded: CartItem | null;
  beginAddFromElement: (input: CartAddInput, originEl: HTMLElement | null, reduceMotion: boolean) => void;
  completeFly: () => void;
  dismissAddedModal: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function upsertItem(items: CartItem[], input: CartAddInput): { next: CartItem[]; added: CartItem } {
  const qty = input.quantity && input.quantity > 0 ? Math.floor(input.quantity) : 1;
  const key = cartLineKey(input);
  const existing = items.find((item) => cartLineKey(item) === key);

  if (existing) {
    const added: CartItem = {
      ...existing,
      title: input.title,
      priceCad: input.priceCad,
      image: input.image ?? existing.image,
      quantity: existing.quantity + qty,
    };
    return {
      next: items.map((item) => (cartLineKey(item) === key ? added : item)),
      added,
    };
  }

  const added: CartItem = {
    id: input.id,
    type: input.type,
    title: input.title,
    priceCad: input.priceCad,
    image: input.image,
    quantity: qty,
  };
  return { next: [...items, added], added };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [flyParticle, setFlyParticle] = useState<FlyParticle | null>(null);
  const [cartPulse, setCartPulse] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<CartItem | null>(null);
  const pendingModalItemRef = useRef<CartItem | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setItems(readCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCartToStorage(items);
  }, [items, hydrated]);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  const triggerCartPulse = useCallback(() => {
    setCartPulse(true);
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setCartPulse(false), 520);
  }, []);

  const showAddedModal = useCallback(
    (item: CartItem) => {
      setRecentlyAdded(item);
      pendingModalItemRef.current = null;
      triggerCartPulse();
    },
    [triggerCartPulse],
  );

  const addItem = useCallback((input: CartAddInput) => {
    let added: CartItem = {
      id: input.id,
      type: input.type,
      title: input.title,
      priceCad: input.priceCad,
      image: input.image,
      quantity: input.quantity && input.quantity > 0 ? Math.floor(input.quantity) : 1,
    };
    setItems((current) => {
      const result = upsertItem(current, input);
      added = result.added;
      return result.next;
    });
    return added;
  }, []);

  const removeItem = useCallback((id: string, type: CartItemType) => {
    setItems((current) => current.filter((item) => !(item.id === id && item.type === type)));
  }, []);

  const updateQuantity = useCallback((id: string, type: CartItemType, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => !(item.id === id && item.type === type));
      }
      return current.map((item) =>
        item.id === id && item.type === type ? { ...item, quantity: Math.floor(quantity) } : item,
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const completeFly = useCallback(() => {
    setFlyParticle(null);
    const pending = pendingModalItemRef.current;
    if (pending) {
      showAddedModal(pending);
    }
  }, [showAddedModal]);

  const beginAddFromElement = useCallback(
    (input: CartAddInput, originEl: HTMLElement | null, reduceMotion: boolean) => {
      let added: CartItem = {
        id: input.id,
        type: input.type,
        title: input.title,
        priceCad: input.priceCad,
        image: input.image,
        quantity: 1,
      };

      setItems((current) => {
        const result = upsertItem(current, input);
        added = result.added;
        return result.next;
      });

      const target = document.getElementById(HEADER_CART_TARGET_ID);
      if (reduceMotion || !originEl || !target) {
        showAddedModal(added);
        return;
      }

      const fromRect = originEl.getBoundingClientRect();
      const toRect = target.getBoundingClientRect();
      pendingModalItemRef.current = added;
      setFlyParticle({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        from: {
          x: fromRect.left + fromRect.width / 2,
          y: fromRect.top + fromRect.height / 2,
          width: Math.min(fromRect.width, 56),
          height: Math.min(fromRect.height, 56),
        },
        to: {
          x: toRect.left + toRect.width / 2,
          y: toRect.top + toRect.height / 2,
        },
        image: input.image,
      });
    },
    [showAddedModal],
  );

  const dismissAddedModal = useCallback(() => {
    setRecentlyAdded(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalQuantity: cartTotalQuantity(items),
      totalCad: cartTotalCad(items),
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      flyParticle,
      cartPulse,
      recentlyAdded,
      beginAddFromElement,
      completeFly,
      dismissAddedModal,
    }),
    [
      items,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      flyParticle,
      cartPulse,
      recentlyAdded,
      beginAddFromElement,
      completeFly,
      dismissAddedModal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
