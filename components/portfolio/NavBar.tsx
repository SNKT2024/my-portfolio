"use client";

import Link from "next/link";
import { useState } from "react";
import { Terminal, ArrowUpRight, Menu, X } from "lucide-react";
import { HeroSection as HeroSectionType } from "@/app/generated/prisma/client";
import { ThemeToggle } from "./ThemeToggle";

interface NavBarProps {
  heroData: HeroSectionType | null;
}

export function NavBar({ heroData }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      window.history.pushState(null, "", "/");
    }
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    setIsMenuOpen(false);

    const navbar = document.getElementById("portfolio-navbar");
    const navHeight = navbar?.offsetHeight ?? 0;
    const y =
      target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const navItems = [
    { label: "About", href: "#about", hoverColor: "hover:text-yellow-600" },
    { label: "Skills", href: "#skills", hoverColor: "hover:text-pink-600" },
    {
      label: "Projects",
      href: "#projects",
      hoverColor: "hover:text-cyan-600",
    },
    {
      label: "Journey",
      href: "#journey",
      hoverColor: "hover:text-lime-600",
    },
    {
      label: "Contact",
      href: "#contact",
      hoverColor: "hover:text-purple-600",
    },
  ];

  return (
    <header
      id="portfolio-navbar"
      className="sticky w-full top-0 z-40 bg-white/90 backdrop-blur border-b-2 border-black px-4 sm:px-8 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 border-black">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 border-2 border-black bg-yellow-300 px-2.5 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all dark:text-black"
        >
          <Terminal className="size-3.5" />
          <span>{heroData?.name ? heroData.name.split(" ")[0] : "DEV"}.OS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-xs font-bold uppercase rounded-0">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={`border-2 border-black bg-zinc-100 px-3 py-2 shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-300 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all dark:text-black`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {heroData?.primaryCtaUrl && (
            <a
              href={heroData.primaryCtaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-300 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all dark:text-black"
            >
              <span>Resume</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          )}

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            title={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden inline-flex size-9 items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-300 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            {isMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="md:hidden max-w-7xl mx-auto grid grid-cols-2 gap-2 pt-3 text-xs font-bold uppercase"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className={`border-2 border-black bg-zinc-100 px-3 py-2 shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-300 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
