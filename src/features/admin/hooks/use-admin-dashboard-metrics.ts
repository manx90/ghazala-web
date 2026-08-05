'use client';

import { useQuery } from '@tanstack/react-query';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminApi } from '@/features/admin/api/admin.api';
import type { AdminMessageStatsPeriod } from '@/types/admin.types';

export function useAdminWabaStats() {
  return useQuery({
    queryKey: queryKeys.admin.wabaStats,
    queryFn: () => adminApi.getWabaStats(),
    ...queryConfig.admin,
  });
}

export function useAdminPhoneNumberStats() {
  return useQuery({
    queryKey: queryKeys.admin.phoneNumberStats,
    queryFn: () => adminApi.getPhoneNumberStats(),
    ...queryConfig.admin,
  });
}

export function useAdminMessageStats(period: AdminMessageStatsPeriod = 'month') {
  return useQuery({
    queryKey: queryKeys.admin.messageStats(period),
    queryFn: () => adminApi.getMessageStats(period),
    ...queryConfig.admin,
  });
}

export function useAdminRevenueStats() {
  return useQuery({
    queryKey: queryKeys.admin.revenueStats,
    queryFn: () => adminApi.getRevenueStats(),
    ...queryConfig.admin,
  });
}

export function useAdminSubscriptionSummary() {
  return useQuery({
    queryKey: queryKeys.admin.subscriptionSummary,
    queryFn: () => adminApi.getSubscriptionSummary(),
    ...queryConfig.admin,
  });
}

export function useAdminQueueStatus() {
  return useQuery({
    queryKey: queryKeys.admin.queueStatus,
    queryFn: () => adminApi.getQueueStatus(),
    ...queryConfig.admin,
  });
}

export function useAdminWorkersStatus() {
  return useQuery({
    queryKey: queryKeys.admin.workersStatus,
    queryFn: () => adminApi.getWorkersStatus(),
    ...queryConfig.admin,
  });
}

export function useAdminActivityTimeline() {
  return useQuery({
    queryKey: queryKeys.admin.activityTimeline,
    queryFn: () => adminApi.getActivityTimeline(),
    ...queryConfig.admin,
  });
}

export function useAdminDatabaseHealth() {
  return useQuery({
    queryKey: queryKeys.admin.healthDatabase,
    queryFn: () => adminApi.getDatabaseHealth(),
    ...queryConfig.health,
  });
}

export function useAdminRedisHealth() {
  return useQuery({
    queryKey: queryKeys.admin.healthRedis,
    queryFn: () => adminApi.getRedisHealth(),
    ...queryConfig.health,
  });
}

export function useAdminStorageHealth() {
  return useQuery({
    queryKey: queryKeys.admin.healthStorage,
    queryFn: () => adminApi.getStorageHealth(),
    ...queryConfig.health,
  });
}
