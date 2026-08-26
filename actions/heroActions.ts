"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type HeroInput = {
  name: string;
  role: string;
  tagline: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  statusBadge: string;
  avatarUrl?: string | null;
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getHeroData(): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    const hero = await prisma.heroSection.findFirst({
      where: { id: 1 },
    });

    return { success: true, data: hero };
  } catch (error) {
    console.error("Failed to fetch hero data: ", error);
    return { success: false, error: "Failed to fetch hero data" };
  }
}

export async function updateHeroSection(
  payload: HeroInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();

  try {
    let data: HeroInput;

    if (payload instanceof FormData) {
      data = {
        name: (payload.get("name") as string) || "Sanket Kumbhar",
        role: (payload.get("role") as string) || "Full Stack Developer",
        tagline: (payload.get("tagline") as string) || "",
        primaryCtaText:
          (payload.get("primaryCtaText") as string) || "View / Download Resume",
        primaryCtaUrl:
          (payload.get("primaryCtaUrl") as string) || "/resume.pdf",
        secondaryCtaText:
          (payload.get("secondaryCtaText") as string) || "Explore Projects",
        secondaryCtaUrl:
          (payload.get("secondaryCtaUrl") as string) || "#projects",
        statusBadge:
          (payload.get("statusBadge") as string) ||
          "[ Available for Full-Time Roles 🟢 ]",
        avatarUrl: (payload.get("avatarUrl") as string) || null,
      };
    } else {
      data = payload;
    }

    const updatedHero = await prisma.heroSection.upsert({
      where: { id: 1 },
      update: { ...data },
      create: { id: 1, ...data },
    });

    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { success: true, data: updatedHero };
  } catch (error) {
    console.error("Failed to update hero section: ", error);
    return { success: false, error: "Failed to update her section" };
  }
}
