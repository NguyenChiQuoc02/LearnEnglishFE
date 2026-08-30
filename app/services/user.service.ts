import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { TeacherResponse } from "@/app/types";

export function listTeachers() {
  return axiosClient
    .get<TeacherResponse[]>(API_ENDPOINTS.USERS.TEACHERS)
    .then((res) => res.data);
}
