// src/app/page.tsx
import prisma from "@/lib/prisma";
import { NavBar } from "@/components/portfolio/NavBar";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ContactFooter } from "@/components/portfolio/ContactFooter";
import { ExperienceEducation } from "@/components/portfolio/ExperienceEducation";
import { PortfolioAutoRefresh } from "@/components/portfolio/PortfolioAutoRefresh";

export const revalidate = 60;

export default async function HomePage() {
  const [
    heroData,
    aboutData,
    skillCategories,
    projects,
    experiences,
    educations,
    socialLinks,
  ] = await Promise.all([
    prisma.heroSection.findFirst({ where: { id: 1 } }),
    prisma.aboutSection.findFirst({ where: { id: "about_singleton" } }),
    prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        skills: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    }),
    prisma.experience.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.education.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground font-mono transition-colors duration-300">
      <PortfolioAutoRefresh />

      {/* 1. Sticky Navigation Bar */}
      <NavBar heroData={heroData} />

      {/* Main Portfolio Content */}
      <main
        id="portfolio-main"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
      >
        {/* 2. Hero Section */}
        <HeroSection
          heroData={heroData}
          aboutData={aboutData}
          socialLinks={socialLinks}
        />

        {/* 3. About Section */}
        <AboutSection aboutData={aboutData} />

        {/* 4. Skills Section */}
        <SkillsSection categories={skillCategories} />

        {/* 5. Projects Section */}
        <ProjectsSection projects={projects} />

        {/* 6. Journey Section */}
        <ExperienceEducation
          experiences={experiences}
          educations={educations}
        />

        {/* 7. Contact Footer */}
        <ContactFooter socialLinks={socialLinks} heroData={heroData} />
      </main>
    </div>
  );
}
