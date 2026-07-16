"use client";

import Image from "next/image";
import { useRef } from "react";
import { SpiritualSurface } from "@/components/shell/SpiritualSurface";
import { Logo } from "@/components/ui/Logo";
import { useAnimationsActive } from "@/hooks/useAnimationsActive";
import { footerColumns, footerSocial, site } from "@/lib/site";

const linkGroups = footerColumns.flatMap((column) => column.groups);

function SocialIcon({ network }: { network: string }) {
  const className = "footer-social-svg";

  switch (network) {
    case "YouTube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.6 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .3 2.7.6.8.3 1.4.7 2.1 1.4.7.7 1.1 1.3 1.4 2.1.3.7.5 1.5.6 2.7.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 2-.6 2.7-.3.8-.7 1.4-1.4 2.1-.7.7-1.3 1.1-2.1 1.4-.7.3-1.5.5-2.7.6-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.3-2.7-.6a5.7 5.7 0 01-2.1-1.4 5.7 5.7 0 01-1.4-2.1c-.3-.7-.5-1.5-.6-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-2 .6-2.7.3-.8.7-1.4 1.4-2.1.7-.7 1.3-1.1 2.1-1.4.7-.3 1.5-.5 2.7-.6C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-2 .4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.4 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1 .2 1.6.4 2 .2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .4 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.4-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.4-2-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.4-2-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 1.8a3.7 3.7 0 100 7.4 3.7 3.7 0 000-7.4zm5.8-3.9a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function FooterLinkGroup({
  title,
  links,
  index,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  index: number;
}) {
  const ordinal = String(index + 1).padStart(2, "0");

  return (
    <nav className="footer-link-group" aria-label={title}>
      <div className="footer-link-group-head">
        <span className="footer-link-group-index" aria-hidden>
          {ordinal}
        </span>
        <h3 className="footer-link-group-title">{title}</h3>
      </div>
      <ul className="footer-link-list">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="footer-link">
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const animationsActive = useAnimationsActive(footerRef);

  return (
    <footer ref={footerRef} className="footer-shell">
      <div className="footer-main">
        <div className="footer-main-aura" aria-hidden />

        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-copy">
              <Logo variant="dark" className="footer-brand-logo" />
              <p className="footer-brand-sanskrit" lang="sa">
                {site.sanskrit}
              </p>
              <p className="footer-brand-meaning">{site.sanskritMeaning}</p>
            </div>

            <div className="footer-social-block">
              <p className="footer-social-label">{footerSocial.title}</p>
              <ul className="footer-social-list">
                {footerSocial.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="footer-social-icon"
                    >
                      <SocialIcon network={link.label} />
                      <span className="footer-social-name">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-divider" aria-hidden>
            <span className="footer-divider-line" />
            <span className="footer-divider-gem" />
            <span className="footer-divider-line" />
          </div>

          <div className="footer-links-grid">
            {linkGroups.map((group, index) => (
              <FooterLinkGroup
                key={group.title}
                title={group.title}
                links={group.links}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      <SpiritualSurface
        className="footer-community footer-social-panel"
        animationsPaused={!animationsActive}
      >
        <div className="footer-community-inner">
          <div className="footer-community-copy">
            <p className="footer-panel-heading">{footerSocial.communityTitle}</p>
            <p className="footer-community-text">{footerSocial.communityDescription}</p>
            <div className="footer-community-proof">
              <div className="footer-community-avatars">
                {footerSocial.communityAvatars.map((avatar, index) => (
                  <div
                    key={avatar.src}
                    className="footer-community-avatar"
                    style={{ zIndex: 10 - index }}
                  >
                    <Image src={avatar.src} alt={avatar.alt} fill sizes="40px" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="footer-community-proof-text">{footerSocial.communityProof}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-whatsapp-btn"
          >
            <span>{footerSocial.communityCta}</span>
            <svg className="footer-whatsapp-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </SpiritualSurface>

      <div className="footer-bar">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
