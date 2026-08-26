// src/components/admin/EducationModal.tsx
"use client";

import { useState, useEffect } from "react";

import { createEducation, updateEducation } from "@/actions/journeyAction";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Education } from "@/app/generated/prisma/client";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: Education | null;
}

export function EducationModal({
  isOpen,
  onClose,
  itemToEdit,
}: EducationModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    location: "",
    startYear: "",
    endYear: "",
    grade: "",
    description: "",
    order: 0,
    points: [""],
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        degree: itemToEdit.degree,
        institution: itemToEdit.institution,
        location: itemToEdit.location || "",
        startYear: itemToEdit.startYear,
        endYear: itemToEdit.endYear,
        grade: itemToEdit.grade || "",
        description: itemToEdit.description,
        order: itemToEdit.order,
        points: itemToEdit.points.length > 0 ? itemToEdit.points : [""],
      });
    } else {
      setFormData({
        degree: "",
        institution: "",
        location: "",
        startYear: "",
        endYear: "",
        grade: "",
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
      degree: formData.degree,
      institution: formData.institution,
      location: formData.location || null,
      startYear: formData.startYear,
      endYear: formData.endYear,
      grade: formData.grade || null,
      description: formData.description,
      points: cleanPoints,
      order: Number(formData.order),
    };

    let res;
    if (itemToEdit) {
      res = await updateEducation(itemToEdit.id, payload);
    } else {
      res = await createEducation(payload);
    }

    setIsPending(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to save education entry.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] font-mono my-8">
        <div className="p-3 bg-purple-300 border-b-2 border-black flex items-center justify-between">
          <span className="text-xs font-black uppercase text-black">
            {itemToEdit
              ? `EDIT_EDUCATION :: ${itemToEdit.degree}`
              : "NEW_EDUCATION_RECORD"}
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
                Degree / Qualification *
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                placeholder="e.g. Master of Computer Applications"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-purple-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Institution / College *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                placeholder="e.g. CSIBER"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-purple-50 focus:outline-none"
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
                placeholder="e.g. Kolhapur, India"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Start Year *
              </label>
              <input
                type="text"
                required
                value={formData.startYear}
                onChange={(e) =>
                  setFormData({ ...formData, startYear: e.target.value })
                }
                placeholder="e.g. 2023"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                End Year *
              </label>
              <input
                type="text"
                required
                value={formData.endYear}
                onChange={(e) =>
                  setFormData({ ...formData, endYear: e.target.value })
                }
                placeholder="e.g. 2025"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Grade / Distinction
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                placeholder="e.g. First Class with Distinction"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
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

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Academic Summary *
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Key focus areas, specializations, or thesis overview..."
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          {/* Academic Points */}
          <div className="border-2 border-black bg-zinc-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-black">
                Coursework & Key Highlights
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="flex items-center gap-1 px-2 py-0.5 bg-white text-black text-[11px] font-bold uppercase border border-black shadow-[1px_1px_0px_0px_#000] hover:bg-purple-300"
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
                  placeholder={`Academic point #${idx + 1}`}
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
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-purple-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>
              {isPending
                ? "Persisting Record..."
                : itemToEdit
                  ? "Update Education Record"
                  : "Create Education Record"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
