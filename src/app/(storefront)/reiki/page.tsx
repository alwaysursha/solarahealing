import type { Metadata } from "next";
import { ReikiPageView } from "@/components/reiki/ReikiPageView";
import { SITE_NAME } from "@/lib/constants";
import { getReikiPageContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Reiki Healing | ${SITE_NAME}`,
  description:
    "Discover Reiki at Soulara Healing Academy — Japanese holistic energy healing for mind, body, and soul. Book a private session or begin a Reiki course.",
};

export default async function ReikiPage() {
  const content = await getReikiPageContent();
  return <ReikiPageView content={content} />;
}
