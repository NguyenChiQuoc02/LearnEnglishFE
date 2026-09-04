import { getUploadMethod } from "./systemConfig.service";
import { uploadFilesToMinio } from "./minioUpload.service";
import { uploadImageToCloudinary } from "./upload.service";
import type { UploadMethod } from "@/app/types";

// Cached for the lifetime of the tab so every image field doesn't re-fetch the setting on
// each upload. Cleared by the settings page once an admin changes the method.
let cachedMethod: UploadMethod | null = null;

export async function resolveUploadMethod(): Promise<UploadMethod> {
  if (!cachedMethod) {
    cachedMethod = await getUploadMethod();
  }
  return cachedMethod;
}

export function invalidateUploadMethodCache() {
  cachedMethod = null;
}

// Single entrypoint every image-upload UI should call — picks MinIO or Cloudinary based on
// the admin-configured method so switching the setting changes upload behavior app-wide.
export async function uploadImage(file: File): Promise<string> {
  const method = await resolveUploadMethod();

  if (method === "CLOUDINARY") {
    return uploadImageToCloudinary(file);
  }

  const [result] = await uploadFilesToMinio([file]);
  if (!result?.success || !result.file) {
    throw new Error(result?.error ?? "Tải ảnh lên thất bại");
  }
  return result.file.url;
}
