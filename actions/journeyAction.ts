// src/actions/journeyActions.ts
"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type StatusType = "CURRENT" | "COMPLETED";

export type ExperienceInput = {
  role: string;
  company: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  status?: StatusType;
  description: string;
  points: string[];
  order?: number;
};

export type EducationInput = {
  degree: string;
  institution: string;
  location?: string | null;
  startYear: string;
  endYear: string;
  grade?: string | null;
  description: string;
  points: string[];
  order?: number;
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

function parsePoints(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// --------------------------------------------------------
// EXPERIENCE SERVER ACTIONS
// --------------------------------------------------------

export async function getExperiences(): Promise<ActionResponse<any[]>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: experiences };
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return { success: false, error: "Could not retrieve experiences." };
  }
}

export async function createExperience(
  payload: ExperienceInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let data: ExperienceInput;

    if (payload instanceof FormData) {
      data = {
        role: (payload.get("role") as string) || "",
        company: (payload.get("company") as string) || "",
        location: (payload.get("location") as string) || null,
        startDate: (payload.get("startDate") as string) || "",
        endDate: (payload.get("endDate") as string) || null,
        status: (payload.get("status") as StatusType) || "COMPLETED",
        description: (payload.get("description") as string) || "",
        points: parsePoints(payload.get("points")),
        order: Number(payload.get("order")) || 0,
      };
    } else {
      data = payload;
    }

    if (!data.role || !data.company || !data.startDate) {
      return {
        success: false,
        error: "Role, company, and start date are required.",
      };
    }

    const item = await prisma.experience.create({
      data: {
        role: data.role,
        company: data.company,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status ?? "COMPLETED",
        description: data.description,
        points: data.points,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/journey");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error creating experience entry:", error);
    return { success: false, error: "Failed to create experience entry." };
  }
}

export async function updateExperience(
  id: string,
  payload: Partial<ExperienceInput> | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let updateData: Partial<ExperienceInput>;

    if (payload instanceof FormData) {
      updateData = {
        role: (payload.get("role") as string) || undefined,
        company: (payload.get("company") as string) || undefined,
        location: (payload.get("location") as string) || null,
        startDate: (payload.get("startDate") as string) || undefined,
        endDate: (payload.get("endDate") as string) || null,
        status: (payload.get("status") as StatusType) || undefined,
        description: (payload.get("description") as string) || undefined,
        points: payload.has("points")
          ? parsePoints(payload.get("points"))
          : undefined,
        order: payload.has("order") ? Number(payload.get("order")) : undefined,
      };
    } else {
      updateData = payload;
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin/journey");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating experience entry:", error);
    return { success: false, error: "Failed to update experience entry." };
  }
}

export async function deleteExperience(
  id: string,
): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/journey");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting experience entry:", error);
    return { success: false, error: "Failed to delete experience." };
  }
}

// --------------------------------------------------------
// EDUCATION SERVER ACTIONS
// --------------------------------------------------------

export async function getEducations(): Promise<ActionResponse<any[]>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const educations = await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: educations };
  } catch (error) {
    console.error("Failed to fetch education records:", error);
    return { success: false, error: "Could not retrieve education records." };
  }
}

export async function createEducation(
  payload: EducationInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let data: EducationInput;

    if (payload instanceof FormData) {
      data = {
        degree: (payload.get("degree") as string) || "",
        institution: (payload.get("institution") as string) || "",
        location: (payload.get("location") as string) || null,
        startYear: (payload.get("startYear") as string) || "",
        endYear: (payload.get("endYear") as string) || "",
        grade: (payload.get("grade") as string) || null,
        description: (payload.get("description") as string) || "",
        points: parsePoints(payload.get("points")),
        order: Number(payload.get("order")) || 0,
      };
    } else {
      data = payload;
    }

    if (!data.degree || !data.institution || !data.startYear || !data.endYear) {
      return {
        success: false,
        error: "Degree, institution, and years are required.",
      };
    }

    const item = await prisma.education.create({
      data: {
        degree: data.degree,
        institution: data.institution,
        location: data.location,
        startYear: data.startYear,
        endYear: data.endYear,
        grade: data.grade,
        description: data.description,
        points: data.points,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/journey");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error creating education entry:", error);
    return { success: false, error: "Failed to create education entry." };
  }
}

export async function updateEducation(
  id: string,
  payload: Partial<EducationInput> | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let updateData: Partial<EducationInput>;

    if (payload instanceof FormData) {
      updateData = {
        degree: (payload.get("degree") as string) || undefined,
        institution: (payload.get("institution") as string) || undefined,
        location: (payload.get("location") as string) || null,
        startYear: (payload.get("startYear") as string) || undefined,
        endYear: (payload.get("endYear") as string) || undefined,
        grade: (payload.get("grade") as string) || null,
        description: (payload.get("description") as string) || undefined,
        points: payload.has("points")
          ? parsePoints(payload.get("points"))
          : undefined,
        order: payload.has("order") ? Number(payload.get("order")) : undefined,
      };
    } else {
      updateData = payload;
    }

    const updated = await prisma.education.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin/journey");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating education entry:", error);
    return { success: false, error: "Failed to update education entry." };
  }
}

export async function deleteEducation(
  id: string,
): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.education.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/journey");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting education entry:", error);
    return { success: false, error: "Failed to delete education entry." };
  }
}
