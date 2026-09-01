"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DataTable, { type DataTableColumn } from "@/app/components/shared/DataTable";
import { useToast } from "@/app/components/shared/ToastContext";
import { listManagedCourses, updateCourse } from "@/app/services/course.service";
import type { CourseResponse } from "@/app/types";

const FETCH_ALL_SIZE = 1000;

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function CoursePricesTab() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [editedPrices, setEditedPrices] = useState<Record<number, number>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    listManagedCourses({ page: 0, size: FETCH_ALL_SIZE })
      .then((res) => {
        const sorted = [...res.content].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCourses(sorted);
        setEditedPrices(Object.fromEntries(sorted.map((c) => [c.id, c.price])));
      })
      .catch((err) => setError(err instanceof Error ? err.message : t("budgetAdmin.errorLoadCourses")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(course: CourseResponse) {
    const newPrice = editedPrices[course.id] ?? course.price;
    setSavingId(course.id);
    try {
      const updated = await updateCourse(course.id, {
        title: course.title,
        description: course.description ?? undefined,
        courseType: course.courseType,
        level: course.level ?? undefined,
        teacherId: course.teacherId,
        wordsPerSession: course.wordsPerSession,
        pointsPerCorrect: course.pointsPerCorrect,
        pointsPerWrong: course.pointsPerWrong,
        published: course.published,
        price: newPrice,
      });
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
      showToast(t("budgetAdmin.savePriceSuccess"));
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("budgetAdmin.errorSavePrice"), "error");
    } finally {
      setSavingId(null);
    }
  }

  const columns: DataTableColumn<CourseResponse>[] = [
    { key: "title", header: t("budgetAdmin.columnCourseTitle"), render: (course) => course.title },
    { key: "type", header: t("budgetAdmin.columnCourseType"), render: (course) => course.courseType },
    { key: "currentPrice", header: t("budgetAdmin.columnCurrentPrice"), align: "right", render: (course) => formatVnd(course.price) },
    {
      key: "editPrice",
      header: t("budgetAdmin.columnNewPrice"),
      render: (course) => (
        <TextField
          size="small"
          type="number"
          value={editedPrices[course.id] ?? course.price}
          onChange={(e) =>
            setEditedPrices((prev) => ({ ...prev, [course.id]: Number(e.target.value) }))
          }
          onClick={(e) => e.stopPropagation()}
          slotProps={{ htmlInput: { min: 0, step: 1000 } }}
          sx={{ width: 160 }}
        />
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (course) => (
        <Button
          size="small"
          variant="contained"
          disabled={savingId === course.id || (editedPrices[course.id] ?? course.price) === course.price}
          onClick={(e) => {
            e.stopPropagation();
            handleSave(course);
          }}
        >
          {savingId === course.id ? t("common.saving") : t("common.save")}
        </Button>
      ),
    },
  ];

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <DataTable
        columns={columns}
        rows={courses}
        getRowId={(course) => course.id}
        emptyMessage={t("budgetAdmin.emptyNoCourses")}
        noMatchMessage={t("budgetAdmin.emptyNoMatch")}
        searchPlaceholder={t("budgetAdmin.searchCoursePlaceholder")}
        searchPredicate={(course, term) => course.title.toLowerCase().includes(term)}
        loading={loading}
      />
    </Stack>
  );
}
