"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

export function CheckoutSuccessClearCart() {
  const { clear, hydrated } = useCart();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    clear();
  }, [clear, hydrated]);

  return null;
}

export function CheckoutSuccessActions() {
  return (
    <div className="checkout-success-actions">
      <Link href="/account#orders" className="account-cta-primary account-cta-inline">
        View your orders
      </Link>
      <Link href="/" className="checkout-success-home">
        Return home
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
