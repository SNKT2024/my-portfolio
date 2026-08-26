"use server";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type StatItem = {
  label: string;
  value: string;
};

export type BackgroundData = {
  summary?: string;
  passions?: string[];
  [key: string]: any;
};

export type AboutInput = {
  heading?: string;
  avatarUrl?: string | null;
  location?: string;
  stats?: StatItem[];
  background?: BackgroundData | any;
  highlights?: string[];
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Helper: Safely parse JSON or multiline string arrays from FormData
function safeJsonParse<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (!value || typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseLines(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Fetch About Section Data (Singleton)
 */
export async function getAboutData(): Promise<ActionResponse<any>> {
  await requireAdmin();

  const { userId } = await auth.protect();
  try {
    const about = await prisma.aboutSection.findFirst({
      where: { id: "about_singleton" },
    });

    return { success: true, data: about };
  } catch (error) {
    console.error("Failed to fetch about data:", error);
    return { success: false, error: "Could not retrieve about data." };
  }
}

/**
 * Update About Me Section (Upsert ID: "about_singleton")
 */
export async function updateAboutSection(
  payload: AboutInput | FormData,
): Promise<ActionResponse<any>> {
  await requireAdmin();
  const { userId } = await auth.protect();
  try {
    let data: AboutInput;

    if (payload instanceof FormData) {
      data = {
        heading: (payload.get("heading") as string) || "About Me",
        avatarUrl: (payload.get("avatarUrl") as string) || null,
        location: (payload.get("location") as string) || "India",
        stats: safeJsonParse<StatItem[]>(payload.get("stats"), []),
        background: safeJsonParse<BackgroundData>(payload.get("background"), {
          summary: (payload.get("backgroundSummary") as string) || "",
          passions: parseLines(payload.get("passions")),
        }),
        highlights: payload.has("highlightsRaw")
          ? parseLines(payload.get("highlightsRaw"))
          : safeJsonParse<string[]>(payload.get("highlights"), []),
      };
    } else {
      data = payload;
    }

    const updatedAbout = await prisma.aboutSection.upsert({
      where: { id: "about_singleton" },
      update: {
        heading: data.heading,
        avatarUrl: data.avatarUrl,
        location: data.location,
        stats: data.stats ? JSON.parse(JSON.stringify(data.stats)) : undefined,
        background: data.background
          ? JSON.parse(JSON.stringify(data.background))
          : undefined,
        highlights: data.highlights
          ? JSON.parse(JSON.stringify(data.highlights))
          : undefined,
      },
      create: {
        id: "about_singleton",
        heading: data.heading || "About Me",
        avatarUrl: data.avatarUrl,
        location: data.location || "India",
        stats: data.stats ? JSON.parse(JSON.stringify(data.stats)) : [],
        background: data.background
          ? JSON.parse(JSON.stringify(data.background))
          : {},
        highlights: data.highlights
          ? JSON.parse(JSON.stringify(data.highlights))
          : [],
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");

    return { success: true, data: updatedAbout };
  } catch (error) {
    console.error("Error updating about section:", error);
    return {
      success: false,
      error: "Database error while updating About section.",
    };
  }
}
