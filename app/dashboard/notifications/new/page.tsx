"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BackButton from "@/app/dashboard/components/BackButton";
import { useToast } from "@/app/components/shared/ToastContext";
import { createNotification } from "@/app/services/notification.service";
import NotificationForm, {
  EMPTY_NOTIFICATION_FORM_VALUES,
  buildNotificationPayload,
} from "@/app/dashboard/notifications/NotificationForm";
import type { NotificationFormValues } from "@/app/dashboard/notifications/NotificationForm";

export default function NewNotificationPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<NotificationFormValues>(EMPTY_NOTIFICATION_FORM_VALUES);

  function handleChange<K extends keyof NotificationFormValues>(key: K, value: NotificationFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = buildNotificationPayload(values, t);
    if ("error" in result) {
      showToast(result.error, "error");
      return;
    }

    setLoading(true);
    try {
      await createNotification(result.payload);
      showToast(t("notificationsAdminNew.createSuccess"));
      router.push("/dashboard/notifications");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("notificationsAdminNew.errorCreateNotification"), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 680, mx: "auto" }}>
      <BackButton onClick={() => router.push("/dashboard/notifications")} />

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("notificationsAdminNew.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("notificationsAdminNew.subtitle")}
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <NotificationForm values={values} onChange={handleChange} />

              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? t("notificationsAdminNew.creating") : t("notificationsAdminNew.createButton")}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
