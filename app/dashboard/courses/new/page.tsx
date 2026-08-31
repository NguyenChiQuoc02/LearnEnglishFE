"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import BackButton from "@/app/dashboard/components/BackButton";
import SectionLabel from "@/app/dashboard/components/SectionLabel";
import { createCourse } from "@/app/services/course.service";
import { listTeachers } from "@/app/services/user.service";
import type { TeacherResponse } from "@/app/types";
import { getAuth } from "@/app/utils/auth-storage";
import { COURSE_LEVELS, COURSE_TYPES } from "@/app/constants/course.constants";

export default function NewCoursePage() {
  const router = useRouter();
  const { t } = useTranslation();
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
      .catch((err) => setError(err instanceof Error ? err.message : t("coursesAdminNew.errorLoadTeachers")));
  }, [router, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!teacherId) {
      setError(t("coursesAdminNew.errorTeacherRequired"));
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
      setError(err instanceof Error ? err.message : t("coursesAdminNew.errorCreateCourse"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: "auto" }}>
      <BackButton onClick={() => router.push("/dashboard/courses")} />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("coursesAdminNew.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("coursesAdminNew.subtitle")}
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <Stack spacing={2}>
                <SectionLabel>{t("coursesAdminNew.sectionInfo")}</SectionLabel>

                <TextField
                  label={t("coursesAdminNew.fieldTitle")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label={t("coursesAdminNew.fieldDescription")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                />
                <TextField
                  select
                  label={t("coursesAdminNew.fieldCourseType")}
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
                  label={t("coursesAdminNew.fieldLevel")}
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
                  label={t("coursesAdminNew.fieldTeacher")}
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  required
                  fullWidth
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.username} ({teacher.email})
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <SectionLabel>{t("coursesAdminNew.sectionSettings")}</SectionLabel>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label={t("coursesAdminNew.fieldWordsPerSession")}
                    type="number"
                    value={wordsPerSession}
                    onChange={(e) => setWordsPerSession(Number(e.target.value))}
                    fullWidth
                  />
                  <TextField
                    label={t("coursesAdminNew.fieldPointsPerCorrect")}
                    type="number"
                    value={pointsPerCorrect}
                    onChange={(e) => setPointsPerCorrect(Number(e.target.value))}
                    fullWidth
                  />
                  <TextField
                    label={t("coursesAdminNew.fieldPointsPerWrong")}
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
                  label={t("coursesAdminNew.fieldPublished")}
                />
              </Stack>

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? t("coursesAdminNew.submitting") : t("coursesAdminNew.submit")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
