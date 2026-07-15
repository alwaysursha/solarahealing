import { notFound } from "next/navigation";
import { CatalogDetailView } from "@/components/catalog/CatalogDetailView";
import { getPublishedPrivateSessionById } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PrivateSessionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getPublishedPrivateSessionById(id);
  if (!session) {
    notFound();
  }

  return <CatalogDetailView type="private_session" item={session} />;
}
