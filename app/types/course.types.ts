import type { CourseLevel, CourseType } from "@/app/constants/course.constants";
import type { EnrollmentStatus } from "./enrollment.types";

export type CourseResponse = {
  id: number;
  title: string;
  description: string | null;
  courseType: CourseType;
  level: CourseLevel | null;
  thumbnailUrl: string | null;
  teacherId: number;
  teacherName: string;
  wordsPerSession: number;
  pointsPerCorrect: number;
  pointsPerWrong: number;
  totalWords: number;
  published: boolean;
  createdAt: string;
  price: number;
};

export type CourseRequest = {
  title: string;
  description?: string;
  courseType: CourseType;
  level?: CourseLevel;
  thumbnailUrl?: string;
  teacherId: number;
  wordsPerSession?: number;
  pointsPerCorrect?: number;
  pointsPerWrong?: number;
  published?: boolean;
  price?: number;
};

export type VocabularyItemResponse = {
  id: number;
  word: string;
  phonetic: string | null;
  partOfSpeech: string | null;
  meaning: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  orderIndex: number;
};

export type VocabularyItemRequest = {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  meaning?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  imageUrl?: string;
  audioUrl?: string;
  orderIndex?: number;
};

export type CourseStudentResponse = {
  enrollmentId: number;
  userId: number;
  username: string;
  email: string;
  status: EnrollmentStatus;
  totalScore: number;
  wordsLearnedCount: number;
  enrolledAt: string;
  lastStudiedAt: string | null;
};
