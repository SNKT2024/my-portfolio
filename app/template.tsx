"use client";

import { usePathname } from "next/navigation";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useSmoothScroll();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
