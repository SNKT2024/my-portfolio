// src/context/ResumeModalContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Terminal,
  Loader2,
} from "lucide-react";

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

  const openResume = (url?: string) => {
    if (url) setResumeUrl(url);
    setIsOpen(true);
  };

  const closeResume = () => {
    setIsOpen(false);
  };

  // Programmatic Blob download to bypass cross-origin browser PDF viewing
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
      console.error(
        "Direct download failed, falling back to window.open:",
        err,
      );
      window.open(resumeUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  // Close modal on Escape key press
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

      {/* Retro Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6 font-mono animate-in fade-in duration-150"
          onClick={closeResume}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] h-[85vh] flex flex-col border-2 border-black dark:border-white bg-white dark:bg-zinc-950 shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#fff] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Window Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-yellow-300 dark:bg-yellow-400 border-b-2 border-black dark:border-white text-black shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-1">
                  <span className="size-2.5 rounded-full bg-red-500 border border-black" />
                  <span className="size-2.5 rounded-full bg-yellow-500 border border-black" />
                  <span className="size-2.5 rounded-full bg-green-500 border border-black" />
                </div>
                <Terminal className="size-4 stroke-[2.5]" />
                <span className="text-xs font-black uppercase tracking-wider truncate">
                  [ RESUME_VIEWER.PDF ]
                </span>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-2">
                {/* Forced File Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-black text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:bg-zinc-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60 cursor-pointer"
                  title="Download PDF directly"
                >
                  {isDownloading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isDownloading ? "Saving..." : "Download"}
                  </span>
                </button>

                {/* Open in New Tab Button */}
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-300 border-2 border-black text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  title="Open in new browser tab"
                >
                  <ExternalLink className="size-3.5" />
                  <span className="hidden sm:inline">Open Tab</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeResume}
                  className="p-1 border-2 border-black bg-red-400 hover:bg-red-300 text-black shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                  aria-label="Close Window"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Scrollable PDF Viewer Frame */}
            <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-900 p-2 overflow-hidden flex flex-col">
              <object
                data={`${resumeUrl}#toolbar=0&navpanes=0`}
                type="application/pdf"
                className="w-full h-full border-2 border-black dark:border-white bg-white"
              >
                <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
                  <FileText className="size-12 text-zinc-400" />
                  <p className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300">
                    PDF preview is not supported on this device.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="px-4 py-2 bg-yellow-300 border-2 border-black text-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]"
                    >
                      Download Resume
                    </button>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-cyan-300 border-2 border-black text-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              </object>
            </div>

            {/* Status Bar */}
            <div className="px-3 py-1.5 border-t-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase shrink-0">
              <span>STATUS: READY</span>
              <span>ESC / CLICK OUTSIDE TO CLOSE</span>
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
