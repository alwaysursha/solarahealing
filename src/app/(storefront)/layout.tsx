import { StorefrontShell } from "@/components/storefront/StorefrontShell";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <StorefrontShell
      whatsapp={settings.contact.whatsapp}
      name={settings.name}
      nav={settings.nav}
      cta={settings.cta}
      sanskrit={settings.sanskrit}
    >
      {children}
    </StorefrontShell>
  );
}
