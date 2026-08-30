import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { JwtResponse, MessageResponse } from "@/app/types";

export function login(username: string, password: string) {
  return axiosClient
    .post<JwtResponse>(API_ENDPOINTS.AUTH.SIGNIN, { username, password })
    .then((res) => res.data);
}

export function register(username: string, email: string, password: string) {
  return axiosClient
    .post<MessageResponse>(API_ENDPOINTS.AUTH.SIGNUP, { username, email, password })
    .then((res) => res.data);
}
