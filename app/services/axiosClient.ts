import axios from "axios";
import { API_BASE_URL } from "@/app/constants/api.constants";
import { getAuth } from "@/app/utils/auth-storage";
import type { MessageResponse } from "@/app/types";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data as MessageResponse | undefined;
    const message = data?.message ?? error?.message ?? "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
