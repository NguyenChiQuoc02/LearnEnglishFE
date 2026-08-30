"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        setError(err instanceof Error ? err.message : "Không tải được danh sách khóa học")
      );
  }, []);

  async function handleEnroll(courseId: number) {
    setError(null);
    setEnrollingId(courseId);
    try {
      const enrollment = await enrollCourse(courseId);
      setEnrollments((prev) => ({ ...prev, [courseId]: enrollment }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký khóa học thất bại");
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Khóa học
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Đăng ký khóa học và bắt đầu luyện từ vựng.
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
                  {course.description ?? "Chưa có mô tả."}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  {course.totalWords} từ vựng · Giáo viên: {course.teacherName}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {enrollment ? (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayArrowRoundedIcon />}
                      onClick={() => router.push(`/learn/${course.id}`)}
                    >
                      Bắt đầu học
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={isEnrolling}
                      onClick={() => handleEnroll(course.id)}
                    >
                      {isEnrolling ? "Đang đăng ký..." : "Đăng ký học"}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}

        {courses?.length === 0 && (
          <Typography color="text.secondary">Chưa có khóa học nào được công khai.</Typography>
        )}
      </Box>
    </Stack>
  );
}
