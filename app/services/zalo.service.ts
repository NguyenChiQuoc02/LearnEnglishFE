import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { ZaloAuthUrlResponse, ZaloLinkCodeResponse, ZaloMeResponse, ZaloStatusResponse } from "@/app/types";

export function getZaloAuthUrl() {
  return axiosClient.get<ZaloAuthUrlResponse>(API_ENDPOINTS.ZALO.AUTH_URL).then((res) => res.data);
}

export function getZaloStatus() {
  return axiosClient.get<ZaloStatusResponse>(API_ENDPOINTS.ZALO.STATUS).then((res) => res.data);
}

export function generateZaloLinkCode() {
  return axiosClient.post<ZaloLinkCodeResponse>(API_ENDPOINTS.ZALO.LINK_CODE).then((res) => res.data);
}

export function getMyZaloStatus() {
  return axiosClient.get<ZaloMeResponse>(API_ENDPOINTS.ZALO.ME).then((res) => res.data);
}
