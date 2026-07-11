import { AdminField, AdminPanel, AdminShell, AdminSubmit } from "@/components/admin/AdminShell";
import { updateSiteSettingsAction } from "@/lib/admin/actions";
import { getDbSiteSettings } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings = await getDbSiteSettings();
  if (!settings) {
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        name: SITE_NAME,
        tagline: site.tagline,
        sanskrit: site.sanskrit,
        sanskritMeaning: site.sanskritMeaning,
        description: SITE_DESCRIPTION,
        seoTitle: SITE_NAME,
        metaDescription: SITE_DESCRIPTION,
        phone: site.contact.phone,
        email: site.contact.email,
        whatsapp: site.contact.whatsapp,
        address: site.contact.location,
        cta: site.cta,
      },
      update: {},
    });
    settings = await getDbSiteSettings();
  }

  const s = settings!;

  return (
    <AdminShell
      activePath="/admin/settings"
      title="Site Settings"
      description="Update branding, SEO metadata, and contact details shown across the website."
    >
      <AdminPanel title="General & SEO">
        <form action={updateSiteSettingsAction} className="grid gap-4 lg:grid-cols-2">
          <AdminField label="Site name" name="name" defaultValue={s.name} />
          <AdminField label="Slogan / tagline" name="tagline" defaultValue={s.tagline} />
          <AdminField label="Sanskrit line" name="sanskrit" defaultValue={s.sanskrit} />
          <AdminField label="Sanskrit meaning" name="sanskritMeaning" defaultValue={s.sanskritMeaning} />
          <AdminField label="SEO title" name="seoTitle" defaultValue={s.seoTitle} />
          <AdminField label="Primary CTA label" name="cta" defaultValue={s.cta} />
          <div className="lg:col-span-2">
            <AdminField label="Site description" name="description" defaultValue={s.description} rows={3} />
          </div>
          <div className="lg:col-span-2">
            <AdminField label="Meta description" name="metaDescription" defaultValue={s.metaDescription} rows={3} />
          </div>
          <AdminField label="Phone number" name="phone" defaultValue={s.phone} />
          <AdminField label="Email" name="email" defaultValue={s.email} type="email" />
          <AdminField label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp} />
          <AdminField label="Address" name="address" defaultValue={s.address} />
          <div className="lg:col-span-2">
            <AdminSubmit />
          </div>
        </form>
      </AdminPanel>
    </AdminShell>
  );
}
