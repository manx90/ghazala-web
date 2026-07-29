'use client';

import { useQuery } from '@tanstack/react-query';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { healthApi } from '@/features/admin/api/health.api';

export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.admin.health,
    queryFn: () => healthApi.check(),
    ...queryConfig.health,
  });
}
