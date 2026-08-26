// src/components/admin/AboutForm.tsx
"use client";

import { useState } from "react";
import { updateAboutSection } from "@/actions/aboutActions";
import { Plus, Trash2, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface AboutFormProps {
  initialData: any;
}

export function AboutForm({ initialData }: AboutFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [aboutState, setAboutState] = useState({
    heading: initialData?.heading || "About Me",
    location: initialData?.location || "Kolhapur, Maharashtra, India",
    avatarUrl: initialData?.avatarUrl || "",
    backgroundSummary: initialData?.background?.summary || "",
    passions: (initialData?.background?.passions as string[]) || [
      "System Architecture",
      "Open Source",
    ],
    highlights: (initialData?.highlights as string[]) || [""],
    stats: (initialData?.stats as { label: string; value: string }[]) || [
      { label: "DSA Solved", value: "350+" },
      { label: "Projects Completed", value: "8+" },
    ],
  });

  // Array Handlers
  const addHighlight = () =>
    setAboutState((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  const updateHighlight = (idx: number, val: string) => {
    const updated = [...aboutState.highlights];
    updated[idx] = val;
    setAboutState((prev) => ({ ...prev, highlights: updated }));
  };
  const removeHighlight = (idx: number) => {
    setAboutState((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const addStat = () =>
    setAboutState((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "", value: "" }],
    }));
  const updateStat = (idx: number, field: "label" | "value", val: string) => {
    const updated = [...aboutState.stats];
    updated[idx][field] = val;
    setAboutState((prev) => ({ ...prev, stats: updated }));
  };
  const removeStat = (idx: number) => {
    setAboutState((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setFeedback(null);

    const res = await updateAboutSection({
      heading: aboutState.heading,
      location: aboutState.location,
      avatarUrl: aboutState.avatarUrl,
      stats: aboutState.stats,
      background: {
        summary: aboutState.backgroundSummary,
        passions: aboutState.passions,
      },
      highlights: aboutState.highlights.filter((h) => h.trim().length > 0),
    });
    setIsPending(false);

    if (res.success) {
      setFeedback({
        type: "success",
        msg: "About section successfully updated!",
      });
    } else {
      setFeedback({
        type: "error",
        msg: res.error || "Failed to update About section.",
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

      {/* Bio Narrative */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-5">
        <h2 className="text-xs font-black uppercase tracking-wider border-b-2 border-black pb-2 bg-cyan-100 -mx-6 -mt-6 p-4">
          1. Bio & Core Narrative
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Heading Title
            </label>
            <input
              type="text"
              value={aboutState.heading}
              onChange={(e) =>
                setAboutState({ ...aboutState, heading: e.target.value })
              }
              className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Location Label
            </label>
            <input
              type="text"
              value={aboutState.location}
              onChange={(e) =>
                setAboutState({ ...aboutState, location: e.target.value })
              }
              className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-black mb-1">
            Bio Summary
          </label>
          <textarea
            value={aboutState.backgroundSummary}
            onChange={(e) =>
              setAboutState({
                ...aboutState,
                backgroundSummary: e.target.value,
              })
            }
            rows={4}
            className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-black mb-1">
            About Image URL
          </label>
          <input
            type="text"
            value={aboutState.avatarUrl}
            onChange={(e) =>
              setAboutState({ ...aboutState, avatarUrl: e.target.value })
            }
            placeholder="https://..."
            className="w-full border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 bg-cyan-100 -mx-6 -mt-6 p-4">
          <h2 className="text-xs font-black uppercase tracking-wider">
            2. Key Performance Metrics
          </h2>
          <button
            type="button"
            onClick={addStat}
            className="flex items-center gap-1 px-2.5 py-1 bg-white text-black text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-300 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Plus className="size-3.5" />
            <span>Add Metric</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {aboutState.stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center  gap-2 p-2 border-2 border-black bg-zinc-50 shadow-[2px_2px_0px_0px_#000]"
            >
              <input
                type="text"
                placeholder="Label (e.g. DSA Solved)"
                value={stat.label}
                onChange={(e) => updateStat(idx, "label", e.target.value)}
                className="min-w-3 flex-1 border-2 border-black bg-white p-1.5 text-xs font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Value (e.g. 350+)"
                value={stat.value}
                onChange={(e) => updateStat(idx, "value", e.target.value)}
                className="w-20 border-2 border-black bg-yellow-200 p-1.5 text-xs font-bold focus:outline-none text-center"
              />
              <button
                type="button"
                onClick={() => removeStat(idx)}
                className="p-1.5 text-red-600 hover:bg-red-100 border-2 border-black transition"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 bg-cyan-100 -mx-6 -mt-6 p-4">
          <h2 className="text-xs font-black uppercase tracking-wider">
            3. Specializations & Highlights
          </h2>
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center gap-1 px-2.5 py-1 bg-white text-black text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-300 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Plus className="size-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-2 pt-2">
          {aboutState.highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateHighlight(idx, e.target.value)}
                placeholder={`Highlight point #${idx + 1}`}
                className="flex-1 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-cyan-50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="p-2 border-2 border-black bg-red-100 text-red-600 hover:bg-red-200 shadow-[1px_1px_0px_0px_#000]"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full py-3 bg-cyan-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-cyan-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
      >
        <Save className="size-4" />
        <span>
          {isPending ? "Persisting Changes..." : "Save About Configuration"}
        </span>
      </button>
    </form>
  );
}
