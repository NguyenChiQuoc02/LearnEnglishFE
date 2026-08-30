"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { listCourses } from "@/app/services/course.service";
import { enrollCourse, listMyEnrollments } from "@/app/services/enrollment.service";
import type { CourseResponse, EnrollmentResponse } from "@/app/types";

export default function CoursesCatalogPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [enrollments, setEnrollments] = useState<Record<number, EnrollmentResponse>>({});
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([listCourses(), listMyEnrollments()])
      .then(([courseList, myEnrollments]) => {
        setCourses(courseList);
        setEnrollments(
          Object.fromEntries(myEnrollments.map((e) => [e.courseId, e]))
        );
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : t("publicCourses.errorLoadCourses"))
      );
  }, []);

  async function handleEnroll(courseId: number) {
    setError(null);
    setEnrollingId(courseId);
    try {
      const enrollment = await enrollCourse(courseId);
      setEnrollments((prev) => ({ ...prev, [courseId]: enrollment }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("publicCourses.errorEnroll"));
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("publicCourses.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("publicCourses.subtitle")}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {!courses && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
      >
        {courses?.map((course) => {
          const enrollment = enrollments[course.id];
          const isEnrolling = enrollingId === course.id;

          return (
            <Card key={course.id} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip size="small" label={course.courseType} color="primary" variant="outlined" />
                  {course.level && (
                    <Chip size="small" label={course.level} variant="outlined" />
                  )}
                </Stack>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {course.description ?? t("publicCourses.noDescription")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  {t("publicCourses.wordsAndTeacher", {
                    count: course.totalWords,
                    teacher: course.teacherName,
                  })}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {enrollment ? (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={() => router.push(`/learn/${course.id}`)}
                    >
                      {t("publicCourses.startLearning")}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={isEnrolling}
                      onClick={() => handleEnroll(course.id)}
                    >
                      {isEnrolling ? t("publicCourses.enrolling") : t("publicCourses.enroll")}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}

        {courses?.length === 0 && (
          <Typography color="text.secondary">{t("publicCourses.emptyNoCourses")}</Typography>
        )}
      </Box>
    </Stack>
  );
}
