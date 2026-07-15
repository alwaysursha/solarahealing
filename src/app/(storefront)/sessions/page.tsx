import { CatalogIndexView } from "@/components/catalog/CatalogIndexView";
import { getPublishedPrivateSessions } from "@/lib/content";
import { privateSessionsIntro } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function PrivateSessionsIndexPage() {
  const sessionList = await getPublishedPrivateSessions();

  return (
    <CatalogIndexView
      type="private_session"
      items={sessionList}
      eyebrow={privateSessionsIntro.eyebrow}
      title={privateSessionsIntro.title}
      titleAccent={privateSessionsIntro.titleAccent}
      description={privateSessionsIntro.description}
    />
  );
}
