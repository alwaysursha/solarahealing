"use client";

import type { ReactNode } from "react";
import { EnrollmentGateProvider } from "@/components/auth/EnrollmentGateProvider";
import { FlyToLoginLayer } from "@/components/auth/FlyToLoginLayer";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { AddedToCartModal } from "@/components/cart/AddedToCartModal";
import { CartProvider } from "@/components/cart/CartProvider";
import { FlyToCartLayer } from "@/components/cart/FlyToCartLayer";

export function CartRoot({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <EnrollmentGateProvider>
        {children}
        <FlyToLoginLayer />
        <SignUpModal />
      </EnrollmentGateProvider>
      <FlyToCartLayer />
      <AddedToCartModal />
    </CartProvider>
  );
}
