import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { TeacherResponse, UserRequest, UserResponse } from "@/app/types";

export function listTeachers() {
  return axiosClient
    .get<TeacherResponse[]>(API_ENDPOINTS.USERS.TEACHERS)
    .then((res) => res.data);
}

export function listUsers() {
  return axiosClient.get<UserResponse[]>(API_ENDPOINTS.USERS.BASE).then((res) => res.data);
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
