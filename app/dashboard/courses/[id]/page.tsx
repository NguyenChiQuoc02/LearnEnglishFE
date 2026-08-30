"use client";

import { use, useEffect, useState } from "react";
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
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load course"));
  }, [id]);

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
      setSaveError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setSaving(false);
    }
  }

  if (loadError) return <Alert severity="error">{loadError}</Alert>;
  if (!course) return null;

  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {course.title}
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Box component="form" onSubmit={handleSave}>
            <Stack spacing={2}>
              {saveError && <Alert severity="error">{saveError}</Alert>}

              <TextField
                label="Title"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={course.description ?? ""}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                select
                label="Course type"
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
                label="Level"
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

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Words / session"
                  type="number"
                  value={course.wordsPerSession}
                  onChange={(e) => setCourse({ ...course, wordsPerSession: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Points / correct"
                  type="number"
                  value={course.pointsPerCorrect}
                  onChange={(e) => setCourse({ ...course, pointsPerCorrect: Number(e.target.value) })}
                  fullWidth
                />
                <TextField
                  label="Points / wrong"
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
                label="Published"
              />

              <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: "flex-start" }}>
                {saving ? "Saving..." : "Save changes"}
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
      setError(err instanceof Error ? err.message : "Failed to add word");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Vocabulary ({words.length})
      </Typography>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell>Phonetic</TableCell>
              <TableCell>POS</TableCell>
              <TableCell>Meaning</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                  <Tooltip title="Edit word">
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
                    No vocabulary yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Add a word
          </Typography>
          <Box component="form" onSubmit={handleAdd}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Word"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Phonetic"
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Part of speech"
                  value={partOfSpeech}
                  onChange={(e) => setPartOfSpeech(e.target.value)}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Meaning"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Audio URL"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  fullWidth
                />
              </Stack>
              <Button type="submit" variant="contained" disabled={adding} sx={{ alignSelf: "flex-start" }}>
                {adding ? "Adding..." : "Add word"}
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateVocabularyItem(courseId, item.id, form);
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update word");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit word</DialogTitle>
      <Box component="form" onSubmit={handleSave}>
        <DialogContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Word"
                value={form.word}
                onChange={(e) => setForm({ ...form, word: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Phonetic"
                value={form.phonetic}
                onChange={(e) => setForm({ ...form, phonetic: e.target.value })}
                fullWidth
              />
              <TextField
                label="Part of speech"
                value={form.partOfSpeech}
                onChange={(e) => setForm({ ...form, partOfSpeech: e.target.value })}
                fullWidth
              />
            </Stack>
            <TextField
              label="Meaning"
              value={form.meaning}
              onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              fullWidth
            />
            <TextField
              label="Example sentence"
              value={form.exampleSentence}
              onChange={(e) => setForm({ ...form, exampleSentence: e.target.value })}
              fullWidth
            />
            <TextField
              label="Example translation"
              value={form.exampleTranslation}
              onChange={(e) => setForm({ ...form, exampleTranslation: e.target.value })}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                fullWidth
              />
              <TextField
                label="Audio URL"
                value={form.audioUrl}
                onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
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

  useEffect(() => {
    listCourseStudents(courseId)
      .then(setStudents)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load students"));
  }, [courseId]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Students {students ? `(${students.length})` : ""}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Words learned</TableCell>
              <TableCell>Last studied</TableCell>
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
                    No students enrolled yet.
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

  useEffect(() => {
    listStudentSessions(courseId, student.userId)
      .then(setSessions)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load history"));
  }, [courseId, student.userId]);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lịch sử học của {student.username}</DialogTitle>
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
                <TableCell>Bắt đầu</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Tổng từ</TableCell>
                <TableCell align="right">Đúng</TableCell>
                <TableCell align="right">Sai</TableCell>
                <TableCell align="right">Điểm</TableCell>
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
                      Chưa có phiên học nào.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
