// src/components/admin/SkillManager.tsx
"use client";

import { useState } from "react";
import { CategoryModal, SkillModal } from "@/components/admin/SkillModals";
import { deleteSkillCategory, deleteSkill } from "@/actions/skillActions";
import { Plus, Pencil, Trash2, Tag, FolderPlus } from "lucide-react";

interface SkillItem {
  id: string;
  name: string;
  iconKey?: string | null;
  familiarity: "CORE" | "FAMILIAR";
  order: number;
  categoryId: string;
}

interface SkillCategoryWithSkills {
  id: string;
  name: string;
  order: number;
  skills: SkillItem[];
}

interface SkillManagerProps {
  initialCategories: SkillCategoryWithSkills[];
}

export function SkillManager({ initialCategories }: SkillManagerProps) {
  // Modal States
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<{
    id: string;
    name: string;
    order: number;
  } | null>(null);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [skillToEdit, setSkillToEdit] = useState<SkillItem | null>(null);

  // Category Actions
  const handleCreateCategory = () => {
    setCategoryToEdit(null);
    setCatModalOpen(true);
  };

  const handleEditCategory = (cat: {
    id: string;
    name: string;
    order: number;
  }) => {
    setCategoryToEdit(cat);
    setCatModalOpen(true);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${name}" and all its skills?`,
      )
    )
      return;
    await deleteSkillCategory(id);
  };

  // Skill Actions
  const handleAddSkill = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSkillToEdit(null);
    setSkillModalOpen(true);
  };

  const handleEditSkill = (skill: SkillItem) => {
    setActiveCategoryId(skill.categoryId);
    setSkillToEdit(skill);
    setSkillModalOpen(true);
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Remove skill "${name}"?`)) return;
    await deleteSkill(id);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Action Bar */}
      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Tag className="size-4 text-black" />
          <span className="text-xs font-black uppercase text-black">
            Category Configurations
          </span>
        </div>

        <button
          type="button"
          onClick={handleCreateCategory}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-pink-300 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-pink-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          <FolderPlus className="size-4" />
          <span>New Skill Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      {initialCategories.length === 0 ? (
        <div className="border-2 border-black bg-white p-12 text-center text-xs font-bold uppercase text-zinc-500 shadow-[4px_4px_0px_0px_#000]">
          No skill categories registered. Click &quot;New Skill Category&quot;
          to begin.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {initialCategories.map((category) => (
            <div
              key={category.id}
              className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between"
            >
              {/* Category Card Header */}
              <div className="p-3.5 bg-yellow-100 border-b-2 border-black flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-bold">
                    #{category.order}
                  </span>
                  <h2 className="text-xs font-black uppercase truncate text-black">
                    {category.name}
                  </h2>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    ({category.skills.length})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleAddSkill(category.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-white border border-black text-[10px] font-bold uppercase shadow-[1px_1px_0px_0px_#000] hover:bg-yellow-300 transition"
                    title="Add Skill"
                  >
                    <Plus className="size-3" />
                    <span>Add</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleEditCategory({
                        id: category.id,
                        name: category.name,
                        order: category.order,
                      })
                    }
                    className="p-1 bg-white border border-black text-black hover:bg-cyan-200 shadow-[1px_1px_0px_0px_#000] transition"
                    title="Edit Category"
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                    className="p-1 bg-white border border-black text-red-600 hover:bg-red-200 shadow-[1px_1px_0px_0px_#000] transition"
                    title="Delete Category"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>

              {/* Skills Badge Container */}
              <div className="p-4 flex-1">
                {category.skills.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic py-2">
                    No skills in this category yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => {
                      return (
                        <div
                          key={skill.id}
                          className="group flex items-center gap-1.5 pl-2 pr-1 py-1 border-2 border-black text-xs font-bold transition-all shadow-[2px_2px_0px_0px_#000] bg-yellow-300 text-black"
                        >
                          <span className="truncate max-w-[140px]">
                            {skill.name}
                          </span>

                          {/* Inline Edit/Delete on Badge */}
                          <div className="flex items-center gap-0.5 ml-1 border-l border-black pl-1">
                            <button
                              type="button"
                              onClick={() => handleEditSkill(skill)}
                              className="p-0.5 text-zinc-700 hover:text-black hover:bg-black/10 transition"
                              title="Edit Skill"
                            >
                              <Pencil className="size-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSkill(skill.id, skill.name)
                              }
                              className="p-0.5 text-red-600 hover:text-red-900 hover:bg-black/10 transition"
                              title="Delete Skill"
                            >
                              <Trash2 className="size-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-4 py-2 border-t-2 border-black bg-zinc-50 flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase">
                <span>Order: {category.order}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />

      {/* Skill Create/Edit Modal */}
      <SkillModal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        categoryId={activeCategoryId}
        skillToEdit={skillToEdit}
      />
    </div>
  );
}
