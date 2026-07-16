"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/sections/nav/NavIcon";
import { useSiteChrome } from "@/components/storefront/SiteChromeProvider";
import { isBlogNavItem, pickPostsForNav, type BlogMenuPost } from "@/lib/blog-nav";
import type { SiteNavItem } from "@/lib/frontpage-content";
import { desktopNavItem } from "@/lib/nav-motion";

type BlogNavMenuProps = {
  item: SiteNavItem;
  animated?: boolean;
};

function isActivePath(pathname: string, href: string) {
  if (!href.startsWith("/")) return false;
  const path = href.split("#")[0] || href;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function FeaturedPreview({ post }: { post: BlogMenuPost }) {
  return (
    <Link href={post.href} className="blog-mega-featured" role="menuitem">
      <span className="blog-mega-featured-media">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="320px"
          className="object-cover"
          priority={false}
        />
        <span className="blog-mega-featured-shade" aria-hidden />
      </span>
      <span className="blog-mega-featured-body">
        <span className="blog-mega-featured-kicker">{post.category || "Journal"}</span>
        <span className="blog-mega-featured-title">{post.title}</span>
        {post.excerpt ? (
          <span className="blog-mega-featured-excerpt">{post.excerpt}</span>
        ) : null}
        <span className="blog-mega-featured-cta">
          Read article
          <span aria-hidden>→</span>
        </span>
      </span>
    </Link>
  );
}

function PostRow({
  post,
  active,
  onNavigate,
  onHighlight,
}: {
  post: BlogMenuPost;
  active?: boolean;
  onNavigate?: () => void;
  onHighlight?: () => void;
}) {
  return (
    <Link
      href={post.href}
      className={["courses-mega-item blog-mega-item", active ? "is-active" : ""].join(" ")}
      onClick={onNavigate}
      onMouseEnter={onHighlight}
      onFocus={onHighlight}
      role="menuitem"
    >
      <span className="courses-mega-item-media">
        <Image src={post.image} alt={post.imageAlt} fill sizes="56px" className="object-cover" />
      </span>
      <span className="courses-mega-item-copy">
        <span className="courses-mega-item-title">{post.title}</span>
        <span className="courses-mega-item-meta">{post.category || "Journal"}</span>
      </span>
    </Link>
  );
}

export function BlogDesktopNavMenu({ item, animated = true }: BlogNavMenuProps) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { blogMenu } = useSiteChrome();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();
  const active = isActivePath(pathname, item.href);
  const useMotion = animated && !reduceMotion;
  const posts = pickPostsForNav(blogMenu);
  const [previewId, setPreviewId] = useState(posts[0]?.id ?? "");
  const preview = posts.find((post) => post.id === previewId) ?? posts[0] ?? null;

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => clearCloseTimer(), []);

  const triggerClass = [
    "nav-link-desktop group relative inline-flex items-center gap-2 px-1 py-2",
    active || open ? "nav-link-desktop-active" : "",
  ].join(" ");

  const trigger = (
    <>
      <NavIcon id={item.icon} className="nav-link-icon h-[0.95rem] w-[0.95rem] shrink-0" />
      <span className="nav-link-desktop-label">{item.label}</span>
      <span className="reiki-mega-chevron" aria-hidden>
        ▾
      </span>
      <span className="nav-link-desktop-glow pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold/90 to-transparent opacity-0 transition-[transform,opacity] duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100" />
    </>
  );

  return (
    <div
      className="reiki-mega-root"
      onMouseEnter={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => {
        clearCloseTimer();
        setOpen(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          scheduleClose();
        }
      }}
    >
      {useMotion ? (
        <motion.button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          variants={desktopNavItem}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 520, damping: 28 }}
          onClick={() => setOpen((value) => !value)}
        >
          {trigger}
        </motion.button>
      ) : (
        <button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={() => setOpen((value) => !value)}
        >
          {trigger}
        </button>
      )}

      <AnimatePresence>
        {open ? (
          <div className="blog-mega-panel-anchor">
            <motion.div
              id={menuId}
              className="reiki-mega-panel courses-mega-panel"
              role="menu"
              aria-label="Articles menu"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="reiki-mega-panel-glow" aria-hidden />
              <div className="blog-mega-grid">
                <div className="blog-mega-preview">
                  <AnimatePresence mode="wait" initial={false}>
                    {preview ? (
                      <motion.div
                        key={preview.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <FeaturedPreview post={preview} />
                      </motion.div>
                    ) : (
                      <p className="courses-mega-empty">Articles coming soon</p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="blog-mega-list">
                  <p className="reiki-mega-eyebrow">Latest posts</p>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostRow
                        key={post.id}
                        post={post}
                        active={post.id === preview?.id}
                        onHighlight={() => setPreviewId(post.id)}
                      />
                    ))
                  ) : (
                    <p className="courses-mega-empty">No posts yet</p>
                  )}
                  <a href={item.href} className="reiki-mega-overview" role="menuitem">
                    View all articles →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function BlogMobileNavMenu({
  item,
  onNavigate,
  open,
  onToggle,
}: {
  item: SiteNavItem;
  onNavigate?: () => void;
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { blogMenu } = useSiteChrome();
  const active = isActivePath(pathname, item.href);
  const posts = pickPostsForNav(blogMenu);

  if (!isBlogNavItem(item)) return null;

  return (
    <div className={["reiki-mobile-menu", open ? "reiki-mobile-menu-open" : ""].join(" ")}>
      <button
        type="button"
        className={[
          "mobile-nav-link group relative flex w-full items-center gap-4 py-3.5 text-left",
          active ? "mobile-nav-link-active" : "",
        ].join(" ")}
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="mobile-nav-link-icon-wrap" aria-hidden>
          <NavIcon id={item.icon} className="mobile-nav-link-icon h-[1.05rem] w-[1.05rem]" />
        </span>
        <span className="mobile-nav-link-copy min-w-0 flex-1">
          <span className="mobile-nav-link-label nav-link-desktop-label">{item.label}</span>
        </span>
        <span className="reiki-mobile-chevron" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="reiki-mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="reiki-mobile-panel-inner courses-mobile-panel-inner">
              <p className="reiki-mega-eyebrow blog-mobile-eyebrow">Latest posts</p>
              {posts.map((post) => (
                <PostRow key={post.id} post={post} onNavigate={onNavigate} />
              ))}
              <a href={item.href} className="courses-mobile-all" onClick={onNavigate}>
                View all articles →
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
