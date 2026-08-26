"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type SkillFamiliarityType = "CORE" | "FAMILIAR";

export type SkillInput = {
  name: string;
  categoryId: string;
  familiarity?: SkillFamiliarityType;
  iconKey?: string | null;
  order?: number;
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch all skill categories with their nested skills
 */
export async function getSkillCategoriesWithSkills(): Promise<
  ActionResponse<any[]>
> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        skills: {
          orderBy: { order: "asc" },
        },
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return { success: false, error: "Could not retrieve skill categories." };
  }
}

/**
 * Create a new Skill Category
 */
export async function createSkillCategory(
  name: string,
  order: number = 0,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    if (!name.trim()) {
      return { success: false, error: "Category name is required." };
    }

    const category = await prisma.skillCategory.create({
      data: {
        name: name.trim(),
        order,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating skill category:", error);
    return { success: false, error: "Failed to create skill category." };
  }
}

/**
 * Update a Skill Category Name/Order
 */
export async function updateSkillCategory(
  id: string,
  name: string,
  order?: number,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const updated = await prisma.skillCategory.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(order !== undefined ? { order } : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating skill category:", error);
    return { success: false, error: "Failed to update category." };
  }
}

/**
 * Delete a Skill Category (Cascades to nested skills)
 */
export async function deleteSkillCategory(
  id: string,
): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.skillCategory.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting skill category:", error);
    return { success: false, error: "Failed to delete skill category." };
  }
}

/**
 * Create an individual Skill under a Category
 */
export async function createSkill(
  payload: SkillInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let data: SkillInput;

    if (payload instanceof FormData) {
      data = {
        name: (payload.get("name") as string) || "",
        categoryId: (payload.get("categoryId") as string) || "",
        familiarity:
          (payload.get("familiarity") as SkillFamiliarityType) || "CORE",
        iconKey: (payload.get("iconKey") as string) || null,
        order: Number(payload.get("order")) || 0,
      };
    } else {
      data = payload;
    }

    if (!data.name || !data.categoryId) {
      return {
        success: false,
        error: "Skill name and category ID are required.",
      };
    }

    const skill = await prisma.skill.create({
      data: {
        name: data.name.trim(),
        categoryId: data.categoryId,
        familiarity: data.familiarity ?? "CORE",
        iconKey: data.iconKey,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: skill };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { success: false, error: "Failed to add skill." };
  }
}

/**
 * Update an existing Skill
 */
export async function updateSkill(
  id: string,
  payload: Partial<SkillInput> | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let updateData: Partial<SkillInput>;

    if (payload instanceof FormData) {
      updateData = {
        name: (payload.get("name") as string) || undefined,
        categoryId: (payload.get("categoryId") as string) || undefined,
        familiarity:
          (payload.get("familiarity") as SkillFamiliarityType) || undefined,
        iconKey: (payload.get("iconKey") as string) || null,
        order: payload.has("order") ? Number(payload.get("order")) : undefined,
      };
    } else {
      updateData = payload;
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: skill };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { success: false, error: "Failed to update skill." };
  }
}

/**
 * Delete a Skill
 */
export async function deleteSkill(id: string): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { success: false, error: "Failed to delete skill." };
  }
}
