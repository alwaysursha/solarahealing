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
  getStorefrontSectionVisibility,
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
  const [home, articlesDisplay, visibility] = await Promise.all([
    getHomePageContent(),
    getHomeArticlesDisplay(),
    getStorefrontSectionVisibility(),
  ]);

  const [courses, workshops] = await Promise.all([
    visibility.showCoursesSection ? getPublishedCourses() : Promise.resolve([]),
    visibility.showWorkshopsSection ? getPublishedWorkshops() : Promise.resolve([]),
  ]);

  return (
    <main className="site-scroll-main">
      <Hero slides={home.heroSlides} />
      <AboutSection content={home.aboutContent} />
      {visibility.showCoursesSection ? (
        <CoursesSection courses={courses} intro={home.coursesIntro} />
      ) : null}
      <ArticlesSection
        intro={home.articlesIntro}
        featured={articlesDisplay.featured}
        secondary={articlesDisplay.secondary}
        list={articlesDisplay.list}
      />
      {visibility.showWorkshopsSection ? (
        <WorkshopsSection workshopList={workshops} intro={home.workshopsIntro} />
      ) : null}
      <ScheduleSection booking={home.scheduleBooking} />
      <TestimonialsShowcaseSection
        intro={home.testimonialsIntro}
        items={home.testimonials}
      />
    </main>
  );
}
