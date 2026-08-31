"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import BackButton from "@/app/dashboard/components/BackButton";
import SectionLabel from "@/app/dashboard/components/SectionLabel";
import { useToast } from "@/app/components/shared/ToastContext";
import { listCourses } from "@/app/services/course.service";
import { createNotification } from "@/app/services/notification.service";
import {
  NOTIFICATION_DELIVERY_TYPES,
  NOTIFICATION_RECURRENCE_TYPES,
  NOTIFICATION_TARGET_TYPES,
} from "@/app/constants/notification.constants";
import type {
  NotificationDeliveryType,
  NotificationRecurrenceType,
  NotificationTargetType,
} from "@/app/constants/notification.constants";
import type { CourseResponse } from "@/app/types";

export default function NewNotificationPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [targetType, setTargetType] = useState<NotificationTargetType>("ALL");
  const [targetCourseId, setTargetCourseId] = useState<number | "">("");
  const [deliveryType, setDeliveryType] = useState<NotificationDeliveryType>("IMMEDIATE");
  const [recurrenceType, setRecurrenceType] = useState<NotificationRecurrenceType>("NONE");
  const [scheduledAt, setScheduledAt] = useState("");
  const [dailyTime, setDailyTime] = useState("");

  const [courses, setCourses] = useState<CourseResponse[]>([]);

  useEffect(() => {
    if (targetType !== "COURSE" || courses.length > 0) return;
    listCourses()
      .then(setCourses)
      .catch((err) => showToast(err instanceof Error ? err.message : t("notificationsAdminNew.errorLoadCourses"), "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (targetType === "COURSE" && targetCourseId === "") {
      showToast(t("notificationsAdminNew.errorTargetCourseRequired"), "error");
      return;
    }

    let scheduledAtIso: string | undefined;
    if (deliveryType === "SCHEDULED" && recurrenceType === "NONE") {
      if (!scheduledAt) {
        showToast(t("notificationsAdminNew.errorScheduledAtRequired"), "error");
        return;
      }
      const parsed = new Date(scheduledAt);
      if (parsed.getTime() <= Date.now()) {
        showToast(t("notificationsAdminNew.errorScheduledAtFuture"), "error");
        return;
      }
      scheduledAtIso = parsed.toISOString();
    }

    if (deliveryType === "SCHEDULED" && recurrenceType === "DAILY" && !dailyTime) {
      showToast(t("notificationsAdminNew.errorDailyTimeRequired"), "error");
      return;
    }

    setLoading(true);
    try {
      await createNotification({
        title,
        content,
        imageUrl: imageUrl || undefined,
        link: link || undefined,
        targetType,
        targetCourseId: targetType === "COURSE" && targetCourseId !== "" ? targetCourseId : undefined,
        deliveryType,
        recurrenceType: deliveryType === "SCHEDULED" ? recurrenceType : undefined,
        scheduledAt: scheduledAtIso,
        dailyTime: deliveryType === "SCHEDULED" && recurrenceType === "DAILY" ? dailyTime : undefined,
      });
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
              <Stack spacing={2}>
                <SectionLabel>{t("notificationsAdminNew.sectionContent")}</SectionLabel>

                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    src={imageUrl || undefined}
                    sx={{ width: 56, height: 56, bgcolor: "primary.main" }}
                  >
                    <ImageRoundedIcon />
                  </Avatar>
                  <TextField
                    label={t("notificationsAdminNew.fieldImageUrl")}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    helperText={t("notificationsAdminNew.imageUrlHint")}
                    fullWidth
                  />
                </Stack>

                <TextField
                  label={t("notificationsAdminNew.fieldTitle")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label={t("notificationsAdminNew.fieldContent")}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  fullWidth
                  multiline
                  minRows={4}
                />
                <TextField
                  label={t("notificationsAdminNew.fieldLink")}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: <LinkRoundedIcon fontSize="small" sx={{ mr: 1, color: "text.disabled" }} />,
                    },
                  }}
                />
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <SectionLabel>{t("notificationsAdminNew.sectionRecipients")}</SectionLabel>

                <TextField
                  select
                  label={t("notificationsAdminNew.fieldTargetType")}
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as NotificationTargetType)}
                  fullWidth
                >
                  {NOTIFICATION_TARGET_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`notificationTargetTypes.${type}`)}
                    </MenuItem>
                  ))}
                </TextField>

                {targetType === "COURSE" && (
                  <TextField
                    select
                    label={t("notificationsAdminNew.fieldTargetCourse")}
                    value={targetCourseId}
                    onChange={(e) => setTargetCourseId(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    fullWidth
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <SectionLabel>{t("notificationsAdminNew.sectionDelivery")}</SectionLabel>

                <TextField
                  select
                  label={t("notificationsAdminNew.fieldDeliveryType")}
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as NotificationDeliveryType)}
                  fullWidth
                >
                  {NOTIFICATION_DELIVERY_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`notificationDeliveryTypes.${type}`)}
                    </MenuItem>
                  ))}
                </TextField>

                {deliveryType === "IMMEDIATE" && (
                  <Alert severity="info" icon={<CampaignRoundedIcon fontSize="inherit" />}>
                    {t("notificationsAdminNew.immediateNotice")}
                  </Alert>
                )}

                {deliveryType === "SCHEDULED" && (
                  <>
                    <TextField
                      select
                      label={t("notificationsAdminNew.fieldRecurrenceType")}
                      value={recurrenceType}
                      onChange={(e) => setRecurrenceType(e.target.value as NotificationRecurrenceType)}
                      fullWidth
                    >
                      {NOTIFICATION_RECURRENCE_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {t(`notificationRecurrenceTypes.${type}`)}
                        </MenuItem>
                      ))}
                    </TextField>

                    {recurrenceType === "NONE" ? (
                      <>
                        <TextField
                          label={t("notificationsAdminNew.fieldScheduledAt")}
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={(e) => setScheduledAt(e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }}
                          required
                          fullWidth
                        />
                        <Alert severity="info">{t("notificationsAdminNew.scheduledOnceNotice")}</Alert>
                      </>
                    ) : (
                      <>
                        <TextField
                          label={t("notificationsAdminNew.fieldDailyTime")}
                          type="time"
                          value={dailyTime}
                          onChange={(e) => setDailyTime(e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }}
                          required
                          fullWidth
                        />
                        <Alert severity="info">{t("notificationsAdminNew.scheduledDailyNotice")}</Alert>
                      </>
                    )}
                  </>
                )}
              </Stack>

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
