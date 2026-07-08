import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { Hero } from "@/components/sections/Hero";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { TestimonialsShowcaseSection } from "@/components/sections/TestimonialsShowcaseSection";
import { WorkshopsSection } from "@/components/sections/WorkshopsSection";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.name,
    description: settings.description,
  };
}

export default async function HomePage() {
  await getSiteSettings();

  return (
    <main>
      <Hero />
      <AboutSection />
      <WorkshopsSection />
      <ArticlesSection />
      <CoursesSection />
      <TestimonialsShowcaseSection />
      <ScheduleSection />
    </main>
  );
}
