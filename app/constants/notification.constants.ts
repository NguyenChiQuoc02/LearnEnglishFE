export const NOTIFICATION_TARGET_TYPES = ["ALL", "TEACHERS", "STUDENTS", "COURSE"] as const;
export type NotificationTargetType = (typeof NOTIFICATION_TARGET_TYPES)[number];

export const NOTIFICATION_DELIVERY_TYPES = ["IMMEDIATE", "SCHEDULED"] as const;
export type NotificationDeliveryType = (typeof NOTIFICATION_DELIVERY_TYPES)[number];

export const NOTIFICATION_RECURRENCE_TYPES = ["NONE", "DAILY"] as const;
export type NotificationRecurrenceType = (typeof NOTIFICATION_RECURRENCE_TYPES)[number];

export const NOTIFICATION_STATUSES = ["PENDING", "ACTIVE", "SENT", "CANCELLED"] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];
