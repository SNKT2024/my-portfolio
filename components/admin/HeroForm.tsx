// src/components/admin/HeroForm.tsx
"use client";

import { useState } from "react";
import { updateHeroSection } from "@/actions/heroActions";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { getUploadedFileUrl, UploadButton } from "@/lib/uploadthing";

interface HeroFormProps {
  initialData: any;
}

export function HeroForm({ initialData }: HeroFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [uploading, setUploading] = useState<"avatar" | "resume" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [heroState, setHeroState] = useState({
    name: initialData?.name || "Sanket Kumbhar",
    role: initialData?.role || "Full Stack Developer",
    tagline: initialData?.tagline || "",
    statusBadge:
      initialData?.statusBadge || "[ Available for Full-Time Roles 🟢 ]",
    primaryCtaText: initialData?.primaryCtaText || "View / Download Resume",
    primaryCtaUrl: initialData?.primaryCtaUrl || "/resume.pdf",
    secondaryCtaText: initialData?.secondaryCtaText || "Explore Projects",
    secondaryCtaUrl: initialData?.secondaryCtaUrl || "#projects",
    avatarUrl: initialData?.avatarUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setFeedback(null);

    const res = await updateHeroSection(heroState);
    setIsPending(false);

    if (res.success) {
      setFeedback({
        type: "success",
        msg: "Hero section successfully updated!",
      });
    } else {
      setFeedback({
        type: "error",
        msg: res.error || "Failed to update Hero section.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono">
      {feedback && (
        <div
          className={`p-3.5 border-2 border-black flex items-center gap-3 text-xs font-bold shadow-[2px_2px_0px_0px_#000] ${
            feedback.type === "success"
              ? "bg-emerald-300 text-black"
              : "bg-red-300 text-black"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Identity Details */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-5">
        <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-2 bg-yellow-100 -mx-6 -mt-6 p-4">
          1. Hero Profile & Identity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={heroState.name}
              onChange={(e) =>
                setHeroState({ ...heroState, name: e.target.value })
              }
              required
              className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Primary Role / Title
            </label>
            <input
              type="text"
              value={heroState.role}
              onChange={(e) =>
                setHeroState({ ...heroState, role: e.target.value })
              }
              required
              className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-black mb-1">
            Status Badge Text
          </label>
          <input
            type="text"
            value={heroState.statusBadge}
            onChange={(e) =>
              setHeroState({ ...heroState, statusBadge: e.target.value })
            }
            className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-black mb-1">
            Tagline / Mission Pitch
          </label>
          <textarea
            value={heroState.tagline}
            onChange={(e) =>
              setHeroState({ ...heroState, tagline: e.target.value })
            }
            rows={3}
            required
            className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <label className="block text-xs font-bold uppercase text-black">
              Hero Avatar Image URL
            </label>
            <UploadButton
              endpoint="projectImage"
              onUploadBegin={() => {
                setUploading("avatar");
                setUploadProgress(0);
                setFeedback(null);
              }}
              onUploadProgress={setUploadProgress}
              onClientUploadComplete={(res) => {
                setUploading(null);
                const url = getUploadedFileUrl(res?.[0]);
                if (!url) {
                  setFeedback({
                    type: "error",
                    msg: "Upload completed without an image URL.",
                  });
                  return;
                }
                setHeroState((prev) => ({ ...prev, avatarUrl: url }));
                setFeedback({ type: "success", msg: "Avatar image uploaded." });
              }}
              onUploadError={(error) => {
                setUploading(null);
                setFeedback({
                  type: "error",
                  msg: `Image upload failed: ${error.message}`,
                });
              }}
              appearance={{
                button:
                  "border-2 border-black bg-cyan-300 px-2 py-1 text-[10px] font-black uppercase text-black",
                allowedContent: "text-[10px] text-zinc-600",
              }}
              content={{ button: "Upload Image" }}
            />
          </div>
          {uploading === "avatar" && (
            <p className="flex items-center gap-1 text-[10px] font-bold text-cyan-700">
              <Loader2 className="size-3 animate-spin" /> Uploading image...{" "}
              {uploadProgress}%
            </p>
          )}
          <input
            type="text"
            value={heroState.avatarUrl}
            onChange={(e) =>
              setHeroState({ ...heroState, avatarUrl: e.target.value })
            }
            placeholder="https://..."
            className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
          />
          {heroState.avatarUrl && (
            <p className="mt-1 truncate text-[10px] text-zinc-500">
              Uploaded: {heroState.avatarUrl}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-5">
        <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-2 bg-yellow-100 -mx-6 -mt-6 p-4">
          2. Call-to-Action Buttons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border-2 border-black bg-emerald-50 space-y-3 shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-2">
              <FileText className="size-4" />
              <span className="text-xs font-black uppercase">
                Primary Action (Resume)
              </span>
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={heroState.primaryCtaText}
                onChange={(e) =>
                  setHeroState({ ...heroState, primaryCtaText: e.target.value })
                }
                className="w-full border-2 border-black bg-white p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 mb-1">
                <label className="block text-xs font-bold text-black">
                  Target URL / File Path
                </label>
                <UploadButton
                  endpoint="resumeUploader"
                  onUploadBegin={() => {
                    setUploading("resume");
                    setUploadProgress(0);
                    setFeedback(null);
                  }}
                  onUploadProgress={setUploadProgress}
                  onClientUploadComplete={(res) => {
                    setUploading(null);
                    const url = getUploadedFileUrl(res?.[0]);
                    if (!url) {
                      setFeedback({
                        type: "error",
                        msg: "Upload completed without a resume URL.",
                      });
                      return;
                    }
                    setHeroState((prev) => ({ ...prev, primaryCtaUrl: url }));
                    setFeedback({ type: "success", msg: "Resume uploaded." });
                  }}
                  onUploadError={(error) => {
                    setUploading(null);
                    setFeedback({
                      type: "error",
                      msg: `Resume upload failed: ${error.message}`,
                    });
                  }}
                  appearance={{
                    button:
                      "border-2 border-black bg-emerald-300 px-2 py-1 text-[10px] font-black uppercase text-black",
                    allowedContent: "text-[10px] text-zinc-600",
                  }}
                  content={{ button: "Upload Resume" }}
                />
              </div>
              {uploading === "resume" && (
                <p className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <Loader2 className="size-3 animate-spin" /> Uploading
                  resume... {uploadProgress}%
                </p>
              )}
              <input
                type="text"
                value={heroState.primaryCtaUrl}
                onChange={(e) =>
                  setHeroState({ ...heroState, primaryCtaUrl: e.target.value })
                }
                className="w-full border-2 border-black bg-white p-2 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 border-2 border-black bg-zinc-50 space-y-3 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-xs font-black uppercase">
              Secondary Action (Projects)
            </span>
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={heroState.secondaryCtaText}
                onChange={(e) =>
                  setHeroState({
                    ...heroState,
                    secondaryCtaText: e.target.value,
                  })
                }
                className="w-full border-2 border-black bg-white p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                Target URL
              </label>
              <input
                type="text"
                value={heroState.secondaryCtaUrl}
                onChange={(e) =>
                  setHeroState({
                    ...heroState,
                    secondaryCtaUrl: e.target.value,
                  })
                }
                className="w-full border-2 border-black bg-white p-2 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || uploading !== null}
        className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
      >
        <Save className="size-4" />
        <span>
          {isPending ? "Persisting Changes..." : "Save Hero Configuration"}
        </span>
      </button>
    </form>
  );
}
