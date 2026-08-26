"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type SocialLinkInput = {
  title: string;
  url: string;
  iconKey: string;
  isPrimary?: boolean;
  order?: number;
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch all social links sorted by order
 */
export async function getSocialLinks(): Promise<ActionResponse<any[]>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: links };
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return { success: false, error: "Could not retrieve social links." };
  }
}

/**
 * Create a new Universal Social / CTA Link
 */
export async function createSocialLink(
  payload: SocialLinkInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let data: SocialLinkInput;

    if (payload instanceof FormData) {
      data = {
        title: (payload.get("title") as string) || "",
        url: (payload.get("url") as string) || "",
        iconKey: (payload.get("iconKey") as string) || "globe",
        isPrimary:
          payload.get("isPrimary") === "on" ||
          payload.get("isPrimary") === "true",
        order: Number(payload.get("order")) || 0,
      };
    } else {
      data = payload;
    }

    if (!data.title.trim() || !data.url.trim()) {
      return { success: false, error: "Title and URL are required." };
    }

    const newLink = await prisma.socialLink.create({
      data: {
        title: data.title.trim(),
        url: data.url.trim(),
        iconKey: data.iconKey.trim().toLowerCase(),
        isPrimary: data.isPrimary ?? false,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/links");

    return { success: true, data: newLink };
  } catch (error) {
    console.error("Error creating social link:", error);
    return { success: false, error: "Failed to create link." };
  }
}

/**
 * Update an existing Link
 */
export async function updateSocialLink(
  id: string,
  payload: Partial<SocialLinkInput> | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let updateData: Partial<SocialLinkInput>;

    if (payload instanceof FormData) {
      updateData = {
        title: (payload.get("title") as string) || undefined,
        url: (payload.get("url") as string) || undefined,
        iconKey: (payload.get("iconKey") as string) || undefined,
        isPrimary: payload.has("isPrimary")
          ? payload.get("isPrimary") === "on" ||
            payload.get("isPrimary") === "true"
          : undefined,
        order: payload.has("order") ? Number(payload.get("order")) : undefined,
      };
    } else {
      updateData = payload;
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath("/admin/links");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating social link:", error);
    return { success: false, error: "Failed to update link." };
  }
}

/**
 * Delete a Link by ID
 */
export async function deleteSocialLink(
  id: string,
): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.socialLink.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/links");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error deleting social link:", error);
    return { success: false, error: "Failed to delete link." };
  }
}

/**
 * Reorder links in batch (Drag-and-Drop)
 */
export async function reorderSocialLinks(
  items: { id: string; order: number }[],
): Promise<ActionResponse<null>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.socialLink.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    revalidatePath("/");
    revalidatePath("/admin/links");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error reordering links:", error);
    return { success: false, error: "Failed to reorder links." };
  }
}
