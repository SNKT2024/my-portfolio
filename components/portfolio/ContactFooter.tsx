// src/components/portfolio/ContactFooter.tsx
"use client";
import {
  SocialLink,
  HeroSection as HeroSectionType,
} from "@/app/generated/prisma/client";
import { DynamicIcon } from "../admin/DynamicIcon";
import { useResumeModal } from "@/context/ResumeModalContext";
interface ContactFooterProps {
  socialLinks: SocialLink[];
  heroData: HeroSectionType | null;
}

export function ContactFooter({ socialLinks, heroData }: ContactFooterProps) {
  const { openResume } = useResumeModal();
  return (
    <section id="contact" className="pt-10">
      <div className="border-2 border-black bg-yellow-300 p-10 sm:p-14 shadow-[6px_6px_0px_0px_#000] text-center space-y-7">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-black tracking-tight">
            Let&apos;s Build Something Resilient.
          </h2>
          <p className="text-sm sm:text-base font-bold text-black uppercase">
            Open to software engineering opportunities and meaningful
            collaborations.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {socialLinks.map((link) => {
            const isResume =
              link.title.toLowerCase().includes("resume") ||
              link.title.toLowerCase().includes("cv") ||
              link.iconKey?.toLowerCase().includes("resume") ||
              link.iconKey?.toLowerCase().includes("file") ||
              link.url.toLowerCase().endsWith(".pdf");

            const buttonStyles =
              "flex items-center gap-2 px-5 py-3 bg-white text-black text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-black hover:text-white hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer";

            if (isResume) {
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => openResume(link.url)}
                  className={buttonStyles}
                  title="View Resume in Modal"
                >
                  <DynamicIcon iconKey={link.iconKey} className="size-4" />
                  <span>{link.title}</span>
                </button>
              );
            }

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles}
              >
                <DynamicIcon iconKey={link.iconKey} className="size-4" />
                <span>{link.title}</span>
              </a>
            );
          })}
        </div>

        <div className="pt-6 border-t-2 border-black text-xs sm:text-sm font-bold text-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()}{" "}
            {heroData?.name || "Developer Portfolio"}. All rights reserved.
          </span>
          <span className="bg-black text-white px-2.5 py-1 uppercase text-xs">
            BUILT_WITH_NEXTJS_15 + PRISMA
          </span>
        </div>
      </div>
    </section>
  );
}
