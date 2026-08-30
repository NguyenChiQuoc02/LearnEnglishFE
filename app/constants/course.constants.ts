export const COURSE_TYPES = ["VOCABULARY", "TOEIC", "IELTS", "VSTEP"] as const;
export type CourseType = (typeof COURSE_TYPES)[number];

export const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type CourseLevel = (typeof COURSE_LEVELS)[number];
