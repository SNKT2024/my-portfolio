// src/components/admin/ExperienceEducationManager.tsx
"use client";

import { useState } from "react";
import { ExperienceModal } from "@/components/admin/ExperienceModal";
import { EducationModal } from "@/components/admin/EducationModal";
import { deleteExperience, deleteEducation } from "@/actions/journeyAction";
import {
  Briefcase,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import { Education, Experience } from "@/app/generated/prisma/client";

interface ExperienceEducationManagerProps {
  initialExperiences: Experience[];
  initialEducations: Education[];
}

export function ExperienceEducationManager({
  initialExperiences,
  initialEducations,
}: ExperienceEducationManagerProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    "experience",
  );

  // Experience Modal States
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expToEdit, setExpToEdit] = useState<Experience | null>(null);

  // Education Modal States
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduToEdit, setEduToEdit] = useState<Education | null>(null);

  // Experience Handlers
  const handleOpenCreateExp = () => {
    setExpToEdit(null);
    setExpModalOpen(true);
  };
  const handleOpenEditExp = (item: Experience) => {
    setExpToEdit(item);
    setExpModalOpen(true);
  };
  const handleDeleteExp = async (id: string, company: string) => {
    if (!confirm(`Delete experience record for "${company}"?`)) return;
    await deleteExperience(id);
  };

  // Education Handlers
  const handleOpenCreateEdu = () => {
    setEduToEdit(null);
    setEduModalOpen(true);
  };
  const handleOpenEditEdu = (item: Education) => {
    setEduToEdit(item);
    setEduModalOpen(true);
  };
  const handleDeleteEdu = async (id: string, degree: string) => {
    if (!confirm(`Delete education record for "${degree}"?`)) return;
    await deleteEducation(id);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Segment Controls & Action */}
      <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-2 border-black transition-all ${
              activeTab === "experience"
                ? "bg-lime-300 text-black shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5"
                : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-lime-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            }`}
          >
            <Briefcase className="size-3.5" />
            <span>Work Experience ({initialExperiences.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("education")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-2 border-black transition-all ${
              activeTab === "education"
                ? "bg-purple-300 text-black shadow-[2px_2px_0px_0px_#000] translate-x-0.5 translate-y-0.5"
                : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-purple-100 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            }`}
          >
            <GraduationCap className="size-3.5" />
            <span>Education ({initialEducations.length})</span>
          </button>
        </div>

        {/* Dynamic New Item Action */}
        {activeTab === "experience" ? (
          <button
            type="button"
            onClick={handleOpenCreateExp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-lime-300 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-lime-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Experience</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleOpenCreateEdu}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-purple-300 text-black text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-purple-200 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Add Education</span>
          </button>
        )}
      </div>

      {/* ----------------- EXPERIENCE TAB CONTENT ----------------- */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {initialExperiences.length === 0 ? (
            <div className="border-2 border-black bg-white p-12 text-center text-xs font-bold uppercase text-zinc-500 shadow-[4px_4px_0px_0px_#000]">
              No experience records found. Click &quot;Add Experience&quot; to
              begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {initialExperiences.map((exp) => {
                const isCurrent = exp.status === "CURRENT";
                return (
                  <div
                    key={exp.id}
                    className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-bold">
                            #{exp.order}
                          </span>
                          <h2 className="text-sm font-black text-black">
                            {exp.role}
                          </h2>
                          <span className="text-xs font-bold text-zinc-600">
                            @ {exp.company}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="size-3" />
                            {exp.startDate} -{" "}
                            {exp.endDate || (isCurrent ? "Present" : "")}
                          </span>
                          {exp.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className={`px-2 py-0.5 border border-black text-[10px] font-black uppercase ${
                            isCurrent
                              ? "bg-emerald-300 text-black"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {exp.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleOpenEditExp(exp)}
                          className="p-1.5 border border-black bg-white hover:bg-cyan-200 shadow-[1px_1px_0px_0px_#000] transition"
                          title="Edit Record"
                        >
                          <Pencil className="size-3.5 text-black" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExp(exp.id, exp.company)}
                          className="p-1.5 border border-black bg-white hover:bg-red-200 text-red-600 shadow-[1px_1px_0px_0px_#000] transition"
                          title="Delete Record"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.points.length > 0 && (
                      <ul className="space-y-1.5 border-t border-zinc-200 pt-3">
                        {exp.points.map((pt, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-zinc-800 flex items-start gap-2"
                          >
                            <span className="size-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0 border border-black" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------- EDUCATION TAB CONTENT ----------------- */}
      {activeTab === "education" && (
        <div className="space-y-4">
          {initialEducations.length === 0 ? (
            <div className="border-2 border-black bg-white p-12 text-center text-xs font-bold uppercase text-zinc-500 shadow-[4px_4px_0px_0px_#000]">
              No education records found. Click &quot;Add Education&quot; to
              begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {initialEducations.map((edu) => (
                <div
                  key={edu.id}
                  className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-bold">
                          #{edu.order}
                        </span>
                        <h2 className="text-sm font-black text-black">
                          {edu.degree}
                        </h2>
                      </div>
                      <div className="text-xs font-bold text-zinc-600 mt-0.5">
                        {edu.institution}{" "}
                        {edu.location ? `• ${edu.location}` : ""}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3" />
                          {edu.startYear} - {edu.endYear}
                        </span>
                        {edu.grade && (
                          <span className="inline-flex items-center gap-1 bg-purple-100 border border-black px-1.5 py-0.2 text-[10px] font-black text-purple-900 uppercase">
                            <Award className="size-3" />
                            {edu.grade}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenEditEdu(edu)}
                        className="p-1.5 border border-black bg-white hover:bg-cyan-200 shadow-[1px_1px_0px_0px_#000] transition"
                        title="Edit Record"
                      >
                        <Pencil className="size-3.5 text-black" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEdu(edu.id, edu.degree)}
                        className="p-1.5 border border-black bg-white hover:bg-red-200 text-red-600 shadow-[1px_1px_0px_0px_#000] transition"
                        title="Delete Record"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                    {edu.description}
                  </p>

                  {edu.points.length > 0 && (
                    <ul className="space-y-1.5 border-t border-zinc-200 pt-3">
                      {edu.points.map((pt, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-zinc-800 flex items-start gap-2"
                        >
                          <span className="size-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0 border border-black" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ExperienceModal
        isOpen={expModalOpen}
        onClose={() => setExpModalOpen(false)}
        itemToEdit={expToEdit}
      />

      <EducationModal
        isOpen={eduModalOpen}
        onClose={() => setEduModalOpen(false)}
        itemToEdit={eduToEdit}
      />
    </div>
  );
}
