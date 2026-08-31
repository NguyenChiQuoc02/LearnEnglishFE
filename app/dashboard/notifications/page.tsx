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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DataTable from "@/app/components/shared/DataTable";
import type { DataTableColumn } from "@/app/components/shared/DataTable";
import { useToast } from "@/app/components/shared/ToastContext";
import { deleteNotification, listNotifications } from "@/app/services/notification.service";
import type { NotificationStatus } from "@/app/constants/notification.constants";
import type { NotificationResponse } from "@/app/types";

const STATUS_COLOR: Record<NotificationStatus, "default" | "success" | "warning" | "info"> = {
  PENDING: "warning",
  ACTIVE: "info",
  SENT: "success",
  CANCELLED: "default",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingNotification, setDeletingNotification] = useState<NotificationResponse | null>(null);

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
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (n) => (
        <>
          <Tooltip title={t("common.viewDetail")}>
            <IconButton size="small" onClick={() => router.push(`/dashboard/notifications/${n.id}`)}>
              <VisibilityRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={n.status === "SENT" ? t("notificationsAdmin.editDisabledSent") : t("common.edit")}>
            <span>
              <IconButton
                size="small"
                disabled={n.status === "SENT"}
                onClick={() => router.push(`/dashboard/notifications/${n.id}/edit`)}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t("common.delete")}>
            <IconButton size="small" onClick={() => setDeletingNotification(n)}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
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

      {deletingNotification && (
        <DeleteNotificationDialog
          notification={deletingNotification}
          onClose={() => setDeletingNotification(null)}
          onDeleted={() => {
            setDeletingNotification(null);
            fetchNotifications();
          }}
        />
      )}
    </Stack>
  );
}

function DeleteNotificationDialog({
  notification,
  onClose,
  onDeleted,
}: {
  notification: NotificationResponse;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteNotification(notification.id);
      showToast(t("notificationsAdmin.deleteSuccess"));
      onDeleted();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("notificationsAdmin.errorDeleteNotification"), "error");
      setDeleting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("notificationsAdmin.deleteTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("notificationsAdmin.deleteConfirm", { title: notification.title })}
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
