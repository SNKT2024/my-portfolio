// src/lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export function getUploadedFileUrl(
  file:
    | {
        serverData?: { url?: string };
        ufsUrl?: string;
        url?: string;
      }
    | undefined,
) {
  return file?.serverData?.url || file?.ufsUrl || file?.url || null;
}
