// src/components/portfolio/HeroSection.tsx
"use client";
import {
  HeroSection as HeroSectionType,
  AboutSection as AboutSectionType,
  SocialLink,
} from "@/app/generated/prisma/client";
import Image from "next/image";
import { ArrowRightIcon, FileText, MapPin } from "lucide-react";
import { DynamicIcon } from "../admin/DynamicIcon";
import { useResumeModal } from "@/context/ResumeModalContext";

interface HeroSectionProps {
  heroData: HeroSectionType | null;
  aboutData: AboutSectionType | null;
  socialLinks: SocialLink[];
}

export function HeroSection({
  heroData,
  aboutData,
  socialLinks,
}: HeroSectionProps) {
  const regularLinks = socialLinks?.filter((link) => !link.isPrimary) || [];

  const { openResume } = useResumeModal();

  return (
    <section id="hero" className="space-y-6">
      <div className="border-2 border-black bg-white p-6 sm:p-12 lg:p-14 shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        {/* Top Badge Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4 mb-6">
          <span className="inline-flex max-w-full items-center gap-2 px-2.5 py-1.5 bg-yellow-300 text-black border-2 border-black text-[10px] leading-tight font-black uppercase shadow-[2px_2px_0px_0px_#000] whitespace-normal break-words sm:px-3 sm:py-1 sm:text-xs !text-black">
            {heroData?.statusBadge || "[ Available for Full-Time Roles 🟢 ]"}
          </span>

          {aboutData?.location && (
            <span className="inline-flex items-center gap-1 text-[11px] leading-tight font-bold text-zinc-600 sm:text-xs">
              <MapPin className="size-3.5 text-black" />
              {aboutData.location}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-5 max-w-3xl">
            <div>
              <h3 className="font-light text-base sm:text-lg">
                HELLO I&apos;M
              </h3>
              <h1 className="text-[clamp(1.9rem,8vw,3.6rem)] font-black uppercase tracking-tight text-black break-words leading-[1.05]">
                {heroData?.name || "Sanket Kumbhar"}
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-bold text-zinc-600 uppercase tracking-wide mt-1 leading-tight">
                {heroData?.role || "Full Stack Software Engineer"}
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-800 leading-relaxed font-medium">
              {heroData?.tagline ||
                "Building scalable full stack applications with clean, intuitive user interfaces and maintainable architecture."}
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {heroData?.primaryCtaUrl && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-yellow-300 !text-black text-[11px] sm:text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  onClick={() => openResume(heroData.primaryCtaUrl)}
                >
                  <span>{heroData.primaryCtaText || "View Resume"}</span>
                  <FileText className="size-4" />
                </a>
              )}

              {heroData?.secondaryCtaUrl && (
                <a
                  href={heroData.secondaryCtaUrl}
                  className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white text-black text-[11px] sm:text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <span>{heroData.secondaryCtaText || "Explore Projects"}</span>
                  <ArrowRightIcon className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Avatar Frame */}
          {heroData?.avatarUrl && (
            <div className="w-full max-w-[22rem] shrink-0 self-center md:w-72 md:max-w-none md:self-auto lg:w-96">
              <div className="relative">
                <Image
                  src={heroData.avatarUrl}
                  alt={heroData.name}
                  width={640}
                  height={640}
                  priority
                  fetchPriority="high"
                  className="aspect-square size-full object-cover border-2 border-black shadow-[5px_5px_0px_0px_#000] bg-yellow-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Universal Social Strip */}
        {regularLinks.length > 0 && (
          <div className="flex flex-row lg:flex-row lg:items-center flex-wrap items-start gap-2 pt-6 mt-6 border-t-2 border-black">
            <span className="hidden lg:block text-[11px] font-black uppercase text-zinc-500 mr-2 ">
              Find me on:
            </span>
            {regularLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border-2 border-black text-xs font-bold hover:bg-yellow-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <DynamicIcon iconKey={link.iconKey} className="size-3.5" />
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
