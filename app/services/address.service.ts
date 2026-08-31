import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { ProvinceResponse, WardResponse } from "@/app/types";

export function listProvinces() {
  return axiosClient
    .get<ProvinceResponse[]>(API_ENDPOINTS.PROVINCES.BASE)
    .then((res) => res.data);
}

export function listWardsByProvince(provinceCode: string) {
  return axiosClient
    .get<WardResponse[]>(API_ENDPOINTS.PROVINCES.WARDS(provinceCode))
    .then((res) => res.data);
}
