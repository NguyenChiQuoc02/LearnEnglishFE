import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";

export function clearApiCache() {
  return axiosClient.post<void>(API_ENDPOINTS.CACHE_TEST.CLEAR).then((res) => res.data);
}
