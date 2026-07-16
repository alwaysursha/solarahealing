import Link from "next/link";
import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const pathways = [
  { label: "Courses", href: "/courses" },
  { label: "Private sessions", href: "/sessions" },
  { label: "Workshops", href: "/workshops" },
  { label: "Articles", href: "/articles" },
] as const;

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <StorefrontShell
      whatsapp={settings.contact.whatsapp}
      name={settings.name}
      nav={settings.nav}
      cta={settings.cta}
      sanskrit={settings.sanskrit}
    >
      <div className="not-found-page">
        <div className="not-found-aura" aria-hidden />
        <div className="not-found-orb not-found-orb-a" aria-hidden />
        <div className="not-found-orb not-found-orb-b" aria-hidden />

        <div className="not-found-inner">
          <p className="not-found-watermark" aria-hidden>
            404
          </p>

          <header className="not-found-hero">
            <p className="not-found-eyebrow">Path not found</p>
            <h1 className="not-found-title">
              This page has
              <span> drifted away</span>
            </h1>
            <p className="not-found-copy">
              The doorway you followed is no longer here. Return home, or continue your healing
              journey through one of the pathways below.
            </p>
          </header>

          <div className="not-found-actions">
            <Link href="/" className="not-found-cta-primary">
              <span className="not-found-cta-shine" aria-hidden />
              <span className="relative">Return home</span>
            </Link>
            <Link href="/courses" className="not-found-cta-ghost">
              Explore courses
            </Link>
          </div>

          <nav className="not-found-pathways" aria-label="Helpful pathways">
            {pathways.map((item) => (
              <Link key={item.href} href={item.href} className="not-found-pathway">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </StorefrontShell>
  );
}
