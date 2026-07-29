'use client';

import { useQuery } from '@tanstack/react-query';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { adminApi } from '@/features/admin/api/admin.api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: () => adminApi.getDashboard(),
    ...queryConfig.admin,
  });
}
