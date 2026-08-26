// src/components/admin/LinkModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createSocialLink, updateSocialLink } from "@/actions/linkActions";
import { IconPicker } from "@/components/admin/IconPicker";
import { X, Save, Star } from "lucide-react";

export interface SocialLinkType {
  id: string;
  title: string;
  url: string;
  iconKey: string;
  isPrimary: boolean;
  order: number;
}

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkToEdit?: SocialLinkType | null;
}

export function LinkModal({ isOpen, onClose, linkToEdit }: LinkModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    iconKey: "SiGithub",
    isPrimary: false,
    order: 0,
  });

  useEffect(() => {
    if (linkToEdit) {
      setFormData({
        title: linkToEdit.title,
        url: linkToEdit.url,
        iconKey: linkToEdit.iconKey || "globe",
        isPrimary: linkToEdit.isPrimary,
        order: linkToEdit.order,
      });
    } else {
      setFormData({
        title: "",
        url: "",
        iconKey: "SiGithub",
        isPrimary: false,
        order: 0,
      });
    }
    setErrorMsg(null);
  }, [linkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);

    const payload = {
      title: formData.title.trim(),
      url: formData.url.trim(),
      iconKey: formData.iconKey.trim(),
      isPrimary: formData.isPrimary,
      order: Number(formData.order),
    };

    let res;
    if (linkToEdit) {
      res = await updateSocialLink(linkToEdit.id, payload);
    } else {
      res = await createSocialLink(payload);
    }

    setIsPending(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to save link.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] font-mono my-8">
        {/* Retro Header */}
        <div className="p-3 bg-purple-300 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 border border-black rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 border border-black rounded-full" />
            <div className="w-3 h-3 bg-green-500 border border-black rounded-full" />
            <span className="text-xs font-black uppercase text-black ml-2">
              {linkToEdit
                ? `EDIT_LINK :: ${linkToEdit.title}`
                : "NEW_UNIVERSAL_LINK"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-black bg-white hover:bg-red-400 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-2 border-2 border-black bg-red-300 text-black text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Title & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Link Title / Label *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. GitHub, LeetCode, Resume"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-purple-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Target URL / Destination *
            </label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://... or mailto:you@domain.com or /resume.pdf"
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-purple-50 focus:outline-none"
            />
          </div>

          {/* Searchable Icon Picker */}
          <IconPicker
            value={formData.iconKey}
            onChange={(key) => setFormData({ ...formData, iconKey: key })}
            label="Select Icon Representation"
          />

          {/* Primary CTA Toggle */}
          <div className="flex items-start gap-2 pt-1 p-3 border-2 border-black bg-purple-50">
            <input
              type="checkbox"
              id="primaryLinkCheckbox"
              checked={formData.isPrimary}
              onChange={(e) =>
                setFormData({ ...formData, isPrimary: e.target.checked })
              }
              className="size-4 mt-0.5 border-2 border-black rounded-none text-black focus:ring-0 cursor-pointer"
            />
            <div>
              <label
                htmlFor="primaryLinkCheckbox"
                className="text-xs font-black uppercase text-black select-none cursor-pointer flex items-center gap-1.5"
              >
                <Star className="size-3 fill-black text-black" />
                <span>Set as Primary Action Button</span>
              </label>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                Primary links render as prominent high-contrast buttons (e.g.
                Hero Resume Download) instead of standard icon pills.
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-purple-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>
              {isPending
                ? "Persisting Record..."
                : linkToEdit
                  ? "Update Link Record"
                  : "Create Link Record"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
