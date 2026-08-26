// src/components/admin/IconPicker.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  DynamicIcon,
  PRESET_ICONS,
  resolveIconName,
} from "@/components/admin/DynamicIcon";
import { Search, X, Check, Sparkles, Loader2 } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
  label?: string;
}

export function IconPicker({
  value,
  onChange,
  label = "Select Icon Representation",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [apiResults, setApiResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Live Iconify API search with 300ms debounce
  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setApiResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(trimmed)}&limit=48`,
          { signal: controller.signal },
        );
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.icons)) {
            setApiResults(data.icons);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Icon search failed:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  // Combine preset matches and live API results
  const displayedIcons = useMemo(() => {
    if (search.trim()) {
      // Return live API results if search query exists
      if (apiResults.length > 0) {
        return apiResults.map((iconId) => ({
          key: iconId,
          label: iconId.split(":")[1]?.replace(/-/g, " ") || iconId,
          category: iconId.split(":")[0] || "Icon",
        }));
      }
      return [];
    }

    // Default: show curated presets
    return PRESET_ICONS.filter(
      (item) => activeCategory === "All" || item.category === activeCategory,
    );
  }, [search, apiResults, activeCategory]);

  const currentValue = resolveIconName(value || "globe");

  return (
    <div className="font-mono">
      <label className="block text-xs font-bold uppercase text-black mb-1.5">
        {label}
      </label>

      {/* Trigger Button & Preview */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-yellow-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex-1 min-w-0 text-left"
        >
          <div className="size-6 border border-black bg-white flex items-center justify-center shrink-0">
            <DynamicIcon iconKey={value} className="size-4" />
          </div>
          <span className="text-xs font-bold truncate text-black">
            {value ? value : "Choose Icon..."}
          </span>
        </button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Slug (e.g. rust, postgresql)"
          className="w-48 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none text-black"
        />
      </div>

      {/* Live Search Engine Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] my-6">
            {/* Modal Header */}
            <div className="p-3 bg-yellow-300 border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-black" />
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  ICON_SEARCH_ENGINE (200,000+ ICONS)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 border border-black bg-white hover:bg-red-400 transition"
              >
                <X className="size-3.5 text-black" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 border-b-2 border-black bg-zinc-50 space-y-3">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type any tool, framework or logo (e.g. rust, docker, supabase)..."
                  className="w-full pl-9 pr-9 py-2 border-2 border-black bg-white text-xs font-medium focus:bg-yellow-50 focus:outline-none text-black"
                  autoFocus
                />
                {isLoading && (
                  <Loader2 className="size-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-500" />
                )}
              </div>

              {!search && (
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Tech", "Social", "Lucide"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 text-[10px] font-black uppercase border border-black transition-all ${
                        activeCategory === cat
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-yellow-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="p-4 max-h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {displayedIcons.map((item) => {
                const itemResolved = resolveIconName(item.key);
                const isSelected = currentValue === itemResolved;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      onChange(item.key);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 border border-black text-left transition-all ${
                      isSelected
                        ? "bg-yellow-300 font-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 text-black"
                        : "bg-zinc-50 text-black hover:bg-white hover:shadow-[1px_1px_0px_0px_#000]"
                    }`}
                  >
                    <div className="size-6 border border-black bg-white flex items-center justify-center shrink-0">
                      <DynamicIcon iconKey={item.key} className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate leading-tight capitalize">
                        {item.label}
                      </div>
                      <div className="text-[9px] text-zinc-500 truncate">
                        {item.category}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="size-3 text-black shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* No Results Fallback */}
            {search && displayedIcons.length === 0 && !isLoading && (
              <div className="p-4 text-center border-t border-zinc-200 bg-white">
                <p className="text-xs font-bold text-zinc-600 mb-2">
                  No preset matched &quot;{search}&quot;, but you can use it
                  directly:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(search);
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 bg-yellow-300 border-2 border-black text-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]"
                >
                  Use &quot;{search}&quot; Directly
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="p-3 border-t-2 border-black bg-zinc-50 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase">
              <span>Powered by Iconify Vector API</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-black text-white border border-black hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
