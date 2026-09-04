import axios from "axios";
import axiosClient from "./axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/constants/api.constants";
import { getAuth } from "@/app/utils/auth-storage";
import type { MinioFileResponse, MinioUploadResult } from "@/app/types";

function authHeader() {
  const auth = getAuth();
  return auth?.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {};
}

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    return data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : "Request failed";
}

// Uses a plain axios call (not the shared axiosClient) so the browser can set the
// multipart/form-data Content-Type + boundary itself, instead of axiosClient's default
// "application/json" header overriding it. Also reports overall upload progress for the UI bar.
// Files upload in a single request/batch so one bad file (e.g. unsupported extension) doesn't
// block the others — the backend returns a per-file success/error result.
export function uploadFilesToMinio(files: File[], onProgress?: (percent: number) => void) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return axios
    .post<MinioUploadResult[]>(`${API_BASE_URL}${API_ENDPOINTS.MINIO.UPLOAD}`, formData, {
      headers: authHeader(),
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorMessage(err));
    });
}

export function listMinioFiles() {
  return axiosClient.get<MinioFileResponse[]>(API_ENDPOINTS.MINIO.FILES).then((res) => res.data);
}

export function deleteMinioFile(objectName: string) {
  return axiosClient.delete<void>(API_ENDPOINTS.MINIO.FILE_DETAIL(objectName)).then((res) => res.data);
}
