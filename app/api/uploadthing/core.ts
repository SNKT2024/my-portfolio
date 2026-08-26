// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Reusable auth check for uploads
const handleAuth = async () => {
  const user = await currentUser();
  const primaryEmail = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  )?.emailAddress;

  const adminEmail = process.env.ADMIN_EMAIL;

  if (
    !user ||
    !adminEmail ||
    primaryEmail?.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    throw new UploadThingError(
      "Unauthorized: Admin access required to upload files.",
    );
  }

  return { userId: user.id };
};

export const ourFileRouter = {
  // 1. Project Image Uploader (Max 4MB per image)
  projectImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete for admin:", metadata.userId);
      return { url: file.ufsUrl };
    }),

  // 2. PDF Resume Uploader (Max 8MB per PDF)
  resumeUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Resume PDF upload complete:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
