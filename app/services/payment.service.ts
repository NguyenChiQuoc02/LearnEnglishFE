import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { EnrollmentResponse, MomoPaymentResponse, WalletTransactionResponse } from "@/app/types";

export function payCourseWithWallet(courseId: number | string) {
  return axiosClient
    .post<EnrollmentResponse>(API_ENDPOINTS.PAYMENTS.COURSE_WALLET(courseId))
    .then((res) => res.data);
}

export function payCourseWithMomo(courseId: number | string) {
  return axiosClient
    .post<MomoPaymentResponse>(API_ENDPOINTS.PAYMENTS.COURSE_MOMO(courseId))
    .then((res) => res.data);
}

export function getMomoStatus(orderId: number | string) {
  return axiosClient
    .get<WalletTransactionResponse>(API_ENDPOINTS.PAYMENTS.MOMO_STATUS(orderId))
    .then((res) => res.data);
}
