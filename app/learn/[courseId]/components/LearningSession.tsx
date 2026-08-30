"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";
import PauseCircleOutlineRoundedIcon from "@mui/icons-material/PauseCircleOutlineRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { getCourse } from "@/app/services/course.service";
import { completeSession, startLearningSession, submitSessionAnswer } from "@/app/services/session.service";
import type {
  CompleteSessionResponse,
  CourseResponse,
  SessionWordResponse,
  StartSessionResponse,
} from "@/app/types";
import { getAuth } from "@/app/utils/auth-storage";
import { mockCourse, mockWords, scoringConfig, type MockVocabWord } from "../data/mock-session";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Speaks a word using the browser's built-in Web Speech API — no audio file needed.
function speak(word: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function playAudio(url: string) {
  const audio = new Audio(url);
  audio.play().catch(() => {});
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildLetterTiles(word: string): string[] {
  const uniqueLetters = Array.from(new Set(word.toUpperCase().split("")));
  const decoyPool = ALPHABET.filter((letter) => !uniqueLetters.includes(letter));
  const decoys = shuffle(decoyPool).slice(0, Math.min(3, decoyPool.length));
  return shuffle([...uniqueLetters, ...decoys]);
}

// Generic on-screen QWERTY keyboard — used for real courses where the target
// word is unknown to the client, so tiles can't be limited to its letters.
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  disabled,
}: {
  onKeyPress: (letter: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}) {
  return (
    <Stack spacing={1} sx={{ alignItems: "center" }}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <Stack key={row} direction="row" spacing={0.75}>
          {row.split("").map((letter) => (
            <Button
              key={letter}
              onClick={() => onKeyPress(letter)}
              disabled={disabled}
              variant="outlined"
              sx={{ minWidth: 36, width: 36, height: 44, borderRadius: 1.5, fontWeight: 700, bgcolor: "white", p: 0 }}
            >
              {letter}
            </Button>
          ))}
          {rowIndex === KEYBOARD_ROWS.length - 1 && (
            <Button
              onClick={onBackspace}
              disabled={disabled}
              variant="outlined"
              sx={{ minWidth: 64, height: 44, borderRadius: 1.5, fontWeight: 700, bgcolor: "white" }}
            >
              ⌫
            </Button>
          )}
        </Stack>
      ))}
    </Stack>
  );
}

export default function LearningSession({ courseId }: { courseId: string }) {
  if (courseId === "demo") {
    return <DemoLearningSession />;
  }
  return <RealLearningSession courseId={courseId} />;
}

type Feedback =
  | { state: "idle" }
  | { state: "correct"; points: number }
  | { state: "wrong"; points: number; skipped: boolean; correctWord?: string };

// Self-contained preview used on the marketing homepage — no login/API required.
function DemoLearningSession() {
  const router = useRouter();
  const { t } = useTranslation();
  const [wordIndex, setWordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ state: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  const words = mockWords;
  const currentWord: MockVocabWord | undefined = words[wordIndex];
  const isSessionComplete = wordIndex >= words.length;

  const letterTiles = useMemo(
    () => (currentWord ? buildLetterTiles(currentWord.word) : []),
    [currentWord]
  );

  const progress = Math.min(100, Math.round((wordIndex / words.length) * 100));

  useEffect(() => {
    if (currentWord) speak(currentWord.word);
  }, [currentWord]);

  function appendLetter(letter: string) {
    if (feedback.state !== "idle") return;
    setAnswer((prev) => prev + letter);
    inputRef.current?.focus();
  }

  function goToNextWord() {
    setAnswer("");
    setFeedback({ state: "idle" });
    setWordIndex((prev) => prev + 1);
  }

  function submitAnswer() {
    if (!currentWord || feedback.state !== "idle") return;
    const isCorrect = answer.trim().toLowerCase() === currentWord.word.toLowerCase();

    if (isCorrect) {
      setScore((prev) => prev + scoringConfig.pointsPerCorrect);
      setCorrectCount((prev) => prev + 1);
      setFeedback({ state: "correct", points: scoringConfig.pointsPerCorrect });
    } else {
      setScore((prev) => prev + scoringConfig.pointsPerWrong);
      setWrongCount((prev) => prev + 1);
      setFeedback({ state: "wrong", points: scoringConfig.pointsPerWrong, skipped: false });
    }
  }

  function giveUpWord() {
    if (!currentWord || feedback.state !== "idle") return;
    setAnswer(currentWord.word);
    setScore((prev) => prev + scoringConfig.pointsPerWrong);
    setWrongCount((prev) => prev + 1);
    setFeedback({ state: "wrong", points: scoringConfig.pointsPerWrong, skipped: true });
  }

  function useHint() {
    if (!currentWord || feedback.state !== "idle") return;
    const nextIndex = answer.length;
    if (nextIndex >= currentWord.word.length) return;
    setAnswer(currentWord.word.slice(0, nextIndex + 1));
  }

  if (isSessionComplete) {
    return (
      <SessionCompleteScreen
        title={mockCourse.title}
        correctCount={correctCount}
        wrongCount={wrongCount}
        score={score}
        onBack={() => router.push("/")}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <SessionScreen
      headerTitle={`${mockCourse.title} - ${mockCourse.teacher.toUpperCase()}`}
      progress={progress}
      score={score}
      onExit={() => router.push("/")}
      illustration={<Typography sx={{ fontSize: 56 }}>{currentWord.illustration}</Typography>}
      phonetic={currentWord.phonetic}
      partOfSpeech={currentWord.partOfSpeech}
      meaning={currentWord.meaning}
      onSpeak={() => speak(currentWord.word)}
      sideActions={
        <Button
          startIcon={<HelpOutlineRoundedIcon />}
          variant="outlined"
          onClick={giveUpWord}
          disabled={feedback.state !== "idle"}
          sx={{ bgcolor: "white", whiteSpace: "nowrap" }}
        >
          {t("learnSession.dontKnowButton")}
        </Button>
      }
    >
      <TextField
        inputRef={inputRef}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitAnswer();
        }}
        disabled={feedback.state !== "idle"}
        fullWidth
        autoFocus
        placeholder={t("learnSession.typePlaceholder")}
        slotProps={{
          input: {
            sx: { textTransform: "uppercase", fontSize: 20, fontWeight: 700, bgcolor: "white" },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": { borderColor: "#1ba9b8", borderWidth: 2 },
          },
        }}
      />

      {feedback.state === "idle" && (
        <>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            {letterTiles.map((letter, i) => (
              <Button
                key={`${letter}-${i}`}
                onClick={() => appendLetter(letter)}
                variant="outlined"
                sx={{
                  minWidth: 48,
                  height: 48,
                  borderRadius: 2,
                  fontSize: 18,
                  fontWeight: 700,
                  position: "relative",
                  bgcolor: "white",
                }}
              >
                {letter}
                <Typography
                  component="span"
                  sx={{ position: "absolute", bottom: 2, right: 4, fontSize: 9, color: "text.secondary" }}
                >
                  {i + 1}
                </Typography>
              </Button>
            ))}
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button startIcon={<AutoFixHighRoundedIcon />} variant="outlined" onClick={useHint} sx={{ bgcolor: "white" }}>
              {t("learnSession.hintButton")}
            </Button>
            <Button variant="contained" onClick={submitAnswer} disabled={!answer.trim()}>
              {t("learnSession.checkButton")}
            </Button>
          </Stack>
        </>
      )}

      {feedback.state === "correct" && (
        <FeedbackBanner correct points={feedback.points} onContinue={goToNextWord} />
      )}

      {feedback.state === "wrong" && (
        <FeedbackBanner
          correct={false}
          points={feedback.points}
          skipped={feedback.skipped}
          correctWord={currentWord.word}
          onContinue={goToNextWord}
        />
      )}
    </SessionScreen>
  );
}

// Real session backed by the LearningEnglish API — the target word is withheld
// by the server (SessionWordResponse). Typing help is provided via a generic
// on-screen keyboard, and hints are fetched one letter at a time from
// /learning-sessions/{id}/hint instead of being derived client-side.
function RealLearningSession({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [session, setSession] = useState<StartSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ state: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [completion, setCompletion] = useState<CompleteSessionResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!getAuth()) {
      router.replace("/login");
      return;
    }
    Promise.all([startLearningSession(courseId), getCourse(courseId)])
      .then(([sessionRes, courseRes]) => {
        setSession(sessionRes);
        setCourse(courseRes);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("learnSession.errorStartSession")));
  }, [courseId, router, t]);

  const words: SessionWordResponse[] = session?.words ?? [];
  const currentWord = words[wordIndex];
  const totalWords = session?.totalWords ?? 0;
  const isSessionComplete = session != null && wordIndex >= words.length;
  const progress = totalWords ? Math.min(100, Math.round((wordIndex / totalWords) * 100)) : 0;

  useEffect(() => {
    if (currentWord?.audioUrl) playAudio(currentWord.audioUrl);
  }, [currentWord]);

  useEffect(() => {
    if (!isSessionComplete || !session || completion) return;
    completeSession(session.sessionId)
      .then(setCompletion)
      .catch((err) => setError(err instanceof Error ? err.message : t("learnSession.errorCompleteSession")));
  }, [isSessionComplete, session, completion, t]);

  // Enter continues to the next word once feedback for the current one is showing —
  // the answer field is disabled at that point, so its own onKeyDown won't fire.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && feedback.state !== "idle") {
        goToNextWord();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [feedback]);

  function goToNextWord() {
    setAnswer("");
    setFeedback({ state: "idle" });
    setUsedHint(false);
    setWordIndex((prev) => prev + 1);
  }

  function appendLetter(letter: string) {
    if (feedback.state !== "idle") return;
    setAnswer((prev) => prev + letter);
    inputRef.current?.focus();
  }

  function backspace() {
    if (feedback.state !== "idle") return;
    setAnswer((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  }

  // The target word rides along in the session payload (never rendered) purely
  // so this can reveal one more letter locally, without a round-trip to the API.
  function useHint() {
    if (!currentWord || feedback.state !== "idle") return;
    const nextIndex = answer.length;
    if (nextIndex >= currentWord.word.length - 1) return;
    setAnswer(currentWord.word.slice(0, nextIndex + 1));
    setUsedHint(true);
  }

  async function submitAnswer(skipped: boolean) {
    if (!session || !currentWord || feedback.state !== "idle" || submitting) return;
    setSubmitting(true);
    try {
      const result = await submitSessionAnswer(session.sessionId, {
        vocabularyItemId: currentWord.vocabularyItemId,
        answer: skipped ? "" : answer,
        skipped,
        usedHint,
      });
      setScore(result.sessionScoreSoFar);
      // The target word is only revealed now — play the recorded audio if the
      // teacher uploaded one, otherwise fall back to browser TTS like the demo.
      if (currentWord.audioUrl) {
        playAudio(currentWord.audioUrl);
      } else if (result.correctWord) {
        speak(result.correctWord);
      }
      if (result.correct) {
        setCorrectCount((prev) => prev + 1);
        setFeedback({ state: "correct", points: result.pointsEarned });
      } else {
        setWrongCount((prev) => prev + 1);
        setFeedback({
          state: "wrong",
          points: result.pointsEarned,
          skipped,
          correctWord: result.correctWord,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("learnSession.errorSubmitAnswer"));
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" onClick={() => router.push("/courses")}>
            {t("learnSession.backToCoursesButton")}
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!session || !course) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isSessionComplete) {
    return (
      <SessionCompleteScreen
        title={course.title}
        correctCount={completion?.correctCount ?? correctCount}
        wrongCount={completion?.wrongCount ?? wrongCount}
        score={completion?.scoreEarned ?? score}
        onBack={() => router.push("/courses")}
        loading={!completion}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <SessionScreen
      headerTitle={`${course.title} - ${course.teacherName.toUpperCase()}`}
      progress={progress}
      score={score}
      onExit={() => router.push("/courses")}
      illustration={
        currentWord.imageUrl ? (
          <Box
            component="img"
            src={currentWord.imageUrl}
            alt={t("learnSession.illustrationAlt")}
            sx={{ maxWidth: "100%", maxHeight: 90, borderRadius: 1 }}
          />
        ) : (
          <Typography sx={{ fontSize: 56 }}>📘</Typography>
        )
      }
      phonetic={currentWord.phonetic ?? ""}
      partOfSpeech={currentWord.partOfSpeech ?? ""}
      meaning={currentWord.meaning ?? ""}
      onSpeak={currentWord.audioUrl ? () => playAudio(currentWord.audioUrl!) : undefined}
      sideActions={
        <Button
          startIcon={<HelpOutlineRoundedIcon />}
          variant="outlined"
          onClick={() => submitAnswer(true)}
          disabled={feedback.state !== "idle" || submitting}
          sx={{ bgcolor: "white", whiteSpace: "nowrap" }}
        >
          {t("learnSession.dontKnowButton")}
        </Button>
      }
    >
      <TextField
        inputRef={inputRef}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitAnswer(false);
        }}
        disabled={feedback.state !== "idle" || submitting}
        fullWidth
        autoFocus
        placeholder={t("learnSession.typePlaceholder")}
        slotProps={{
          input: {
            sx: { textTransform: "uppercase", fontSize: 20, fontWeight: 700, bgcolor: "white" },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "& fieldset": { borderColor: "#1ba9b8", borderWidth: 2 },
          },
        }}
      />

      {feedback.state === "idle" && (
        <>
          <VirtualKeyboard onKeyPress={appendLetter} onBackspace={backspace} disabled={submitting} />
          <Stack direction="row" spacing={1.5}>
            <Tooltip title={t("learnSession.tooltipHint")}>
              <span>
                <Button
                  startIcon={<AutoFixHighRoundedIcon />}
                  variant="outlined"
                  onClick={useHint}
                  disabled={submitting}
                  sx={{ bgcolor: "white" }}
                >
                  {t("learnSession.hintButton")}
                </Button>
              </span>
            </Tooltip>
            <Button variant="contained" onClick={() => submitAnswer(false)} disabled={!answer.trim() || submitting}>
              {submitting ? t("learnSession.checking") : t("learnSession.checkButton")}
            </Button>
          </Stack>
        </>
      )}

      {feedback.state === "correct" && (
        <FeedbackBanner correct points={feedback.points} onContinue={goToNextWord} />
      )}

      {feedback.state === "wrong" && (
        <FeedbackBanner
          correct={false}
          points={feedback.points}
          skipped={feedback.skipped}
          correctWord={feedback.correctWord ?? ""}
          onContinue={goToNextWord}
        />
      )}
    </SessionScreen>
  );
}

function FeedbackBanner({
  correct,
  points,
  skipped = false,
  correctWord,
  onContinue,
}: {
  correct: boolean;
  points: number;
  skipped?: boolean;
  correctWord?: string;
  onContinue: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Stack spacing={1.5}>
      <Box sx={{ bgcolor: correct ? "#d8f5d0" : "#fbd8d8", borderRadius: 2, p: 2 }}>
        <Typography sx={{ fontWeight: 700, color: correct ? "#2b7a2b" : "#b3261e" }}>
          {correct
            ? t("learnSession.correctFeedback", { points })
            : `${skipped ? t("learnSession.skippedNotice") : t("learnSession.wrongNotice")} ${t("learnSession.answerLabel")}`}
          {!correct && <strong>{correctWord}</strong>}
          {!correct && t("learnSession.pointsSuffix", { points })}
        </Typography>
      </Box>
      <Button variant="contained" onClick={onContinue}>
        {t("learnSession.continueButton")}
      </Button>
    </Stack>
  );
}

function SessionCompleteScreen({
  title,
  correctCount,
  wrongCount,
  score,
  onBack,
  loading,
}: {
  title: string;
  correctCount: number;
  wrongCount: number;
  score: number;
  onBack: () => void;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fdf6e3",
        p: 2,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: 4,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t("learnSession.completeTitle")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {title}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", py: 1 }}>
          <Chip color="success" label={t("learnSession.correctChipLabel", { count: correctCount })} />
          <Chip color="error" label={t("learnSession.wrongChipLabel", { count: wrongCount })} />
        </Stack>
        {loading ? (
          <CircularProgress size={28} sx={{ alignSelf: "center" }} />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1ba9b8" }}>
            {t("learnSession.scoreLabel", { score })}
          </Typography>
        )}
        <Button variant="contained" size="large" onClick={onBack}>
          {t("learnSession.backButton")}
        </Button>
      </Stack>
    </Box>
  );
}

function SessionScreen({
  headerTitle,
  progress,
  score,
  onExit,
  illustration,
  phonetic,
  partOfSpeech,
  meaning,
  onSpeak,
  sideActions,
  children,
}: {
  headerTitle: string;
  progress: number;
  score: number;
  onExit: () => void;
  illustration: React.ReactNode;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  onSpeak?: () => void;
  sideActions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fdf6e3", display: "flex", flexDirection: "column" }}>
      <Box sx={{ bgcolor: "#a7e3ee", px: 3, py: 1.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontSize: 22 }}>🦜</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, textDecoration: "underline" }}>
            {headerTitle}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={t("learnSession.tooltipKeyboard")}>
            <IconButton size="small" sx={{ bgcolor: "white" }}>
              <KeyboardRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("learnSession.tooltipExit")}>
            <IconButton size="small" sx={{ bgcolor: "white" }} onClick={onExit}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center", px: 3, py: 2, maxWidth: 960, mx: "auto", width: "100%" }}>
        <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1, height: 10, borderRadius: 5 }} />
        <Chip label={score} sx={{ fontWeight: 700, bgcolor: "white" }} variant="outlined" />
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{
          px: { xs: 3, md: 6 },
          py: 2,
          flexGrow: 1,
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "center",
          maxWidth: 960,
          mx: "auto",
          width: "100%",
        }}
      >
        <Stack spacing={1.5} sx={{ alignItems: "center", minWidth: 180 }}>
          <Box
            sx={{
              width: 180,
              height: 150,
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {illustration}
            {meaning && (
              <Typography sx={{ color: "#e63946", fontWeight: 700, fontStyle: "italic" }}>{meaning}</Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {phonetic && (
              <Chip label={phonetic} sx={{ bgcolor: "#5fd9c9", color: "white", fontWeight: 700 }} />
            )}
            {partOfSpeech && (
              <Chip label={`(${partOfSpeech})`} sx={{ bgcolor: "#5fd9c9", color: "white", fontWeight: 700 }} />
            )}
            {onSpeak && (
              <Tooltip title={t("learnSession.tooltipListen")}>
                <IconButton size="small" onClick={onSpeak} sx={{ bgcolor: "white", boxShadow: 1 }}>
                  <VolumeUpRoundedIcon fontSize="small" sx={{ color: "#1ba9b8" }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        <Stack spacing={1.5} sx={{ flexGrow: 1, maxWidth: 520 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {t("learnSession.englishLabel")}
          </Typography>
          {children}
        </Stack>

        <Stack spacing={2} sx={{ alignItems: "center", minWidth: 140 }}>
          {sideActions}
          <Stack direction="row" spacing={1}>
            <BoltRoundedIcon sx={{ color: "#f4a300" }} />
            <PauseCircleOutlineRoundedIcon sx={{ color: "text.disabled" }} />
          </Stack>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "#f0e6d6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🌱
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
