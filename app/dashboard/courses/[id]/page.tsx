"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import BackButton from "@/app/dashboard/components/BackButton";
import SectionLabel from "@/app/dashboard/components/SectionLabel";
import {
  addVocabularyItem,
  getCourse,
  listCourseStudents,
  listStudentSessions,
  listVocabulary,
  updateCourse,
  updateVocabularyItem,
} from "@/app/services/course.service";
import type {
  CourseResponse,
  CourseStudentResponse,
  LearningSessionSummaryResponse,
  VocabularyItemRequest,
  VocabularyItemResponse,
} from "@/app/types";
import { COURSE_LEVELS, COURSE_TYPES } from "@/app/constants/course.constants";

export default function CourseDetailPage(props: PageProps<"/dashboard/courses/[id]">) {
  const { id } = use(props.params);
  const { t } = useTranslation();
  const router = useRouter();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [words, setWords] = useState<VocabularyItemResponse[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getCourse(id), listVocabulary(id)])
      .then(([courseData, wordsData]) => {
        setCourse(courseData);
        setWords(wordsData);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : t("courseDetail.errorLoadCourse")));
  }, [id, t]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setSaveError(null);
    setSaving(true);
    try {
      const updated = await updateCourse(id, {
        title: course.title,
        description: course.description ?? undefined,
        courseType: course.courseType,
        level: course.level ?? undefined,
        teacherId: course.teacherId,
        wordsPerSession: course.wordsPerSession,
        pointsPerCorrect: course.pointsPerCorrect,
        pointsPerWrong: course.pointsPerWrong,
        published: course.published,
      });
      setCourse(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("courseDetail.errorSaveCourse"));
    } finally {
      setSaving(false);
    }
  }

  if (loadError) return <Alert severity="error">{loadError}</Alert>;
  if (!course) return null;

  return (
    <Stack spacing={3} sx={{ maxWidth: 720, mx: "auto" }}>
      <BackButton onClick={() => router.push("/dashboard/courses")} />

      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {course.title}
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSave}>
            <Stack spacing={3}>
              {saveError && <Alert severity="error">{saveError}</Alert>}

              <Stack spacing={2}>
                <SectionLabel>{t("courseDetail.sectionInfo")}</SectionLabel>

                <TextField
                  label={t("courseDetail.fieldTitle")}
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label={t("courseDetail.fieldDescription")}
                  value={course.description ?? ""}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  multiline
                  minRows={2}
                  fullWidth
                />
                <TextField
                  select
                  label={t("courseDetail.fieldCourseType")}
                  value={course.courseType}
                  onChange={(e) =>
                    setCourse({ ...course, courseType: e.target.value as CourseResponse["courseType"] })
                  }
                  fullWidth
                >
                  {COURSE_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t("courseDetail.fieldLevel")}
                  value={course.level ?? ""}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      level: (e.target.value || null) as CourseResponse["level"],
                    })
                  }
                  fullWidth
                >
                  <MenuItem value="">—</MenuItem>
                  {COURSE_LEVELS.map((lvl) => (
                    <MenuItem key={lvl} value={lvl}>
                      {lvl}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <SectionLabel>{t("courseDetail.sectionSettings")}</SectionLabel>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label={t("courseDetail.fieldWordsPerSession")}
                    type="number"
                    value={course.wordsPerSession}
                    onChange={(e) => setCourse({ ...course, wordsPerSession: Number(e.target.value) })}
                    fullWidth
                  />
                  <TextField
                    label={t("courseDetail.fieldPointsPerCorrect")}
                    type="number"
                    value={course.pointsPerCorrect}
                    onChange={(e) => setCourse({ ...course, pointsPerCorrect: Number(e.target.value) })}
                    fullWidth
                  />
                  <TextField
                    label={t("courseDetail.fieldPointsPerWrong")}
                    type="number"
                    value={course.pointsPerWrong}
                    onChange={(e) => setCourse({ ...course, pointsPerWrong: Number(e.target.value) })}
                    fullWidth
                  />
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      checked={course.published}
                      onChange={(e) => setCourse({ ...course, published: e.target.checked })}
                    />
                  }
                  label={t("courseDetail.fieldPublished")}
                />
              </Stack>

              <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: "flex-start" }}>
                {saving ? t("common.saving") : t("courseDetail.saveChanges")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Divider />

      <VocabularySection
        courseId={id}
        words={words}
        onAdded={(w) => setWords((prev) => [...prev, w])}
        onUpdated={(w) => setWords((prev) => prev.map((x) => (x.id === w.id ? w : x)))}
      />

      <Divider />

      <StudentsSection courseId={id} />
    </Stack>
  );
}

function VocabularySection({
  courseId,
  words,
  onAdded,
  onUpdated,
}: {
  courseId: string;
  words: VocabularyItemResponse[];
  onAdded: (word: VocabularyItemResponse) => void;
  onUpdated: (word: VocabularyItemResponse) => void;
}) {
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [meaning, setMeaning] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabularyItemResponse | null>(null);
  const { t } = useTranslation();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAdding(true);
    try {
      const created = await addVocabularyItem(courseId, {
        word,
        phonetic: phonetic || undefined,
        partOfSpeech: partOfSpeech || undefined,
        meaning: meaning || undefined,
        imageUrl: imageUrl || undefined,
        audioUrl: audioUrl || undefined,
      });
      onAdded(created);
      setWord("");
      setPhonetic("");
      setPartOfSpeech("");
      setMeaning("");
      setImageUrl("");
      setAudioUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("courseDetail.vocabulary.errorAddWord"));
    } finally {
      setAdding(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t("courseDetail.vocabulary.title", { count: words.length })}
      </Typography>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("courseDetail.vocabulary.columnWord")}</TableCell>
              <TableCell>{t("courseDetail.vocabulary.columnPhonetic")}</TableCell>
              <TableCell>{t("courseDetail.vocabulary.columnPos")}</TableCell>
              <TableCell>{t("courseDetail.vocabulary.columnMeaning")}</TableCell>
              <TableCell align="right">{t("common.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words.map((w) => (
              <TableRow key={w.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{w.word}</TableCell>
                <TableCell>{w.phonetic}</TableCell>
                <TableCell>{w.partOfSpeech}</TableCell>
                <TableCell>{w.meaning}</TableCell>
                <TableCell align="right">
                  <Tooltip title={t("courseDetail.vocabulary.editWordTooltip")}>
                    <IconButton size="small" onClick={() => setEditingItem(w)}>
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {words.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                    {t("courseDetail.vocabulary.emptyNoVocabulary")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            {t("courseDetail.vocabulary.addWordTitle")}
          </Typography>
          <Box component="form" onSubmit={handleAdd}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" spacing={2}>
                <TextField
                  label={t("courseDetail.vocabulary.fieldWord")}
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label={t("courseDetail.vocabulary.fieldPhonetic")}
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  fullWidth
                />
                <TextField
                  label={t("courseDetail.vocabulary.fieldPartOfSpeech")}
                  value={partOfSpeech}
                  onChange={(e) => setPartOfSpeech(e.target.value)}
                  fullWidth
                />
              </Stack>
              <TextField
                label={t("courseDetail.vocabulary.fieldMeaning")}
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label={t("courseDetail.vocabulary.fieldImageUrl")}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  fullWidth
                />
                <TextField
                  label={t("courseDetail.vocabulary.fieldAudioUrl")}
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  fullWidth
                />
              </Stack>
              <Button type="submit" variant="contained" disabled={adding} sx={{ alignSelf: "flex-start" }}>
                {adding ? t("courseDetail.vocabulary.adding") : t("courseDetail.vocabulary.addWord")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {editingItem && (
        <EditVocabularyDialog
          courseId={courseId}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={(updated) => {
            onUpdated(updated);
            setEditingItem(null);
          }}
        />
      )}
    </Stack>
  );
}

function EditVocabularyDialog({
  courseId,
  item,
  onClose,
  onSaved,
}: {
  courseId: string;
  item: VocabularyItemResponse;
  onClose: () => void;
  onSaved: (item: VocabularyItemResponse) => void;
}) {
  const [form, setForm] = useState<VocabularyItemRequest>({
    word: item.word,
    phonetic: item.phonetic ?? "",
    partOfSpeech: item.partOfSpeech ?? "",
    meaning: item.meaning ?? "",
    exampleSentence: item.exampleSentence ?? "",
    exampleTranslation: item.exampleTranslation ?? "",
    imageUrl: item.imageUrl ?? "",
    audioUrl: item.audioUrl ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateVocabularyItem(courseId, item.id, form);
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("courseDetail.vocabulary.errorUpdateWord"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("courseDetail.vocabulary.editDialogTitle")}</DialogTitle>
      <Box component="form" onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction="row" spacing={2}>
              <TextField
                label={t("courseDetail.vocabulary.fieldWord")}
                value={form.word}
                onChange={(e) => setForm({ ...form, word: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label={t("courseDetail.vocabulary.fieldPhonetic")}
                value={form.phonetic}
                onChange={(e) => setForm({ ...form, phonetic: e.target.value })}
                fullWidth
              />
              <TextField
                label={t("courseDetail.vocabulary.fieldPartOfSpeech")}
                value={form.partOfSpeech}
                onChange={(e) => setForm({ ...form, partOfSpeech: e.target.value })}
                fullWidth
              />
            </Stack>
            <TextField
              label={t("courseDetail.vocabulary.fieldMeaning")}
              value={form.meaning}
              onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              fullWidth
            />
            <TextField
              label={t("courseDetail.vocabulary.fieldExampleSentence")}
              value={form.exampleSentence}
              onChange={(e) => setForm({ ...form, exampleSentence: e.target.value })}
              fullWidth
            />
            <TextField
              label={t("courseDetail.vocabulary.fieldExampleTranslation")}
              value={form.exampleTranslation}
              onChange={(e) => setForm({ ...form, exampleTranslation: e.target.value })}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label={t("courseDetail.vocabulary.fieldImageUrl")}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                fullWidth
              />
              <TextField
                label={t("courseDetail.vocabulary.fieldAudioUrl")}
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function StudentsSection({ courseId }: { courseId: string }) {
  const [students, setStudents] = useState<CourseStudentResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<CourseStudentResponse | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    listCourseStudents(courseId)
      .then(setStudents)
      .catch((err) => setError(err instanceof Error ? err.message : t("courseDetail.students.errorLoadStudents")));
  }, [courseId, t]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {t("courseDetail.students.title")} {students ? `(${students.length})` : ""}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("courseDetail.students.columnUsername")}</TableCell>
              <TableCell>{t("courseDetail.students.columnEmail")}</TableCell>
              <TableCell>{t("courseDetail.students.columnStatus")}</TableCell>
              <TableCell align="right">{t("courseDetail.students.columnScore")}</TableCell>
              <TableCell align="right">{t("courseDetail.students.columnWordsLearned")}</TableCell>
              <TableCell>{t("courseDetail.students.columnLastStudied")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((s) => (
              <TableRow
                key={s.enrollmentId}
                hover
                onClick={() => setSelectedStudent(s)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{s.username}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={s.status}
                    color={s.status === "ACTIVE" ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{s.totalScore}</TableCell>
                <TableCell align="right">{s.wordsLearnedCount}</TableCell>
                <TableCell>
                  {s.lastStudiedAt ? new Date(s.lastStudiedAt).toLocaleString() : "—"}
                </TableCell>
              </TableRow>
            ))}
            {students?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                    {t("courseDetail.students.emptyNoStudents")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!students && !error && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {selectedStudent && (
        <StudentHistoryDialog
          courseId={courseId}
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </Stack>
  );
}

function StudentHistoryDialog({
  courseId,
  student,
  onClose,
}: {
  courseId: string;
  student: CourseStudentResponse;
  onClose: () => void;
}) {
  const [sessions, setSessions] = useState<LearningSessionSummaryResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    listStudentSessions(courseId, student.userId)
      .then(setSessions)
      .catch((err) => setError(err instanceof Error ? err.message : t("courseDetail.students.errorLoadHistory")));
  }, [courseId, student.userId, t]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("courseDetail.students.historyDialogTitle", { username: student.username })}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {!sessions && !error && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {sessions && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("courseDetail.students.historyColumnStarted")}</TableCell>
                <TableCell>{t("courseDetail.students.historyColumnStatus")}</TableCell>
                <TableCell align="right">{t("courseDetail.students.historyColumnTotalWords")}</TableCell>
                <TableCell align="right">{t("courseDetail.students.historyColumnCorrect")}</TableCell>
                <TableCell align="right">{t("courseDetail.students.historyColumnWrong")}</TableCell>
                <TableCell align="right">{t("courseDetail.students.historyColumnScore")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.sessionId}>
                  <TableCell>{new Date(s.startedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={s.status}
                      color={s.status === "COMPLETED" ? "success" : s.status === "ABANDONED" ? "default" : "warning"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">{s.totalWords}</TableCell>
                  <TableCell align="right">{s.correctCount}</TableCell>
                  <TableCell align="right">{s.wrongCount}</TableCell>
                  <TableCell align="right">{s.scoreEarned}</TableCell>
                </TableRow>
              ))}
              {sessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                      {t("courseDetail.students.emptyNoSessions")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("courseDetail.students.close")}</Button>
      </DialogActions>
    </Dialog>
  );
}
