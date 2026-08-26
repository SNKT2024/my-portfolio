// src/app/admin/hero-about/page.tsx
import prisma from "@/lib/prisma";
import { HeroAboutForm } from "@/components/admin/HeroAboutForm";
import { Sparkles, Terminal } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HeroAboutAdminPage() {
  const [heroData, aboutData] = await Promise.all([
    prisma.heroSection.findFirst({ where: { id: 1 } }),
    prisma.aboutSection.findFirst({ where: { id: "about_singleton" } }),
  ]);

  return (
    <div className="space-y-6 font-mono p-5">
      {/* Title Banner */}
      <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase shadow-[1px_1px_0px_0px_#000]">
              MODULE_01
            </span>
            <h1 className="text-xl font-black uppercase tracking-tight text-black">
              Hero & About Configuration
            </h1>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Update personal branding, bio summaries, statistics, and resume
            references.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-emerald-100 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] self-start md:self-auto">
          <Terminal className="size-3.5 text-black" />
          <span>REALTIME_PERSISTENCE</span>
        </div>
      </div>

      {/* Editor Form Component */}
      <HeroAboutForm initialHero={heroData} initialAbout={aboutData} />
    </div>
  );
}
