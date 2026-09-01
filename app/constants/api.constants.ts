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
    ME: "/users/me",
    CHANGE_PASSWORD: "/users/me/password",
    IMPORT_TEMPLATE: "/users/import/template",
    IMPORT_PREVIEW: "/users/import/preview",
    IMPORT: "/users/import",
    BULK_DELETE: "/users/bulk-delete",
  },
  EXPORTS: {
    USERS: "/exports/users",
  },
  PROVINCES: {
    BASE: "/provinces",
    WARDS: (code: string) => `/provinces/${code}/wards`,
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    DETAIL: (id: number | string) => `/notifications/${id}`,
  },
  ZALO: {
    AUTH_URL: "/zalo/auth-url",
    STATUS: "/zalo/status",
    LINK_CODE: "/zalo/link-code",
    ME: "/zalo/me",
  },
  WALLET: {
    ME: "/wallet/me",
    TRANSACTIONS: "/wallet/me/transactions",
    TOPUP: "/wallet/topup",
    WITHDRAW: "/wallet/withdraw",
  },
  PAYMENTS: {
    COURSE_WALLET: (id: number | string) => `/payments/courses/${id}/wallet`,
    COURSE_MOMO: (id: number | string) => `/payments/courses/${id}/momo`,
    MOMO_STATUS: (orderId: number | string) => `/payments/momo/status/${orderId}`,
  },
  ADMIN_BUDGET: {
    OVERVIEW: "/admin/budget/overview",
    TRANSACTIONS: "/admin/budget/transactions",
    WITHDRAWALS: "/admin/budget/withdrawals",
    WITHDRAWAL_APPROVE: (id: number | string) => `/admin/budget/withdrawals/${id}/approve`,
    WITHDRAWAL_REJECT: (id: number | string) => `/admin/budget/withdrawals/${id}/reject`,
  },
} as const;
