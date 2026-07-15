"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { CartIcon } from "@/components/ui/CartIcon";
import { cartTypeLabel, sortCartItemsWorkshopsFirst } from "@/lib/cart/types";
import { formatCad } from "@/lib/site";

type HeaderCartPanelProps = {
  onClose: () => void;
};

function CartEmptyState() {
  return (
    <div className="header-cart-empty flex min-w-0 items-center gap-3 rounded-[0.9rem] border border-cream/10 bg-cream/[0.04] px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
        <CartIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.85rem] font-medium text-cream/88 sm:text-[0.9rem]">Your cart is empty</p>
        <p className="mt-0.5 text-[0.78rem] text-cream/48 sm:text-[0.82rem]">
          Enroll in a course or register for a workshop to begin.
        </p>
      </div>
    </div>
  );
}

export function HeaderCartPanel({ onClose }: HeaderCartPanelProps) {
  const { items, totalCad, removeItem } = useCart();
  const ordered = sortCartItemsWorkshopsFirst(items);
  const hasItems = ordered.length > 0;

  return (
    <div className="header-login-panel relative mt-2.5 w-full">
      <div className="header-login-panel-inner relative overflow-hidden rounded-[1.1rem] border border-gold/25 px-4 py-3.5 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.55)] sm:rounded-[1.25rem] sm:px-5 sm:py-4">
        <div className="header-login-panel-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="header-login-panel-shine pointer-events-none absolute inset-0" aria-hidden />

        <div className="header-cart-panel relative z-[1]">
          <header className="header-cart-panel-header">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold/82 sm:text-[0.72rem]">
              Your selections
            </p>
            <h2 className="mt-1 font-serif text-[1.35rem] font-normal leading-none tracking-[-0.02em] text-cream sm:text-[1.5rem] lg:text-[1.65rem]">
              Items in your Cart
            </h2>
          </header>

          <div className="header-cart-panel-body">
            {!hasItems ? (
              <CartEmptyState />
            ) : (
              <ul className="header-cart-lines">
                {ordered.map((item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className={[
                      "header-cart-line",
                      item.type === "workshop"
                        ? "header-cart-line-workshop"
                        : item.type === "private_session"
                          ? "header-cart-line-session"
                          : "",
                    ].join(" ")}
                  >
                    <div className="header-cart-line-thumb">
                      {item.image ? (
                        <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
                      ) : (
                        <span className="header-cart-line-thumb-fallback" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="header-cart-line-type">{cartTypeLabel(item.type)}</p>
                      <p className="header-cart-line-title">{item.title}</p>
                      <p className="header-cart-line-meta">
                        Qty {item.quantity} · {formatCad(item.priceCad * item.quantity)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="header-cart-line-remove"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => removeItem(item.id, item.type)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="header-cart-panel-footer">
            {hasItems ? (
              <div className="header-cart-checkout-row">
                <div className="header-cart-total-row">
                  <span className="header-cart-total-label">Total</span>
                  <span className="header-cart-total-value">{formatCad(totalCad)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="header-login-submit header-login-submit-compact header-cart-checkout-btn inline-flex items-center justify-center"
                  onClick={onClose}
                >
                  <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
                  <span className="relative">Checkout</span>
                </Link>
              </div>
            ) : (
              <div className="header-cart-checkout-row">
                <span />
                <Link
                  href="/courses"
                  className="header-login-submit header-login-submit-compact header-cart-checkout-btn inline-flex items-center justify-center"
                  onClick={onClose}
                >
                  <span className="header-login-submit-shine pointer-events-none absolute inset-0" />
                  <span className="relative">Browse catalog</span>
                </Link>
              </div>
            )}

            <div className="header-cart-panel-links">
              <div className="header-cart-panel-browse">
                <Link
                  href="/#workshops"
                  className="text-[0.82rem] font-medium text-gold/86 transition-colors hover:text-gold-light sm:text-[0.88rem]"
                  onClick={onClose}
                >
                  Browse workshops
                </Link>
                <Link
                  href="/#courses"
                  className="text-[0.82rem] font-medium text-gold/86 transition-colors hover:text-gold-light sm:text-[0.88rem]"
                  onClick={onClose}
                >
                  Browse courses
                </Link>
              </div>
              <p className="text-[0.78rem] text-cream/52 sm:text-[0.82rem]">Secure checkout with Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
