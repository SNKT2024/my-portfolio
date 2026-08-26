// src/components/portfolio/AboutSection.tsx
import { AboutSection as AboutSectionType } from "@/app/generated/prisma/client";

interface AboutSectionProps {
  aboutData: AboutSectionType | null;
}

export function AboutSection({ aboutData }: AboutSectionProps) {
  const stats = (aboutData?.stats as { label: string; value: string }[]) || [];
  const highlights = (aboutData?.highlights as string[]) || [];
  const backgroundSummary =
    aboutData?.background &&
    typeof aboutData.background === "object" &&
    aboutData.background !== null &&
    "summary" in aboutData.background &&
    typeof aboutData.background.summary === "string"
      ? aboutData.background.summary
      : "Full-stack software engineer specialized in designing performant web platforms, maintainable data structures, and optimized server architectures.";

  return (
    <section id="about" className="space-y-8">
      <div className="flex items-center gap-2">
        <span className="bg-cyan-300 border-2 border-black px-2.5 py-1 text-sm font-black uppercase shadow-[2px_2px_0px_0px_#000]">
          SECTION_01
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          {aboutData?.heading || "About & Technical Overview"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Bio Card */}
        <div className="lg:col-span-2 border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_0px_#000] space-y-5">
          <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2 bg-cyan-100 -mx-6 -mt-6 p-4 sm:-mx-7 sm:-mt-7 sm:p-5">
            Core Narrative
          </h3>
          <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-medium">
            {backgroundSummary}
          </p>

          {highlights.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <span className="text-sm font-black uppercase text-black block">
                Specializations & Highlights:
              </span>
              <ul className="space-y-1.5">
                {highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-zinc-800 flex items-start gap-2"
                  >
                    <span className="size-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 border border-black" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Performance Stats Grid */}
        <div className="border-2 border-black bg-white p-6 sm:p-7 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-5">
          <h3 className="text-sm font-black uppercase tracking-wider border-b-2 border-black pb-2 bg-yellow-100 -mx-6 -mt-6 p-4 sm:-mx-7 sm:-mt-7 sm:p-5">
            By The Numbers
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-3xl font-black text-black">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase text-zinc-600 mt-1 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-2 border-black bg-emerald-100 text-sm font-bold">
            ⚡ Ready for full-stack engineering roles & high-scale builds.
          </div>
        </div>
      </div>
    </section>
  );
}
