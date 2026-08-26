// src/components/admin/ProjectModal.tsx
"use client";

import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { createProject, updateProject } from "@/actions/projectActions";
import {
  X,
  Plus,
  Trash2,
  Save,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Project } from "@/app/generated/prisma/client";
import { getUploadedFileUrl, UploadButton } from "@/lib/uploadthing";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  projectToEdit,
}: ProjectModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Full Stack Web",
    type: "Personal Project",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    techStackRaw: "",
    featured: false,
    order: 0,
    points: [""],
  });

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        category: projectToEdit.category,
        type: projectToEdit.type,
        description: projectToEdit.description,
        imageUrl: projectToEdit.imageUrl || "",
        liveUrl: projectToEdit.liveUrl || "",
        githubUrl: projectToEdit.githubUrl || "",
        techStackRaw: projectToEdit.techStack.join(", "),
        featured: projectToEdit.featured,
        order: projectToEdit.order,
        points: projectToEdit.points.length > 0 ? projectToEdit.points : [""],
      });
    } else {
      setFormData({
        title: "",
        category: "Full Stack Web",
        type: "Personal Project",
        description: "",
        imageUrl: "",
        liveUrl: "",
        githubUrl: "",
        techStackRaw: "",
        featured: false,
        order: 0,
        points: [""],
      });
    }
    setErrorMsg(null);
    setUploadMessage(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  // Bullet Point Helpers
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

    const techStack = formData.techStackRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const cleanPoints = formData.points
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const payload = {
      title: formData.title,
      category: formData.category,
      type: formData.type,
      description: formData.description,
      imageUrl: formData.imageUrl || null,
      liveUrl: formData.liveUrl || null,
      githubUrl: formData.githubUrl || null,
      techStack,
      points: cleanPoints,
      featured: formData.featured,
      order: Number(formData.order),
    };

    let res;
    if (projectToEdit) {
      res = await updateProject(projectToEdit.id, payload);
    } else {
      res = await createProject(payload);
    }

    setIsPending(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || "Failed to save project.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] font-mono my-8">
        {/* Retro Header Bar */}
        <div className="p-3 bg-yellow-300 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 border border-black rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 border border-black rounded-full" />
            <div className="w-3 h-3 bg-green-500 border border-black rounded-full" />
            <span className="text-xs font-black uppercase text-black ml-2">
              {projectToEdit
                ? `EDIT_RECORD :: ${projectToEdit.title}`
                : "NEW_PROJECT_RECORD"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-black bg-white hover:bg-red-400 text-black transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {errorMsg && (
            <div className="p-3 border-2 border-black bg-red-300 text-black text-xs font-bold shadow-[2px_2px_0px_0px_#000]">
              {errorMsg}
            </div>
          )}

          {/* 1. Basic Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="AI Kanban Job Tracker"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:bg-yellow-50 focus:outline-none"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Full Stack Web & AI"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Project Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Personal / Fellowship / Client"
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Short Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief summary describing the project architecture, goals, and results..."
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          {/* 3. Tech Stack */}
          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Tech Stack (Comma-Separated)
            </label>
            <input
              type="text"
              value={formData.techStackRaw}
              onChange={(e) =>
                setFormData({ ...formData, techStackRaw: e.target.value })
              }
              placeholder="Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS"
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
          </div>

          {/* 4. Architecture Bullets */}
          <div className="border-2 border-black bg-zinc-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-black">
                Impact Bullets / Highlights
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="flex items-center gap-1 px-2 py-0.5 bg-white text-black text-[11px] font-bold uppercase border border-black shadow-[1px_1px_0px_0px_#000] hover:bg-yellow-300"
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
                  placeholder={`Impact point #${idx + 1}`}
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

          {/* 5. External URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                Live URL Demo
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black mb-1">
                GitHub Repo URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/..."
                className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* 6. Image URL & Featured Flag */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-1">
              <label className="block text-xs font-bold uppercase text-black">
                Thumbnail Image URL
              </label>
              <UploadButton
                endpoint="projectImage"
                onUploadBegin={() => {
                  setIsUploadingImage(true);
                  setUploadProgress(0);
                  setErrorMsg(null);
                  setUploadMessage(null);
                }}
                onUploadProgress={setUploadProgress}
                onClientUploadComplete={(res) => {
                  setIsUploadingImage(false);
                  const url = getUploadedFileUrl(res?.[0]);
                  if (!url) {
                    setErrorMsg("Upload completed without an image URL.");
                    return;
                  }
                  setFormData((prev) => ({ ...prev, imageUrl: url }));
                  setUploadMessage("Image uploaded and link attached.");
                  setErrorMsg(null);
                }}
                onUploadError={(error) => {
                  setIsUploadingImage(false);
                  setUploadMessage(null);
                  setErrorMsg(`Image upload failed: ${error.message}`);
                }}
                appearance={{
                  button:
                    "border-2 border-black bg-cyan-300 px-2 py-1 text-[10px] font-black uppercase text-black",
                  allowedContent: "text-[10px] text-zinc-600",
                }}
                content={{ button: "Upload Image" }}
              />
            </div>
            {isUploadingImage && (
              <p className="flex items-center gap-1 text-[10px] font-bold text-cyan-700">
                <Loader2 className="size-3 animate-spin" /> Uploading image...{" "}
                {uploadProgress}%
              </p>
            )}
            {uploadMessage && !isUploadingImage && (
              <p className="text-[10px] font-bold text-emerald-700">
                {uploadMessage}
              </p>
            )}
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://..."
              className="w-full min-w-0 border-2 border-black bg-zinc-50 p-2 text-xs font-medium focus:outline-none"
            />
            {formData.imageUrl && (
              <p className="mt-1 truncate text-[10px] text-zinc-500">
                Uploaded: {formData.imageUrl}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featuredCheckbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="size-4 border-2 border-black rounded-none text-black focus:ring-0"
            />
            <label
              htmlFor="featuredCheckbox"
              className="text-xs font-bold uppercase text-black select-none cursor-pointer"
            >
              Mark as Featured Project (Pinned at top)
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending || isUploadingImage}
              className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-300 text-black font-black text-xs uppercase tracking-wide border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>
                {isPending
                  ? "Persisting Record..."
                  : projectToEdit
                    ? "Update Project Record"
                    : "Create Project Record"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
