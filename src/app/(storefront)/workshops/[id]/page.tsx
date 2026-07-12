import { notFound } from "next/navigation";
import { CatalogDetailView } from "@/components/catalog/CatalogDetailView";
import { getPublishedWorkshopById } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkshopDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workshop = await getPublishedWorkshopById(id);
  if (!workshop) {
    notFound();
  }

  return <CatalogDetailView type="workshop" item={workshop} />;
}
