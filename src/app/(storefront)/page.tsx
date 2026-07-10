import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ArticlesSection } from "@/components/sections/ArticlesSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { Hero } from "@/components/sections/Hero";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { TestimonialsShowcaseSection } from "@/components/sections/TestimonialsShowcaseSection";
import { WorkshopsSection } from "@/components/sections/WorkshopsSection";
import {
  getHomeArticlesDisplay,
  getHomePageContent,
  getPublishedCourses,
  getPublishedWorkshops,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle || settings.name,
    description: settings.metaDescription || settings.description,
  };
}

export default async function HomePage() {
  const [home, courses, workshops, articlesDisplay] = await Promise.all([
    getHomePageContent(),
    getPublishedCourses(),
    getPublishedWorkshops(),
    getHomeArticlesDisplay(),
  ]);

  return (
    <main className="site-scroll-main">
      <Hero slides={home.heroSlides} />
      <AboutSection content={home.aboutContent} />
      <CoursesSection courses={courses} intro={home.coursesIntro} />
      <ArticlesSection
        intro={home.articlesIntro}
        featured={articlesDisplay.featured}
        secondary={articlesDisplay.secondary}
        list={articlesDisplay.list}
      />
      <WorkshopsSection workshopList={workshops} intro={home.workshopsIntro} />
      <TestimonialsShowcaseSection
        intro={home.testimonialsIntro}
        items={home.testimonials}
      />
      <ScheduleSection booking={home.scheduleBooking} />
    </main>
  );
}
