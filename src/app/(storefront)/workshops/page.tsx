import { CatalogIndexView } from "@/components/catalog/CatalogIndexView";
import { getPublishedWorkshops, getWorkshopsIntro } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function WorkshopsIndexPage() {
  const [workshopList, intro] = await Promise.all([
    getPublishedWorkshops(),
    getWorkshopsIntro(),
  ]);

  return (
    <CatalogIndexView
      type="workshop"
      items={workshopList}
      eyebrow="Enrolling Now"
      title="Upcoming"
      titleAccent="Workshops"
      description={intro}
    />
  );
}
