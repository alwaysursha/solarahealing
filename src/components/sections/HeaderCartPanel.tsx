"use client";

import Link from "next/link";
import { CartIcon } from "@/components/ui/CartIcon";

type HeaderCartPanelProps = {
  onClose: () => void;
  embedded?: boolean;
};

function CartEmptyState({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "header-cart-empty flex min-w-0 items-center gap-3 rounded-[0.9rem] border border-cream/10 bg-cream/[0.04]",
        compact ? "px-3.5 py-2.5 sm:px-4 sm:py-3" : "px-4 py-3",
      ].join(" ")}
    >
      <span
        className={[
          "flex shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold",
          compact ? "h-8 w-8 sm:h-9 sm:w-9" : "h-9 w-9",
        ].join(" ")}
      >
        <CartIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className={compact ? "text-[0.7rem] font-medium text-cream/88" : "text-[0.72rem] font-medium text-cream/88"}>
          Your cart is empty
        </p>
        <p className={compact ? "mt-0.5 text-[0.64rem] text-cream/48" : "mt-0.5 text-[0.66rem] text-cream/48"}>
          Add a course or session to begin checkout.
        </p>
      </div>
    </div>
  );
}

export function HeaderCartPanel({ onClose, embedded = false }: HeaderCartPanelProps) {
  if (embedded) {
    return (
      <div className="header-account-cart-embed">
        <div className="header-account-cart-embed-inner">
          <CartEmptyState compact />

          <div className="header-account-cart-embed-actions">
            <Link
              href="/checkout"
              className="header-login-submit header-login-submit-compact inline-flex items-center justify-center"
              onClick={onClose}
            >
              <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
              <span className="relative">Checkout</span>
            </Link>
            <Link href="/#courses" className="header-account-cart-browse" onClick={onClose}>
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="header-login-panel relative mt-2.5 w-full">
      <div className="header-login-panel-inner relative overflow-hidden rounded-[1.1rem] border border-gold/25 px-4 py-3.5 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.55)] sm:rounded-[1.25rem] sm:px-5 sm:py-4">
        <div className="header-login-panel-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="header-login-panel-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative z-[1]">
          <div className="header-login-form flex flex-col gap-2.5">
            <div className="header-login-form-layout">
              <div className="header-login-intro">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.3em] text-gold/82">
                  Your selections
                </p>
                <h2 className="mt-1 font-serif text-[1.15rem] font-normal leading-none tracking-[-0.02em] text-cream lg:text-[1.25rem]">
                  Items in your Cart
                </h2>
              </div>

              <div className="header-cart-content">
                <CartEmptyState />
              </div>

              <div className="header-login-actions">
                <Link
                  href="/checkout"
                  className="header-login-submit header-login-submit-compact inline-flex items-center justify-center"
                  onClick={onClose}
                >
                  <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
                  <span className="relative">Checkout</span>
                </Link>
              </div>
            </div>

            <div className="header-login-footer flex flex-wrap items-center justify-between gap-x-4 gap-y-1 md:pl-[8.5rem]">
              <Link
                href="/#courses"
                className="text-[0.68rem] font-medium text-gold/86 transition-colors hover:text-gold-light"
                onClick={onClose}
              >
                Browse courses
              </Link>
              <p className="text-[0.68rem] text-cream/52">Secure checkout with Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
