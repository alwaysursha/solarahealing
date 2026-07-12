"use client";

import type { ReactNode } from "react";
import { AddedToCartModal } from "@/components/cart/AddedToCartModal";
import { CartProvider } from "@/components/cart/CartProvider";
import { FlyToCartLayer } from "@/components/cart/FlyToCartLayer";

export function CartRoot({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <FlyToCartLayer />
      <AddedToCartModal />
    </CartProvider>
  );
}
