// src/components/admin/SkillModals.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import {
  createSkillCategory,
  updateSkillCategory,
  createSkill,
  updateSkill,
} from "@/actions/skillActions";
import { IconPicker } from "@/components/admin/IconPicker";

// --------------------------------------------------------
// CATEGORY MODAL
// --------------------------------------------------------
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: { id: string; name: string; order: number } | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setOrder(categoryToEdit.order);
    } else {
      setName("");
      setOrder(0);
    }
    setErrorMsg(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);

    let res;
    if (categoryToEdit) {
      res = await updateSkillCategory(categoryToEdit.id, name, order);
    } else {
      res = await createSkillCategory(name, order);
    }

    setIsPending(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to save category.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] font-mono">
        <div className="p-3 bg-pink-300 border-b-2 border-black flex items-center justify-between">
          <span className="text-xs font-black uppercase text-black">
            {categoryToEdit ? "EDIT_CATEGORY" : "NEW_SKILL_CATEGORY"}
          </span>
          <button
            onClick={onClose}
            className="p-1 border border-black bg-white hover:bg-red-300 transition"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-2 border-2 border-black bg-red-300 text-black text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Category Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Development"
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-pink-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Sort Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-pink-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-pink-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="size-3.5" />
            <span>{isPending ? "Persisting..." : "Save Category"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// SKILL MODAL
// --------------------------------------------------------
interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  skillToEdit?: {
    id: string;
    name: string;
    iconKey?: string | null;
    order: number;
  } | null;
}

export function SkillModal({
  isOpen,
  onClose,
  categoryId,
  skillToEdit,
}: SkillModalProps) {
  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState("");
  const [order, setOrder] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setIconKey(skillToEdit.iconKey || "");
      setOrder(skillToEdit.order);
    } else {
      setName("");
      setIconKey("");
      setOrder(0);
    }
    setErrorMsg(null);
  }, [skillToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);

    let res;
    if (skillToEdit) {
      res = await updateSkill(skillToEdit.id, {
        name,
        familiarity: "CORE",
        iconKey: iconKey || null,
        order,
      });
    } else {
      res = await createSkill({
        name,
        categoryId,
        familiarity: "CORE",
        iconKey: iconKey || null,
        order,
      });
    }

    setIsPending(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to save skill badge.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] font-mono">
        <div className="p-3 bg-yellow-300 border-b-2 border-black flex items-center justify-between">
          <span className="text-xs font-black uppercase text-black">
            {skillToEdit
              ? `EDIT_SKILL :: ${skillToEdit.name}`
              : "ADD_SKILL_BADGE"}
          </span>
          <button
            onClick={onClose}
            className="p-1 border border-black bg-white hover:bg-red-300 transition"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-2 border-2 border-black bg-red-300 text-black text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js, PostgreSQL, C++"
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          <IconPicker
            value={iconKey}
            onChange={setIconKey}
            label="Icon (Optional)"
          />

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="size-3.5" />
            <span>{isPending ? "Persisting..." : "Save Skill Badge"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
