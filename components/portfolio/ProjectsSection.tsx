// src/components/portfolio/ProjectsSection.tsx
import { Project } from "@/app/generated/prisma/client";
import { ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-300 border-2 border-black px-2.5 py-1 text-sm font-black uppercase shadow-[2px_2px_0px_0px_#000]">
            SECTION_03
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Featured Projects & Systems
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between hover:bg-amber-50/20 transition-colors"
          >
            <div>
              {/* Thumbnail */}
              {project.imageUrl && (
                <div className="border-b-2 border-black relative aspect-video overflow-hidden bg-zinc-100">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {project.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-300 border-2 border-black px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                      <Star className="size-3 fill-black text-black" />
                      Featured
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black uppercase text-black">
                      {project.title}
                    </h3>
                    <div className="text-xs font-bold text-zinc-500 uppercase mt-0.5">
                      {project.category} • {project.type}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-zinc-700 font-medium leading-relaxed">
                  {project.description}
                </p>

                {/* Impact Bullets */}
                {project.points.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-zinc-100">
                    {project.points.map((pt, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-zinc-800 flex items-start gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 border border-black" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-zinc-100 border border-black text-xs font-bold text-black"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action Links */}
            <div className="p-5 border-t-2 border-black bg-zinc-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-yellow-300 border-2 border-black text-sm font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black text-sm font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <FaGithub className="size-3.5" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
