export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "DROPPED";

export type EnrollmentResponse = {
  id: number;
  courseId: number;
  courseTitle: string;
  status: EnrollmentStatus;
  totalScore: number;
  wordsLearnedCount: number;
  enrolledAt: string;
  lastStudiedAt: string | null;
};

export type LeaderboardEntryResponse = {
  rank: number;
  userId: number;
  username: string;
  totalScore: number;
};
