"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createCourse } from "@/app/services/course.service";
import { listTeachers } from "@/app/services/user.service";
import type { TeacherResponse } from "@/app/types";
import { getAuth } from "@/app/utils/auth-storage";
import { COURSE_LEVELS, COURSE_TYPES } from "@/app/constants/course.constants";

export default function NewCoursePage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseType, setCourseType] = useState<string>(COURSE_TYPES[0]);
  const [level, setLevel] = useState<string>("");
  const [teacherId, setTeacherId] = useState<string>("");
  const [wordsPerSession, setWordsPerSession] = useState(10);
  const [pointsPerCorrect, setPointsPerCorrect] = useState(10);
  const [pointsPerWrong, setPointsPerWrong] = useState(-2);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.roles?.includes("ROLE_ADMIN")) {
      router.replace("/dashboard/courses");
      return;
    }
    listTeachers()
      .then(setTeachers)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load teachers"));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!teacherId) {
      setError("Please choose a teacher");
      return;
    }
    setLoading(true);
    try {
      const course = await createCourse({
        title,
        description: description || undefined,
        courseType: courseType as (typeof COURSE_TYPES)[number],
        level: (level || undefined) as (typeof COURSE_LEVELS)[number] | undefined,
        teacherId: Number(teacherId),
        wordsPerSession,
        pointsPerCorrect,
        pointsPerWrong,
        published,
      });
      router.push(`/dashboard/courses/${course.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 640 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        New course
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
              <TextField
                select
                label="Course type"
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                required
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
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                fullWidth
              >
                <MenuItem value="">—</MenuItem>
                {COURSE_LEVELS.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>
                    {lvl}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Teacher"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
                fullWidth
              >
                {teachers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.username} ({t.email})
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={2}>
                <TextField
                  label="Words / session"
                  type="number"
                  value={wordsPerSession}
                  onChange={(e) => setWordsPerSession(Number(e.target.value))}
                  fullWidth
                />
                <TextField
                  label="Points / correct"
                  type="number"
                  value={pointsPerCorrect}
                  onChange={(e) => setPointsPerCorrect(Number(e.target.value))}
                  fullWidth
                />
                <TextField
                  label="Points / wrong"
                  type="number"
                  value={pointsPerWrong}
                  onChange={(e) => setPointsPerWrong(Number(e.target.value))}
                  fullWidth
                />
              </Stack>

              <FormControlLabel
                control={
                  <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
                }
                label="Published"
              />

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? "Creating..." : "Create course"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
