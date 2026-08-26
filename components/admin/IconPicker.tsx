// src/components/admin/IconPicker.tsx
"use client";

import { useState, useMemo } from "react";
import {
  DynamicIcon,
  AVAILABLE_ICONS,
  ICON_CATALOG,
  IconCatalogCategory,
} from "@/components/admin/DynamicIcon";
import { Search, X, Check, Sparkles } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
  label?: string;
}

const CATEGORIES: IconCatalogCategory[] = [
  "All",
  "Lucide",
  "Simple Icons",
  "Font Awesome",
];

export function IconPicker({
  value,
  onChange,
  label = "Select Icon Representation",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<IconCatalogCategory>("All");

  const filteredIcons = useMemo(() => {
    const sourceIcons =
      search || activeCategory !== "All" ? ICON_CATALOG : AVAILABLE_ICONS;

    return sourceIcons.filter((item) => {
      const matchesSearch =
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.key.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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
            <DynamicIcon iconKey={value} className="size-4" useBrandColor />
          </div>
          <span className="text-xs font-bold truncate">
            {value ? value : "Choose Icon..."}
          </span>
        </button>

        {/* Manual text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Custom key (e.g. SiGithub)"
          className="w-40 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
        />
      </div>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] my-6">
            <div className="p-3 bg-yellow-300 border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  ICON_SEARCH_ENGINE
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 border border-black bg-white hover:bg-red-400 transition"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="p-4 border-b-2 border-black bg-zinc-50 space-y-3">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search icons (e.g. github, react, resume, mail)..."
                  className="w-full pl-9 pr-3 py-2 border-2 border-black bg-white text-xs font-medium focus:bg-yellow-50 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
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
            </div>

            <div className="px-4 pt-3 text-[10px] font-bold uppercase text-zinc-500">
              {filteredIcons.length} icon{filteredIcons.length === 1 ? "" : "s"}{" "}
              found
            </div>

            <div className="p-4 max-h-64 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredIcons.map((item) => {
                const isSelected =
                  value.toLowerCase() === item.key.toLowerCase();

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
                        ? "bg-yellow-300 font-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5"
                        : "bg-zinc-50 hover:bg-white hover:shadow-[1px_1px_0px_0px_#000]"
                    }`}
                  >
                    <div className="size-6 border border-black bg-white flex items-center justify-center shrink-0">
                      <DynamicIcon
                        iconKey={item.key}
                        className="size-3.5"
                        useBrandColor
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate leading-tight">
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

            <div className="p-3 border-t-2 border-black bg-zinc-50 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase">
              <span>Supports Lucide and React Icons</span>
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
