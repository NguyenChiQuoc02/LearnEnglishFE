export const USER_ROLES = ["ROLE_USER", "ROLE_TEACHER", "ROLE_ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_PASSWORD = "123456";
