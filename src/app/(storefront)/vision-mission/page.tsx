import type { Metadata } from "next";
import { VisionMissionPageView } from "@/components/vision-mission/VisionMissionPageView";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Vision & Mission | ${SITE_NAME}`,
  description:
    "Discover the vision and mission of Soulara Healing Academy — awakening light, elevating life, and living your highest potential through holistic healing.",
};

export default function VisionMissionPage() {
  return <VisionMissionPageView />;
}
