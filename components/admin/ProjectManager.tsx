// src/components/admin/ProjectManager.tsx
"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { ProjectModal } from "@/components/admin/ProjectModal";
import { deleteProject } from "@/actions/projectActions";
import { Plus, Search, Pencil, Trash2, ExternalLink, Star } from "lucide-react";
import { Project } from "@/app/generated/prisma/client";

interface ProjectManagerProps {
  initialProjects: Project[];
}

export function ProjectManager({ initialProjects }: ProjectManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filteredProjects = initialProjects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.techStack.some((t) => t.toLowerCase().includes(query))
    );
  });

  const handleOpenCreate = () => {
    setSelectedProject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`))
      return;

    setIsDeletingId(id);
    await deleteProject(id);
    setIsDeletingId(null);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Search & Actions Control Bar */}
      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or tech..."
            className="w-full pl-9 pr-3 py-2 border-2 border-black bg-zinc-50 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-yellow-300 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Listing View */}
      <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-bold uppercase">
            No projects found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-black bg-yellow-100 uppercase text-black font-black">
                  <th className="p-3 border-r-2 border-black w-14 text-center">
                    #
                  </th>
                  <th className="p-3 border-r-2 border-black">
                    Project Details
                  </th>
                  <th className="p-3 border-r-2 border-black hidden md:table-cell">
                    Stack Tags
                  </th>
                  <th className="p-3 border-r-2 border-black text-center w-24">
                    Status
                  </th>
                  <th className="p-3 text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-amber-50/60 transition-colors"
                  >
                    {/* Order */}
                    <td className="p-3 border-r-2 border-black text-center font-bold text-zinc-600 bg-zinc-50">
                      {project.order}
                    </td>

                    {/* Title & Metadata */}
                    <td className="p-3 border-r-2 border-black min-w-[200px]">
                      <div className="flex items-start gap-3">
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="size-10 object-cover border border-black shrink-0 hidden sm:block shadow-[1px_1px_0px_0px_#000]"
                          />
                        )}
                        <div>
                          <div className="font-black text-black flex items-center gap-2">
                            <span>{project.title}</span>
                            {project.featured && (
                              <span className="bg-yellow-300 border border-black px-1.5 py-0.2 text-[9px] font-black uppercase inline-flex items-center gap-0.5">
                                <Star className="size-2.5 fill-black text-black" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
                            <span>{project.category}</span>
                            <span>•</span>
                            <span>{project.type}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold"
                              >
                                Live <ExternalLink className="size-2.5" />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-zinc-700 hover:underline font-bold"
                              >
                                Source <FaGithub className="size-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tech Stack Badges */}
                    <td className="p-3 border-r-2 border-black hidden md:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 bg-zinc-100 border border-black text-[10px] font-bold text-zinc-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Featured / Live Indicator */}
                    <td className="p-3 border-r-2 border-black text-center">
                      {project.featured ? (
                        <span className="px-2 py-1 bg-emerald-200 border border-black text-[10px] font-bold text-emerald-950 uppercase">
                          Pinned
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-zinc-100 border border-black text-[10px] font-bold text-zinc-600 uppercase">
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 border border-black bg-white hover:bg-cyan-200 shadow-[1px_1px_0px_0px_#000] transition"
                          title="Edit Project"
                        >
                          <Pencil className="size-3.5 text-black" />
                        </button>
                        <button
                          type="button"
                          disabled={isDeletingId === project.id}
                          onClick={() =>
                            handleDelete(project.id, project.title)
                          }
                          className="p-1.5 border border-black bg-white hover:bg-red-200 text-red-600 shadow-[1px_1px_0px_0px_#000] transition disabled:opacity-50"
                          title="Delete Project"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reusable Project CRUD Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectToEdit={selectedProject}
      />
    </div>
  );
}
