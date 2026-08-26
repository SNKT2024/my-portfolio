// src/app/admin/skills/page.tsx
import prisma from "@/lib/prisma";
import { SkillManager } from "@/components/admin/SkillManager";
import { Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: {
        orderBy: { order: "asc" },
      },
    },
  });

  const totalSkills = categories.reduce(
    (acc, cat) => acc + cat.skills.length,
    0,
  );

  return (
    <div className="space-y-6 font-mono p-5">
      {/* Title Banner */}
      <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-pink-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]">
              MODULE_03
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              Skills & Tech Stack Taxonomy
            </h1>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Group your skills into logical technical domains.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-pink-100 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
          <Layers className="size-3.5 text-black" />
          <span>
            {totalSkills} SKILLS IN {categories.length} CATEGORIES
          </span>
        </div>
      </div>

      {/* Main Skill Management Interface */}
      <SkillManager initialCategories={categories} />
    </div>
  );
}
