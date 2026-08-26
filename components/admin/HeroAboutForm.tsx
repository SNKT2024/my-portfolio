// src/components/admin/HeroAboutForm.tsx
"use client";

import { useState } from "react";
import { Sparkles, UserCheck } from "lucide-react";
import { HeroForm } from "@/components/admin/HeroForm";
import { AboutForm } from "@/components/admin/AboutForm";

interface HeroAboutFormProps {
  initialHero: any;
  initialAbout: any;
}

export function HeroAboutForm({
  initialHero,
  initialAbout,
}: HeroAboutFormProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "about">("hero");

  return (
    <div className="space-y-6 font-mono">
      {/* Neo-brutalist Tab Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase border-2 border-black transition-all ${
            activeTab === "hero"
              ? "bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5"
              : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
          }`}
        >
          <Sparkles className="size-4" />
          <span>Hero Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase border-2 border-black transition-all ${
            activeTab === "about"
              ? "bg-cyan-300 text-black shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5"
              : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
          }`}
        >
          <UserCheck className="size-4" />
          <span>About & Metrics</span>
        </button>
      </div>

      {/* Conditional Sub-form Rendering */}
      {activeTab === "hero" ? (
        <HeroForm initialData={initialHero} />
      ) : (
        <AboutForm initialData={initialAbout} />
      )}
    </div>
  );
}
