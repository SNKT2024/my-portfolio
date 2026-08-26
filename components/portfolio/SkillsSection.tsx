// src/components/portfolio/SkillsSection.tsx
"use client";

import { useState, useMemo } from "react";
import { SkillCategory, Skill } from "@/app/generated/prisma/client";
import { DynamicIcon } from "../admin/DynamicIcon";

type SkillCategoryWithSkills = SkillCategory & {
  skills: Skill[];
};

interface SkillsSectionProps {
  categories: SkillCategoryWithSkills[];
}

export function SkillsSection({ categories }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.id ?? "",
  );

  const skills = useMemo(() => {
    let currentSkills: Skill[] = [];

    const activeCat = categories.find((cat) => cat.id === selectedCategory);
    currentSkills = activeCat ? activeCat.skills : [];

    return Array.from(
      new Map(currentSkills.map((s) => [s.name.toLowerCase(), s])).values(),
    );
  }, [categories, selectedCategory]);

  return (
    <section id="skills" className="space-y-8 font-mono">
      {/* Section Title Banner */}
      <div className="flex items-center gap-2">
        <span className="bg-pink-300 border-2 border-black dark:border-white px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] text-black dark:text-black">
          SECTION_02
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
          Technical Stack & Skills
        </h2>
      </div>

      {/* Category Tabs Strip */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-xs font-black uppercase border-2 border-black dark:border-white transition-all ${
                isSelected
                  ? "bg-yellow-300 dark:bg-yellow-400 text-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] -translate-y-0.5"
                  : "bg-white dark:bg-zinc-900 text-foreground hover:bg-yellow-100 hover:text-black hover:shadow-[2px_2px_0px_0px_#000]"
              }`}
            >
              [ {category.name} ]
            </button>
          );
        })}
      </div>

      <div className="w-full h-0.5 bg-black/20 dark:bg-white/20" />

      {/* ---------------- SKILLS ---------------- */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide text-foreground">
            Skills
          </h3>
          <div className="w-16 h-1 bg-yellow-400 mt-1" />
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            No skills listed in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="group border-2 border-black dark:border-white bg-white dark:bg-zinc-950 p-5 flex flex-col items-center justify-center gap-3 text-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                {/* Logo Container with Brand Colored Icon */}
                <div className="size-14 sm:size-16 rounded-none border-2 border-black dark:border-white bg-white dark:bg-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] transition-colors">
                  <DynamicIcon
                    iconKey={skill.iconKey || skill.name}
                    className="size-7 sm:size-8 transition-transform group-hover:scale-110"
                    useBrandColor
                  />
                </div>

                {/* Skill Name */}
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-foreground line-clamp-1">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
