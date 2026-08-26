// src/actions/projectActions.ts
"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type ProjectInput = {
  title: string;
  category: string;
  type: string;
  description: string;
  points: string[];
  techStack: string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  order?: number;
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Helper: Safely parse array fields from FormData
function parseArrayField(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(/[\n,]+/) // Split on newlines or commas
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Fetch all projects (sorted by order)
 */
export async function getProjects(): Promise<ActionResponse<any[]>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Could not retrieve projects." };
  }
}

/**
 * Create a new Project
 */
export async function createProject(
  payload: ProjectInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let data: ProjectInput;

    if (payload instanceof FormData) {
      data = {
        title: (payload.get("title") as string) || "",
        category: (payload.get("category") as string) || "Full Stack",
        type: (payload.get("type") as string) || "Personal Project",
        description: (payload.get("description") as string) || "",
        points: parseArrayField(payload.get("points")),
        techStack: parseArrayField(payload.get("techStack")),
        imageUrl: (payload.get("imageUrl") as string) || null,
        liveUrl: (payload.get("liveUrl") as string) || null,
        githubUrl: (payload.get("githubUrl") as string) || null,
        featured:
          payload.get("featured") === "on" ||
          payload.get("featured") === "true",
        order: Number(payload.get("order")) || 0,
      };
    } else {
      data = payload;
    }

    if (!data.title || !data.description) {
      return { success: false, error: "Title and description are required." };
    }

    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        category: data.category,
        type: data.type,
        description: data.description,
        points: data.points,
        techStack: data.techStack,
        imageUrl: data.imageUrl,
        liveUrl: data.liveUrl,
        githubUrl: data.githubUrl,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: newProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

/**
 * Update an existing Project by ID
 */
export async function updateProject(
  id: string,
  payload: Partial<ProjectInput> | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let updateData: Partial<ProjectInput>;

    if (payload instanceof FormData) {
      updateData = {
        title: (payload.get("title") as string) || undefined,
        category: (payload.get("category") as string) || undefined,
        type: (payload.get("type") as string) || undefined,
        description: (payload.get("description") as string) || undefined,
        points: payload.has("points")
          ? parseArrayField(payload.get("points"))
          : undefined,
        techStack: payload.has("techStack")
          ? parseArrayField(payload.get("techStack"))
          : undefined,
        imageUrl: (payload.get("imageUrl") as string) || null,
        liveUrl: (payload.get("liveUrl") as string) || null,
        githubUrl: (payload.get("githubUrl") as string) || null,
        featured: payload.has("featured")
          ? payload.get("featured") === "on" ||
            payload.get("featured") === "true"
          : undefined,
        order: payload.has("order") ? Number(payload.get("order")) : undefined,
      };
    } else {
      updateData = payload;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project." };
  }
}

/**
 * Delete a Project by ID
 */
export async function deleteProject(id: string): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project." };
  }
}

/**
 * Batch update order of projects (For drag-and-drop ordering)
 */
export async function reorderProjects(
  items: { id: string; order: number }[],
): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    revalidatePath("/");
    revalidatePath("/admin/projects");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error reordering projects:", error);
    return { success: false, error: "Failed to reorder projects." };
  }
}
