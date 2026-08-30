export type SessionWordResponse = {
  vocabularyItemId: number;
  // Present so the client can compute letter-by-letter hints locally — must
  // never be rendered before the learner answers.
  word: string;
  phonetic: string | null;
  partOfSpeech: string | null;
  meaning: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  orderIndex: number;
};

export type StartSessionResponse = {
  sessionId: number;
  courseId: number;
  totalWords: number;
  words: SessionWordResponse[];
};

export type SubmitAnswerRequest = {
  vocabularyItemId: number;
  answer?: string;
  skipped?: boolean;
  usedHint?: boolean;
};

export type SubmitAnswerResponse = {
  correct: boolean;
  correctWord: string;
  pointsEarned: number;
  sessionScoreSoFar: number;
};

export type LearningSessionStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type LearningSessionSummaryResponse = {
  sessionId: number;
  totalWords: number;
  correctCount: number;
  wrongCount: number;
  scoreEarned: number;
  status: LearningSessionStatus;
  startedAt: string;
  completedAt: string | null;
};

export type CompleteSessionResponse = {
  sessionId: number;
  totalWords: number;
  correctCount: number;
  wrongCount: number;
  scoreEarned: number;
  enrollmentTotalScore: number;
};

