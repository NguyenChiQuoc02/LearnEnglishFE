"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DataTable from "@/app/components/shared/DataTable";
import type { DataTableColumn } from "@/app/components/shared/DataTable";
import { useToast } from "@/app/components/shared/ToastContext";
import { deleteCourse, listManagedCourses } from "@/app/services/course.service";
import type { CourseResponse } from "@/app/types";
import { useAuth } from "@/app/utils/auth-storage";

const DEFAULT_PAGE_SIZE = 20;

export default function CoursesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingCourse, setDeletingCourse] = useState<CourseResponse | null>(null);
  const auth = useAuth();
  const isAdmin = auth?.roles?.includes("ROLE_ADMIN") ?? false;

  function fetchCourses(targetPage: number, targetSize: number, keyword: string) {
    setLoading(true);
    setError(null);
    listManagedCourses({ page: targetPage, size: targetSize, keyword: keyword || undefined })
      .then((res) => {
        setCourses(res.content);
        setTotalElements(res.totalElements);
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("coursesAdmin.errorLoadCourses")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCourses(page, rowsPerPage, appliedKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, appliedKeyword]);

  function handleSearchSubmit() {
    setPage(0);
    setAppliedKeyword(searchInput);
  }

  function reload() {
    fetchCourses(page, rowsPerPage, appliedKeyword);
  }

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
    ...(isAdmin
      ? [
          {
            key: "actions",
            header: t("common.actions"),
            align: "right" as const,
            render: (course: CourseResponse) => (
              <>
                <Tooltip title={t("common.viewDetail")}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/courses/${course.id}`);
                    }}
                  >
                    <VisibilityRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("common.delete")}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingCourse(course);
                    }}
                  >
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        ]
      : []),
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
        rows={courses}
        getRowId={(course) => course.id}
        onRowClick={(course) => router.push(`/dashboard/courses/${course.id}`)}
        emptyMessage={t("coursesAdmin.emptyNoCourses")}
        noMatchMessage={t("coursesAdmin.emptyNoMatch")}
        searchPlaceholder={t("coursesAdmin.searchPlaceholder")}
        loading={loading}
        serverSide
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalElements}
        onPageChange={setPage}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(0);
        }}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onRefresh={reload}
      />

      {deletingCourse && (
        <DeleteCourseDialog
          course={deletingCourse}
          onClose={() => setDeletingCourse(null)}
          onDeleted={() => {
            setDeletingCourse(null);
            reload();
          }}
        />
      )}
    </Stack>
  );
}

function DeleteCourseDialog({
  course,
  onClose,
  onDeleted,
}: {
  course: CourseResponse;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCourse(course.id);
      showToast(t("coursesAdmin.deleteSuccess"));
      onDeleted();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("coursesAdmin.errorDeleteCourse"), "error");
      setDeleting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("coursesAdmin.deleteTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("coursesAdmin.deleteConfirm", { title: course.title })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? t("common.deleting") : t("common.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
