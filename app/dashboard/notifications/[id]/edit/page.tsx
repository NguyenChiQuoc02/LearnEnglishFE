"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BackButton from "@/app/dashboard/components/BackButton";
import { useToast } from "@/app/components/shared/ToastContext";
import { getNotification, updateNotification } from "@/app/services/notification.service";
import NotificationForm, { buildNotificationPayload } from "@/app/dashboard/notifications/NotificationForm";
import type { NotificationFormValues } from "@/app/dashboard/notifications/NotificationForm";

function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditNotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [values, setValues] = useState<NotificationFormValues | null>(null);
  const [alreadySent, setAlreadySent] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotification(id)
      .then((n) => {
        if (n.status === "SENT") {
          setAlreadySent(true);
          return;
        }
        setValues({
          title: n.title,
          content: n.content,
          imageUrl: n.imageUrl ?? "",
          link: n.link ?? "",
          targetType: n.targetType,
          targetCourseId: n.targetCourseId ?? "",
          deliveryType: n.deliveryType,
          recurrenceType: n.recurrenceType,
          scheduledAt: n.scheduledAt ? toDatetimeLocalValue(n.scheduledAt) : "",
          dailyTime: n.dailyTime ? n.dailyTime.slice(0, 5) : "",
        });
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : t("notificationsAdminEdit.errorLoadNotification")));
  }, [id, t]);

  function handleChange<K extends keyof NotificationFormValues>(key: K, value: NotificationFormValues[K]) {
    setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;

    const result = buildNotificationPayload(values, t);
    if ("error" in result) {
      showToast(result.error, "error");
      return;
    }

    setSaving(true);
    try {
      await updateNotification(id, result.payload);
      showToast(t("notificationsAdminEdit.updateSuccess"));
      router.push("/dashboard/notifications");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("notificationsAdminEdit.errorUpdateNotification"), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: "auto" }}>
      <BackButton onClick={() => router.push("/dashboard/notifications")} />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("notificationsAdminEdit.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("notificationsAdminEdit.subtitle")}
        </Typography>
      </Box>

      {loadError && <Alert severity="error">{loadError}</Alert>}

      {alreadySent && <Alert severity="warning">{t("notificationsAdminEdit.errorAlreadySent")}</Alert>}

      {!values && !loadError && !alreadySent && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {values && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <NotificationForm values={values} onChange={handleChange} />

                <Button type="submit" variant="contained" size="large" disabled={saving}>
                  {saving ? t("notificationsAdminEdit.saving") : t("notificationsAdminEdit.saveButton")}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
