"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { listNotifications } from "@/app/services/notification.service";
import type { NotificationStatus } from "@/app/constants/notification.constants";
import type { NotificationResponse } from "@/app/types";

const STATUS_COLOR: Record<NotificationStatus, "default" | "success" | "warning" | "info"> = {
  PENDING: "warning",
  ACTIVE: "info",
  SENT: "success",
  CANCELLED: "default",
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function fetchNotifications() {
    setLoading(true);
    setError(null);
    listNotifications()
      .then(setNotifications)
      .catch((err) =>
        setError(err instanceof Error ? err.message : t("notificationsAdmin.errorLoadNotifications"))
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: DataTableColumn<NotificationResponse>[] = [
    {
      key: "title",
      header: t("notificationsAdmin.columnTitle"),
      render: (n) => <Typography sx={{ fontWeight: 600 }}>{n.title}</Typography>,
    },
    {
      key: "target",
      header: t("notificationsAdmin.columnTarget"),
      render: (n) => (
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Chip size="small" label={t(`notificationTargetTypes.${n.targetType}`)} variant="outlined" />
          {n.targetType === "COURSE" && n.targetCourseTitle && (
            <Typography variant="body2" color="text.secondary">
              {n.targetCourseTitle}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      key: "delivery",
      header: t("notificationsAdmin.columnDelivery"),
      render: (n) => (
        <Stack spacing={0.25}>
          <Typography variant="body2">{t(`notificationDeliveryTypes.${n.deliveryType}`)}</Typography>
          {n.deliveryType === "SCHEDULED" && n.recurrenceType === "NONE" && n.scheduledAt && (
            <Typography variant="caption" color="text.secondary">
              {t("notificationsAdmin.scheduledAtPrefix")} {new Date(n.scheduledAt).toLocaleString()}
            </Typography>
          )}
          {n.deliveryType === "SCHEDULED" && n.recurrenceType === "DAILY" && n.dailyTime && (
            <Typography variant="caption" color="text.secondary">
              {t("notificationsAdmin.dailyTimePrefix")} {n.dailyTime.slice(0, 5)}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      key: "status",
      header: t("notificationsAdmin.columnStatus"),
      render: (n) => (
        <Chip size="small" color={STATUS_COLOR[n.status]} label={t(`notificationStatuses.${n.status}`)} />
      ),
    },
    {
      key: "createdBy",
      header: t("notificationsAdmin.columnCreatedBy"),
      render: (n) => n.createdByUsername ?? "—",
    },
    {
      key: "createdAt",
      header: t("notificationsAdmin.columnCreatedAt"),
      render: (n) => new Date(n.createdAt).toLocaleString(),
    },
  ];

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("notificationsAdmin.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("notificationsAdmin.subtitle")}
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/dashboard/notifications/new"
          variant="contained"
          startIcon={<AddRoundedIcon />}
        >
          {t("notificationsAdmin.newNotification")}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <DataTable
        columns={columns}
        rows={notifications}
        getRowId={(n) => n.id}
        emptyMessage={t("notificationsAdmin.emptyNoNotifications")}
        noMatchMessage={t("notificationsAdmin.emptyNoMatch")}
        searchPlaceholder={t("notificationsAdmin.searchPlaceholder")}
        searchPredicate={(n, term) => n.title.toLowerCase().includes(term)}
        loading={loading}
        onRefresh={fetchNotifications}
      />
    </Stack>
  );
}
