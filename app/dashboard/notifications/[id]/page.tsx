"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import BackButton from "@/app/dashboard/components/BackButton";
import SectionLabel from "@/app/dashboard/components/SectionLabel";
import { getNotification } from "@/app/services/notification.service";
import type { NotificationResponse } from "@/app/types";
import type { NotificationStatus } from "@/app/constants/notification.constants";

const STATUS_COLOR: Record<NotificationStatus, "default" | "success" | "warning" | "info"> = {
  PENDING: "warning",
  ACTIVE: "info",
  SENT: "success",
  CANCELLED: "default",
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function NotificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();

  const [notification, setNotification] = useState<NotificationResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getNotification(id)
      .then(setNotification)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : t("notificationsAdminDetail.errorLoadNotification"))
      );
  }, [id, t]);

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: "auto" }}>
      <BackButton onClick={() => router.push("/dashboard/notifications")} />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("notificationsAdminDetail.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("notificationsAdminDetail.subtitle")}
        </Typography>
      </Box>

      {loadError && <Alert severity="error">{loadError}</Alert>}

      {!notification && !loadError && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {notification && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={2}>
                <SectionLabel>{t("notificationsAdminDetail.sectionContent")}</SectionLabel>

                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    src={notification.imageUrl ?? undefined}
                    sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
                  >
                    <ImageRoundedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {notification.title}
                    </Typography>
                    <Chip
                      size="small"
                      color={STATUS_COLOR[notification.status]}
                      label={t(`notificationStatuses.${notification.status}`)}
                    />
                  </Box>
                </Stack>

                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {notification.content}
                </Typography>

                {notification.link && (
                  <DetailRow
                    label={t("notificationsAdminDetail.fieldLink")}
                    value={
                      <Typography
                        component="a"
                        href={notification.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {notification.link}
                      </Typography>
                    }
                  />
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <SectionLabel>{t("notificationsAdminDetail.sectionRecipients")}</SectionLabel>

                <DetailRow
                  label={t("notificationsAdminDetail.fieldTargetType")}
                  value={t(`notificationTargetTypes.${notification.targetType}`)}
                />
                {notification.targetType === "COURSE" && notification.targetCourseTitle && (
                  <DetailRow
                    label={t("notificationsAdminDetail.fieldTargetCourse")}
                    value={notification.targetCourseTitle}
                  />
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <SectionLabel>{t("notificationsAdminDetail.sectionDelivery")}</SectionLabel>

                <DetailRow
                  label={t("notificationsAdminDetail.fieldDeliveryType")}
                  value={t(`notificationDeliveryTypes.${notification.deliveryType}`)}
                />
                {notification.deliveryType === "SCHEDULED" && (
                  <DetailRow
                    label={t("notificationsAdminDetail.fieldRecurrenceType")}
                    value={t(`notificationRecurrenceTypes.${notification.recurrenceType}`)}
                  />
                )}
                {notification.deliveryType === "SCHEDULED" &&
                  notification.recurrenceType === "NONE" &&
                  notification.scheduledAt && (
                    <DetailRow
                      label={t("notificationsAdminDetail.fieldScheduledAt")}
                      value={new Date(notification.scheduledAt).toLocaleString()}
                    />
                  )}
                {notification.deliveryType === "SCHEDULED" &&
                  notification.recurrenceType === "DAILY" &&
                  notification.dailyTime && (
                    <DetailRow
                      label={t("notificationsAdminDetail.fieldDailyTime")}
                      value={notification.dailyTime.slice(0, 5)}
                    />
                  )}
                {notification.lastSentAt && (
                  <DetailRow
                    label={t("notificationsAdminDetail.fieldLastSentAt")}
                    value={new Date(notification.lastSentAt).toLocaleString()}
                  />
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <SectionLabel>{t("notificationsAdminDetail.sectionMeta")}</SectionLabel>

                <DetailRow
                  label={t("notificationsAdmin.columnCreatedBy")}
                  value={notification.createdByUsername ?? "—"}
                />
                <DetailRow
                  label={t("notificationsAdmin.columnCreatedAt")}
                  value={new Date(notification.createdAt).toLocaleString()}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
