'use client';

/**
 * Notifications API — غير متوفر في الـ backend حالياً.
 *
 * Endpoints مطلوبة:
 * - GET    /notifications
 * - PATCH  /notifications/:id/read
 * - PATCH  /notifications/read-all
 * - GET    /notifications/unread-count
 */

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsState {
  isAvailable: false;
  unreadCount: number;
  items: NotificationItem[];
  message: string;
}

export function useNotifications(): NotificationsState & {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isLoading: false;
} {
  return {
    isAvailable: false,
    unreadCount: 0,
    items: [],
    message: 'API الإشعارات غير متوفر — GET /notifications',
    isLoading: false,
    markAsRead: () => undefined,
    markAllAsRead: () => undefined,
  };
}
