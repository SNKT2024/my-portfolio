// src/app/admin/projects/page.tsx
import prisma from "@/lib/prisma";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { Terminal, FolderGit2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6 font-mono p-5">
      {/* Title Banner */}
      <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]">
              MODULE_02
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              Projects Hub & Case Studies
            </h1>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Manage repository showcases, technical stacks, architecture bullet
            points, and live URLs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-emerald-100 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
          <FolderGit2 className="size-3.5 text-black" />
          <span>{projects.length} REPOSITORIES_INDEXED</span>
        </div>
      </div>

      {/* Main Project Manager Interface */}
      <ProjectManager initialProjects={projects} />
    </div>
  );
}
