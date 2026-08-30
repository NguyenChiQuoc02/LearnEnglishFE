"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { listManagedCourses } from "@/app/services/course.service";
import type { CourseResponse } from "@/app/types";
import { getAuth } from "@/app/utils/auth-storage";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = getAuth()?.roles?.includes("ROLE_ADMIN") ?? false;

  useEffect(() => {
    listManagedCourses()
      .then(setCourses)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load courses"));
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Courses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin ? "All courses" : "Courses you own"}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            component={Link}
            href="/dashboard/courses/new"
            variant="contained"
            startIcon={<AddRoundedIcon />}
          >
            New course
          </Button>
        )}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell align="right">Words</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses?.map((course) => (
              <TableRow
                key={course.id}
                hover
                onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{course.title}</TableCell>
                <TableCell>{course.courseType}</TableCell>
                <TableCell>{course.teacherName}</TableCell>
                <TableCell align="right">{course.totalWords}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={course.published ? "Published" : "Draft"}
                    color={course.published ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
            {courses?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                    No courses yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
