import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/app/constants/api.constants";
import { getAuth } from "@/app/utils/auth-storage";
import type { ExportRequest } from "@/app/types";

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

function extractFileName(contentDisposition: string | undefined, fallback: string): string {
  const match = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}

// Synchronous export: the server streams the file straight back in this one request
// (no job/polling), so we just wait for the response and trigger a browser download.
export function exportUsers(payload: ExportRequest) {
  return axios
    .post(`${API_BASE_URL}${API_ENDPOINTS.EXPORTS.USERS}`, payload, {
      headers: authHeader(),
      responseType: "blob",
    })
    .then((res) => {
      const fallbackExt = payload.format === "EXCEL" ? "xlsx" : payload.format === "WORD" ? "docx" : "pdf";
      const fileName = extractFileName(res.headers["content-disposition"], `users_export.${fallbackExt}`);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(async (err) => {
      // Error responses come back as JSON but were requested as a blob, so the
      // ApiError message has to be read out of the blob before it can be shown.
      if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        let message = err.message;
        try {
          message = (JSON.parse(text) as { message?: string }).message ?? err.message;
        } catch {
          // response body wasn't JSON; fall back to the axios error message
        }
        throw new Error(message);
      }
      throw new Error(extractErrorMessage(err));
    });
}
