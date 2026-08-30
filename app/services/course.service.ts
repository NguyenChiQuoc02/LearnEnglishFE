import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "@/app/constants/api.constants";
import type { CourseType } from "@/app/constants/course.constants";
import type {
  CourseRequest,
  CourseResponse,
  CourseStudentResponse,
  LeaderboardEntryResponse,
  LearningSessionSummaryResponse,
  VocabularyItemRequest,
  VocabularyItemResponse,
} from "@/app/types";

export function listCourses(type?: CourseType) {
  return axiosClient
    .get<CourseResponse[]>(API_ENDPOINTS.COURSES.BASE, {
      params: type ? { type } : undefined,
    })
    .then((res) => res.data);
}

export function listManagedCourses() {
  return axiosClient
    .get<CourseResponse[]>(API_ENDPOINTS.COURSES.MANAGE)
    .then((res) => res.data);
}

export function getCourse(id: number | string) {
  return axiosClient
    .get<CourseResponse>(API_ENDPOINTS.COURSES.DETAIL(id))
    .then((res) => res.data);
}

export function createCourse(payload: CourseRequest) {
  return axiosClient
    .post<CourseResponse>(API_ENDPOINTS.COURSES.BASE, payload)
    .then((res) => res.data);
}

export function updateCourse(id: number | string, payload: CourseRequest) {
  return axiosClient
    .put<CourseResponse>(API_ENDPOINTS.COURSES.DETAIL(id), payload)
    .then((res) => res.data);
}

export function listVocabulary(courseId: number | string) {
  return axiosClient
    .get<VocabularyItemResponse[]>(API_ENDPOINTS.COURSES.VOCABULARY(courseId))
    .then((res) => res.data);
}

export function addVocabularyItem(
  courseId: number | string,
  payload: VocabularyItemRequest
) {
  return axiosClient
    .post<VocabularyItemResponse>(API_ENDPOINTS.COURSES.VOCABULARY(courseId), payload)
    .then((res) => res.data);
}

export function getLeaderboard(courseId: number | string) {
  return axiosClient
    .get<LeaderboardEntryResponse[]>(API_ENDPOINTS.COURSES.LEADERBOARD(courseId))
    .then((res) => res.data);
}

export function updateVocabularyItem(
  courseId: number | string,
  itemId: number | string,
  payload: VocabularyItemRequest
) {
  return axiosClient
    .put<VocabularyItemResponse>(API_ENDPOINTS.COURSES.VOCABULARY_ITEM(courseId, itemId), payload)
    .then((res) => res.data);
}

export function listCourseStudents(courseId: number | string) {
  return axiosClient
    .get<CourseStudentResponse[]>(API_ENDPOINTS.COURSES.STUDENTS(courseId))
    .then((res) => res.data);
}

export function listStudentSessions(courseId: number | string, userId: number | string) {
  return axiosClient
    .get<LearningSessionSummaryResponse[]>(API_ENDPOINTS.COURSES.STUDENT_SESSIONS(courseId, userId))
    .then((res) => res.data);
}
