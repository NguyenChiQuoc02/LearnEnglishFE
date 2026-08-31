import axios from "axios";
import axiosClient from "./axiosClient";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/constants/api.constants";
import { getAuth } from "@/app/utils/auth-storage";
import type {
  BulkDeleteResponse,
  PageResponse,
  TeacherResponse,
  UserImportResponse,
  UserRequest,
  UserResponse,
} from "@/app/types";

export function listTeachers() {
  return axiosClient
    .get<TeacherResponse[]>(API_ENDPOINTS.USERS.TEACHERS)
    .then((res) => res.data);
}

export function listUsers(params: { page?: number; size?: number; keyword?: string }) {
  return axiosClient
    .get<PageResponse<UserResponse>>(API_ENDPOINTS.USERS.BASE, { params })
    .then((res) => res.data);
}

export function getUser(id: number | string) {
  return axiosClient.get<UserResponse>(API_ENDPOINTS.USERS.DETAIL(id)).then((res) => res.data);
}

export function createUser(payload: UserRequest) {
  return axiosClient
    .post<UserResponse>(API_ENDPOINTS.USERS.BASE, payload)
    .then((res) => res.data);
}

export function updateUser(id: number | string, payload: UserRequest) {
  return axiosClient
    .put<UserResponse>(API_ENDPOINTS.USERS.DETAIL(id), payload)
    .then((res) => res.data);
}

export function deleteUser(id: number | string) {
  return axiosClient.delete<void>(API_ENDPOINTS.USERS.DETAIL(id)).then((res) => res.data);
}

export function bulkDeleteUsers(ids: number[]) {
  return axiosClient
    .post<BulkDeleteResponse>(API_ENDPOINTS.USERS.BULK_DELETE, { ids })
    .then((res) => res.data);
}

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

// Uses a plain axios call (not the shared axiosClient) so the browser can set
// the multipart/form-data Content-Type + boundary itself, instead of axiosClient's
// default "application/json" header overriding it.
function uploadUserFile(url: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axios
    .post<UserImportResponse>(`${API_BASE_URL}${url}`, formData, { headers: authHeader() })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorMessage(err));
    });
}

export function previewImportUsers(file: File) {
  return uploadUserFile(API_ENDPOINTS.USERS.IMPORT_PREVIEW, file);
}

export function importUsers(file: File) {
  return uploadUserFile(API_ENDPOINTS.USERS.IMPORT, file);
}

export function downloadImportTemplate() {
  return axios
    .get(`${API_BASE_URL}${API_ENDPOINTS.USERS.IMPORT_TEMPLATE}`, {
      headers: authHeader(),
      responseType: "blob",
    })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "template_user.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      throw new Error(extractErrorMessage(err));
    });
}
