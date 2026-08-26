// src/components/portfolio/ExperienceEducation.tsx
import { Experience, Education } from "@/app/generated/prisma/client";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";

interface ExperienceEducationProps {
  experiences: Experience[];
  educations: Education[];
}

export function ExperienceEducation({
  experiences,
  educations,
}: ExperienceEducationProps) {
  return (
    <section id="journey" className="space-y-10">
      <div className="flex items-center gap-2">
        <span className="bg-lime-300 border-2 border-black px-2.5 py-1 text-sm font-black uppercase shadow-[2px_2px_0px_0px_#000]">
          SECTION_04
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          Experience & Education
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Work Experience */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 bg-lime-100 p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <Briefcase className="size-4.5" />
            <h3 className="text-sm font-black uppercase">Work Experience</h3>
          </div>

          <div className="space-y-5">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-4"
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-200 pb-2">
                  <div>
                    <h4 className="text-base font-black text-black">
                      {exp.role}
                    </h4>
                    <div className="text-sm font-bold text-zinc-600">
                      @ {exp.company}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 border border-black text-xs font-black uppercase ${
                      exp.status === "CURRENT"
                        ? "bg-emerald-300"
                        : "bg-zinc-100"
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 font-bold">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                  {exp.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {exp.location}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-700 font-medium leading-relaxed">
                  {exp.description}
                </p>

                {exp.points.length > 0 && (
                  <ul className="space-y-1 pt-2 border-t border-zinc-100">
                    {exp.points.map((pt, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-zinc-800 flex items-start gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0 border border-black" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2 bg-purple-100 p-4 border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <GraduationCap className="size-4.5" />
            <h3 className="text-sm font-black uppercase">Education</h3>
          </div>

          <div className="space-y-5">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-4"
              >
                <div className="flex items-start justify-between gap-2 border-b border-zinc-200 pb-2">
                  <div>
                    <h4 className="text-base font-black text-black">
                      {edu.degree}
                    </h4>
                    <div className="text-sm font-bold text-zinc-600">
                      {edu.institution}
                    </div>
                  </div>
                  {edu.grade && (
                    <span className="inline-flex items-center gap-1 bg-purple-200 dark:bg-purple-300 border border-black text-[10px] font-black dark:text-black uppercase px-2 py-0.5 shadow-[1px_1px_0px_0px_#000] ">
                      <Award className="size-3 dark:text-black" />
                      {edu.grade}
                    </span>
                  )}
                </div>

                <div className="text-sm text-zinc-600 font-bold flex items-center gap-1">
                  <Calendar className="size-3" />
                  {edu.startYear} - {edu.endYear}{" "}
                  {edu.location ? `• ${edu.location}` : ""}
                </div>

                <p className="text-sm text-zinc-700 font-medium leading-relaxed">
                  {edu.description}
                </p>

                {edu.points.length > 0 && (
                  <ul className="space-y-1 pt-2 border-t border-zinc-100">
                    {edu.points.map((pt, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-zinc-800 flex items-start gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0 border border-black" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
