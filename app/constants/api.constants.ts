export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
  },
  COURSES: {
    BASE: "/courses",
    MANAGE: "/courses/manage",
    DETAIL: (id: number | string) => `/courses/${id}`,
    LEADERBOARD: (id: number | string) => `/courses/${id}/leaderboard`,
    VOCABULARY: (id: number | string) => `/courses/${id}/vocabulary`,
    VOCABULARY_ITEM: (id: number | string, itemId: number | string) =>
      `/courses/${id}/vocabulary/${itemId}`,
    STUDENTS: (id: number | string) => `/courses/${id}/students`,
    STUDENT_SESSIONS: (id: number | string, userId: number | string) =>
      `/courses/${id}/students/${userId}/sessions`,
  },
  ENROLLMENTS: {
    BASE: "/enrollments",
    ME: "/enrollments/me",
  },
  LEARNING_SESSIONS: {
    START: "/learning-sessions/start",
    ANSWER: (sessionId: number | string) => `/learning-sessions/${sessionId}/answer`,
    COMPLETE: (sessionId: number | string) => `/learning-sessions/${sessionId}/complete`,
  },
  USERS: {
    BASE: "/users",
    TEACHERS: "/users/teachers",
    DETAIL: (id: number | string) => `/users/${id}`,
    CHANGE_PASSWORD: "/users/me/password",
    IMPORT_TEMPLATE: "/users/import/template",
    IMPORT_PREVIEW: "/users/import/preview",
    IMPORT: "/users/import",
    BULK_DELETE: "/users/bulk-delete",
  },
  EXPORTS: {
    USERS: "/exports/users",
  },
} as const;
