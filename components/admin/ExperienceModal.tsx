// src/components/admin/ExperienceModal.tsx
"use client";

import { useState, useEffect } from "react";
import { createExperience, updateExperience } from "@/actions/journeyAction";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Experience } from "@/app/generated/prisma/client";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: Experience | null;
}

export function ExperienceModal({
  isOpen,
  onClose,
  itemToEdit,
}: ExperienceModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "COMPLETED" as "CURRENT" | "COMPLETED",
    description: "",
    order: 0,
    points: [""],
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        role: itemToEdit.role,
        company: itemToEdit.company,
        location: itemToEdit.location || "",
        startDate: itemToEdit.startDate,
        endDate: itemToEdit.endDate || "",
        status: itemToEdit.status as "CURRENT" | "COMPLETED",
        description: itemToEdit.description,
        order: itemToEdit.order,
        points: itemToEdit.points.length > 0 ? itemToEdit.points : [""],
      });
    } else {
      setFormData({
        role: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        status: "COMPLETED",
        description: "",
        order: 0,
        points: [""],
      });
    }
    setErrorMsg(null);
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const addPoint = () =>
    setFormData((prev) => ({ ...prev, points: [...prev.points, ""] }));
  const updatePoint = (index: number, val: string) => {
    const updated = [...formData.points];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, points: updated }));
  };
  const removePoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);

    const cleanPoints = formData.points
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const payload = {
      role: formData.role,
      company: formData.company,
      location: formData.location || null,
      startDate: formData.startDate,
      endDate:
        formData.status === "CURRENT" ? "Present" : formData.endDate || null,
      status: formData.status,
      description: formData.description,
      points: cleanPoints,
      order: Number(formData.order),
    };

    let res;
    if (itemToEdit) {
      res = await updateExperience(itemToEdit.id, payload);
    } else {
      res = await createExperience(payload);
    }

    setIsPending(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to save experience entry.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] font-mono my-8">
        <div className="p-3 bg-lime-300 border-b-2 border-black flex items-center justify-between">
          <span className="text-xs font-black uppercase text-black">
            {itemToEdit
              ? `EDIT_EXPERIENCE :: ${itemToEdit.company}`
              : "NEW_EXPERIENCE_RECORD"}
          </span>
          <button
            onClick={onClose}
            className="p-1 border border-black bg-white hover:bg-red-400 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {errorMsg && (
            <div className="p-2 border-2 border-black bg-red-300 text-black text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Job Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. Full Stack Developer"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-lime-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g. iGAP Technologies"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-lime-50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. Remote / Kolhapur"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Start Date *
              </label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                placeholder="e.g. June 2024"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                End Date
              </label>
              <input
                type="text"
                disabled={formData.status === "CURRENT"}
                value={
                  formData.status === "CURRENT" ? "Present" : formData.endDate
                }
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                placeholder="e.g. Aug 2024"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none disabled:bg-zinc-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "CURRENT" | "COMPLETED",
                  })
                }
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-bold focus:outline-none"
              >
                <option value="COMPLETED">COMPLETED</option>
                <option value="CURRENT">CURRENT (Ongoing)</option>
              </select>
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

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Brief Summary / Overview *
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Overview of core responsibilities and technical domains..."
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Accomplishment Bullets */}
          <div className="border-2 border-black bg-zinc-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-black">
                Accomplishments & Contributions
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="flex items-center gap-1 px-2 py-0.5 bg-white text-black text-[11px] font-bold uppercase border border-black shadow-[1px_1px_0px_0px_#000] hover:bg-lime-300"
              >
                <Plus className="size-3" />
                <span>Add Bullet</span>
              </button>
            </div>

            {formData.points.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updatePoint(idx, e.target.value)}
                  placeholder={`Contribution #${idx + 1}`}
                  className="min-w-0 flex-1 border border-black bg-white p-1.5 text-xs font-medium focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removePoint(idx)}
                  className="p-1.5 border border-black bg-red-100 text-red-600 hover:bg-red-200 shrink-0"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 w-full py-3 bg-lime-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-lime-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>
              {isPending
                ? "Persisting Record..."
                : itemToEdit
                  ? "Update Experience Record"
                  : "Create Experience Record"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
