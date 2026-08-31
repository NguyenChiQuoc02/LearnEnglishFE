import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { NotificationRequest, NotificationResponse } from "@/app/types";

export function listNotifications() {
  return axiosClient
    .get<NotificationResponse[]>(API_ENDPOINTS.NOTIFICATIONS.BASE)
    .then((res) => res.data);
}

export function getNotification(id: number | string) {
  return axiosClient
    .get<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS.DETAIL(id))
    .then((res) => res.data);
}

export function createNotification(payload: NotificationRequest) {
  return axiosClient
    .post<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS.BASE, payload)
    .then((res) => res.data);
}

export function updateNotification(id: number | string, payload: NotificationRequest) {
  return axiosClient
    .put<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS.DETAIL(id), payload)
    .then((res) => res.data);
}

export function deleteNotification(id: number | string) {
  return axiosClient.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DETAIL(id)).then((res) => res.data);
}
