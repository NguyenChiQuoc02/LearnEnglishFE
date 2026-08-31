import type {
  NotificationDeliveryType,
  NotificationRecurrenceType,
  NotificationStatus,
  NotificationTargetType,
} from "@/app/constants/notification.constants";

export type NotificationResponse = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  link: string | null;
  targetType: NotificationTargetType;
  targetCourseId: number | null;
  targetCourseTitle: string | null;
  deliveryType: NotificationDeliveryType;
  recurrenceType: NotificationRecurrenceType;
  scheduledAt: string | null;
  dailyTime: string | null;
  status: NotificationStatus;
  lastSentAt: string | null;
  createdById: number | null;
  createdByUsername: string | null;
  createdAt: string;
};

export type NotificationRequest = {
  title: string;
  content: string;
  imageUrl?: string;
  link?: string;
  targetType: NotificationTargetType;
  targetCourseId?: number;
  deliveryType: NotificationDeliveryType;
  recurrenceType?: NotificationRecurrenceType;
  scheduledAt?: string;
  dailyTime?: string;
};
