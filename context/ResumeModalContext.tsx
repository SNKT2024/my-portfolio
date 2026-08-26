// src/context/ResumeModalContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, Download, ExternalLink, Terminal, Loader2 } from "lucide-react";

interface ResumeModalContextType {
  openResume: (url?: string) => void;
  closeResume: () => void;
}

const ResumeModalContext = createContext<ResumeModalContextType | undefined>(
  undefined,
);

export function ResumeModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        typeof window !== "undefined" ? window.navigator.userAgent : "";
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openResume = (url?: string) => {
    if (url) setResumeUrl(url);
    setIsLoadingIframe(true);
    setIsOpen(true);
  };

  const closeResume = () => {
    setIsOpen(false);
  };

  // Convert to absolute URL for Google Docs Viewer
  const getAbsoluteUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return url;
  };

  const absolutePdfUrl = getAbsoluteUrl(resumeUrl);

  // Mobile uses Google Docs Embedded Viewer, Desktop uses native PDF stream
  const embedSourceUrl = isMobile
    ? `https://docs.google.com/gview?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`
    : `${resumeUrl}#toolbar=0&navpanes=0`;

  // Programmatic Blob download
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsDownloading(true);
      const res = await fetch(resumeUrl);
      if (!res.ok) throw new Error("Failed to fetch PDF binary");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Sanket_Kumbhar_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Direct download failed, opening in new tab:", err);
      window.open(resumeUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeResume();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <ResumeModalContext.Provider value={{ openResume, closeResume }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-6 font-mono animate-in fade-in duration-150"
          onClick={closeResume}
        >
          <div
            className="w-full max-w-4xl h-[92vh] sm:h-[85vh] flex flex-col border-2 border-black dark:border-white bg-white dark:bg-zinc-950 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-yellow-300 dark:bg-yellow-400 border-b-2 border-black dark:border-white text-black shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="hidden sm:flex items-center gap-1.5 mr-1 shrink-0">
                  <span className="size-2.5 rounded-full bg-red-500 border border-black" />
                  <span className="size-2.5 rounded-full bg-yellow-500 border border-black" />
                  <span className="size-2.5 rounded-full bg-green-500 border border-black" />
                </div>
                <Terminal className="size-4 stroke-[2.5] shrink-0" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider truncate">
                  [ RESUME.PDF {isMobile ? "• MOBILE_VIEW" : ""} ]
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1 px-2 py-1 bg-white border-2 border-black text-[10px] sm:text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  title="Download PDF directly"
                >
                  {isDownloading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Download className="size-3" />
                  )}
                  <span>{isDownloading ? "..." : "Save"}</span>
                </button>

                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-cyan-300 border-2 border-black text-[10px] sm:text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  title="Open in new tab"
                >
                  <ExternalLink className="size-3" />
                  <span className="hidden sm:inline">Tab</span>
                </a>

                <button
                  type="button"
                  onClick={closeResume}
                  className="p-1 border-2 border-black bg-red-400 hover:bg-red-300 text-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-900 p-1 sm:p-2 overflow-hidden relative">
              {isLoadingIframe && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 z-10 space-y-2">
                  <Loader2 className="size-6 animate-spin text-black dark:text-white" />
                  <p className="text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                    Loading PDF Stream...
                  </p>
                </div>
              )}

              <iframe
                src={embedSourceUrl}
                title="Resume Preview"
                className="w-full h-full border-2 border-black dark:border-white bg-white"
                onLoad={() => setIsLoadingIframe(false)}
              />
            </div>

            {/* Window Footer */}
            <div className="px-3 py-1 border-t-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase shrink-0">
              <span>STATUS: ONLINE</span>
              <span>PINCH / SCROLL TO ZOOM</span>
            </div>
          </div>
        </div>
      )}
    </ResumeModalContext.Provider>
  );
}

export function useResumeModal() {
  const context = useContext(ResumeModalContext);
  if (!context) {
    throw new Error("useResumeModal must be used within a ResumeModalProvider");
  }
  return context;
}
