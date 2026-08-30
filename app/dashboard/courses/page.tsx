"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DataTable from "@/app/components/shared/DataTable";
import type { DataTableColumn } from "@/app/components/shared/DataTable";
import { listManagedCourses } from "@/app/services/course.service";
import type { CourseResponse } from "@/app/types";
import { useAuth } from "@/app/utils/auth-storage";

export default function CoursesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const isAdmin = auth?.roles?.includes("ROLE_ADMIN") ?? false;

  useEffect(() => {
    listManagedCourses()
      .then(setCourses)
      .catch((err) => setError(err instanceof Error ? err.message : t("coursesAdmin.errorLoadCourses")));
  }, [t]);

  const columns: DataTableColumn<CourseResponse>[] = [
    {
      key: "title",
      header: t("coursesAdmin.columnTitle"),
      render: (course) => <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>,
    },
    { key: "type", header: t("coursesAdmin.columnType"), render: (course) => course.courseType },
    { key: "teacher", header: t("coursesAdmin.columnTeacher"), render: (course) => course.teacherName },
    { key: "words", header: t("coursesAdmin.columnWords"), align: "right", render: (course) => course.totalWords },
    {
      key: "status",
      header: t("coursesAdmin.columnStatus"),
      render: (course) => (
        <Chip
          size="small"
          label={course.published ? t("coursesAdmin.statusPublished") : t("coursesAdmin.statusDraft")}
          color={course.published ? "success" : "default"}
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("coursesAdmin.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin ? t("coursesAdmin.subtitleAll") : t("coursesAdmin.subtitleMine")}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            component={Link}
            href="/dashboard/courses/new"
            variant="contained"
            startIcon={<AddRoundedIcon />}
          >
            {t("coursesAdmin.newCourse")}
          </Button>
        )}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <DataTable
        columns={columns}
        rows={courses ?? []}
        getRowId={(course) => course.id}
        onRowClick={(course) => router.push(`/dashboard/courses/${course.id}`)}
        emptyMessage={t("coursesAdmin.emptyNoCourses")}
        noMatchMessage={t("coursesAdmin.emptyNoMatch")}
        searchPlaceholder={t("coursesAdmin.searchPlaceholder")}
        searchPredicate={(course, term) =>
          course.title.toLowerCase().includes(term) || course.teacherName.toLowerCase().includes(term)
        }
      />
    </Stack>
  );
}
