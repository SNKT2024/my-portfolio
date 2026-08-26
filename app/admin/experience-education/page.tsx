// src/app/admin/experience-education/page.tsx
import prisma from "@/lib/prisma";
import { ExperienceEducationManager } from "@/components/admin/ExperienceEducationManager";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExperienceEducationPage() {
  const [experiences, educations] = await Promise.all([
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-6 font-mono p-5">
      {/* Title Banner */}
      <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-lime-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]">
              MODULE_04
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              Experience & Education Roadmap
            </h1>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Maintain timeline milestones for engineering roles, internships,
            fellowships, and academic degrees.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-lime-100 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
          <Briefcase className="size-3.5 text-black" />
          <span>
            {experiences.length} ROLES • {educations.length} DEGREES
          </span>
        </div>
      </div>

      {/* Main Experience/Education Component */}
      <ExperienceEducationManager
        initialExperiences={experiences}
        initialEducations={educations}
      />
    </div>
  );
}
