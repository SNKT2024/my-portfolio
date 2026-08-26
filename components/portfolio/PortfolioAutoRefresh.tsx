"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type PortfolioAutoRefreshProps = {
  intervalMs?: number;
};

export function PortfolioAutoRefresh({
  intervalMs = 30000,
}: PortfolioAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      router.refresh();
    };

    const onFocus = () => refresh();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, intervalMs);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [intervalMs, router]);

  return null;
}
