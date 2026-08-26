// src/app/admin/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  FolderGit2,
  Sparkles,
  Milestone,
  Link2,
  ArrowUpRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [projectCount, skillCount, experienceCount, linkCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.socialLink.count(),
    ]);

  const STAT_CARDS = [
    {
      label: "Active Projects",
      count: projectCount,
      href: "/admin/projects",
      icon: FolderGit2,
      color: "bg-cyan-300",
    },
    {
      label: "Skills Listed",
      count: skillCount,
      href: "/admin/skills",
      icon: Sparkles,
      color: "bg-pink-300",
    },
    {
      label: "Timeline Milestones",
      count: experienceCount,
      href: "/admin/journey",
      icon: Milestone,
      color: "bg-lime-300",
    },
    {
      label: "Universal Links",
      count: linkCount,
      href: "/admin/links",
      icon: Link2,
      color: "bg-purple-300",
    },
  ];

  return (
    <div className="space-y-8 font-mono p-5">
      {/* Title Banner */}
      <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] mt-3">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black">
          System Control Center
        </h1>
        <p className="text-xs text-zinc-600 mt-1">
          Manage, update, and deploy live portfolio sections without codebase
          modifications.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`p-5 border-2 border-black ${card.color} shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-6 h-6 text-black" />
                <ArrowUpRight className="w-4 h-4 text-black" />
              </div>
              <div className="mt-6">
                <div className="text-3xl font-black text-black">
                  {card.count}
                </div>
                <div className="text-xs font-bold uppercase text-black mt-0.5">
                  {card.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
