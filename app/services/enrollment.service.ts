import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { EnrollmentResponse } from "@/app/types";

export function enrollCourse(courseId: number | string) {
  return axiosClient
    .post<EnrollmentResponse>(API_ENDPOINTS.ENROLLMENTS.BASE, {
      courseId: Number(courseId),
    })
    .then((res) => res.data);
}

export function listMyEnrollments() {
  return axiosClient
    .get<EnrollmentResponse[]>(API_ENDPOINTS.ENROLLMENTS.ME)
    .then((res) => res.data);
}
