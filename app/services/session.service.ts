import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type {
  CompleteSessionResponse,
  StartSessionResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@/app/types";

export function startLearningSession(courseId: number | string) {
  return axiosClient
    .post<StartSessionResponse>(API_ENDPOINTS.LEARNING_SESSIONS.START, {
      courseId: Number(courseId),
    })
    .then((res) => res.data);
}

export function submitSessionAnswer(
  sessionId: number | string,
  payload: SubmitAnswerRequest
) {
  return axiosClient
    .post<SubmitAnswerResponse>(API_ENDPOINTS.LEARNING_SESSIONS.ANSWER(sessionId), payload)
    .then((res) => res.data);
}

export function completeSession(sessionId: number | string) {
  return axiosClient
    .post<CompleteSessionResponse>(API_ENDPOINTS.LEARNING_SESSIONS.COMPLETE(sessionId))
    .then((res) => res.data);
}
