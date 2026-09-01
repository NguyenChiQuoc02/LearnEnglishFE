"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import SectionLabel from "@/app/dashboard/components/SectionLabel";
import ImageUploadField from "@/app/components/shared/ImageUploadField";
import { useToast } from "@/app/components/shared/ToastContext";
import { listCourses } from "@/app/services/course.service";
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
import type { CourseResponse, NotificationRequest } from "@/app/types";

export type NotificationFormValues = {
  title: string;
  content: string;
  imageUrl: string;
  link: string;
  targetType: NotificationTargetType;
  targetCourseId: number | "";
  deliveryType: NotificationDeliveryType;
  recurrenceType: NotificationRecurrenceType;
  scheduledAt: string;
  dailyTime: string;
};

export const EMPTY_NOTIFICATION_FORM_VALUES: NotificationFormValues = {
  title: "",
  content: "",
  imageUrl: "",
  link: "",
  targetType: "ALL",
  targetCourseId: "",
  deliveryType: "IMMEDIATE",
  recurrenceType: "NONE",
  scheduledAt: "",
  dailyTime: "",
};

// Validates the form and converts it into the API payload, or returns an already-translated
// error message when a conditionally-required field is missing/invalid.
export function buildNotificationPayload(
  values: NotificationFormValues,
  t: TFunction
): { payload: NotificationRequest } | { error: string } {
  if (!values.title.trim()) {
    return { error: t("notificationsAdminNew.errorTitleRequired") };
  }
  if (!values.content.trim()) {
    return { error: t("notificationsAdminNew.errorContentRequired") };
  }
  if (values.targetType === "COURSE" && values.targetCourseId === "") {
    return { error: t("notificationsAdminNew.errorTargetCourseRequired") };
  }

  let scheduledAtIso: string | undefined;
  if (values.deliveryType === "SCHEDULED" && values.recurrenceType === "NONE") {
    if (!values.scheduledAt) {
      return { error: t("notificationsAdminNew.errorScheduledAtRequired") };
    }
    const parsed = new Date(values.scheduledAt);
    if (parsed.getTime() <= Date.now()) {
      return { error: t("notificationsAdminNew.errorScheduledAtFuture") };
    }
    scheduledAtIso = parsed.toISOString();
  }

  if (values.deliveryType === "SCHEDULED" && values.recurrenceType === "DAILY" && !values.dailyTime) {
    return { error: t("notificationsAdminNew.errorDailyTimeRequired") };
  }

  return {
    payload: {
      title: values.title,
      content: values.content,
      imageUrl: values.imageUrl || undefined,
      link: values.link || undefined,
      targetType: values.targetType,
      targetCourseId: values.targetType === "COURSE" && values.targetCourseId !== "" ? values.targetCourseId : undefined,
      deliveryType: values.deliveryType,
      recurrenceType: values.deliveryType === "SCHEDULED" ? values.recurrenceType : undefined,
      scheduledAt: scheduledAtIso,
      dailyTime: values.deliveryType === "SCHEDULED" && values.recurrenceType === "DAILY" ? values.dailyTime : undefined,
    },
  };
}

export default function NotificationForm({
  values,
  onChange,
}: {
  values: NotificationFormValues;
  onChange: <K extends keyof NotificationFormValues>(key: K, value: NotificationFormValues[K]) => void;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  useEffect(() => {
    if (values.targetType !== "COURSE" || courses.length > 0) return;
    listCourses()
      .then(setCourses)
      .catch((err) => showToast(err instanceof Error ? err.message : t("notificationsAdminNew.errorLoadCourses"), "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.targetType]);

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <SectionLabel>{t("notificationsAdminNew.sectionContent")}</SectionLabel>

        <ImageUploadField
          label={t("notificationsAdminNew.fieldImageUrl")}
          value={values.imageUrl}
          onChange={(url) => onChange("imageUrl", url)}
        />

        <TextField
          label={t("notificationsAdminNew.fieldTitle")}
          value={values.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
          fullWidth
        />
        <TextField
          label={t("notificationsAdminNew.fieldContent")}
          value={values.content}
          onChange={(e) => onChange("content", e.target.value)}
          required
          fullWidth
          multiline
          minRows={4}
        />
        <TextField
          label={t("notificationsAdminNew.fieldLink")}
          value={values.link}
          onChange={(e) => onChange("link", e.target.value)}
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
          value={values.targetType}
          onChange={(e) => onChange("targetType", e.target.value as NotificationTargetType)}
          fullWidth
        >
          {NOTIFICATION_TARGET_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`notificationTargetTypes.${type}`)}
            </MenuItem>
          ))}
        </TextField>

        {values.targetType === "COURSE" && (
          <TextField
            select
            label={t("notificationsAdminNew.fieldTargetCourse")}
            value={values.targetCourseId}
            onChange={(e) => onChange("targetCourseId", e.target.value === "" ? "" : Number(e.target.value))}
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
          value={values.deliveryType}
          onChange={(e) => onChange("deliveryType", e.target.value as NotificationDeliveryType)}
          fullWidth
        >
          {NOTIFICATION_DELIVERY_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {t(`notificationDeliveryTypes.${type}`)}
            </MenuItem>
          ))}
        </TextField>

        {values.deliveryType === "IMMEDIATE" && (
          <Alert severity="info" icon={<CampaignRoundedIcon fontSize="inherit" />}>
            {t("notificationsAdminNew.immediateNotice")}
          </Alert>
        )}

        {values.deliveryType === "SCHEDULED" && (
          <>
            <TextField
              select
              label={t("notificationsAdminNew.fieldRecurrenceType")}
              value={values.recurrenceType}
              onChange={(e) => onChange("recurrenceType", e.target.value as NotificationRecurrenceType)}
              fullWidth
            >
              {NOTIFICATION_RECURRENCE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`notificationRecurrenceTypes.${type}`)}
                </MenuItem>
              ))}
            </TextField>

            {values.recurrenceType === "NONE" ? (
              <>
                <TextField
                  label={t("notificationsAdminNew.fieldScheduledAt")}
                  type="datetime-local"
                  value={values.scheduledAt}
                  onChange={(e) => onChange("scheduledAt", e.target.value)}
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
                  value={values.dailyTime}
                  onChange={(e) => onChange("dailyTime", e.target.value)}
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
    </Stack>
  );
}
