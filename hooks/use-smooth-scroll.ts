"use client";

import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // If default behavior is already prevented, do nothing
      if (e.defaultPrevented) return;

      // Find the nearest anchor element
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      // Check if it's an internal hash link
      if (href && href.startsWith("#") && href.length > 1) {
        const targetElement = document.querySelector<HTMLElement>(href);

        if (targetElement) {
          e.preventDefault();

          // Get the sticky navbar height
          const navbar = document.getElementById("portfolio-navbar");
          const navHeight = navbar?.offsetHeight ?? 0;

          // Calculate correct scroll position with offset
          const y =
            targetElement.getBoundingClientRect().top +
            window.scrollY -
            navHeight -
            12;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });

          // Update browser URL hash without jump
          window.history.pushState(null, "", href);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
}
