import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { UploadMethod, UploadMethodResponse } from "@/app/types";

export function getUploadMethod() {
  return axiosClient
    .get<UploadMethodResponse>(API_ENDPOINTS.CONFIG.UPLOAD_METHOD)
    .then((res) => res.data.uploadMethod);
}

export function updateUploadMethod(uploadMethod: UploadMethod) {
  return axiosClient
    .put<UploadMethodResponse>(API_ENDPOINTS.CONFIG.UPLOAD_METHOD, { uploadMethod })
    .then((res) => res.data.uploadMethod);
}
