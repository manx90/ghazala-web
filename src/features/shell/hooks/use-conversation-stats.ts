'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/query-keys';
import { conversationsApi } from '@/features/shell/api/conversations.api';
import { useOrganizationStore } from '@/store/organization.store';

export function useConversationStats() {
  const currentOrganization = useOrganizationStore((state) => state.currentOrganization);

  return useQuery({
    queryKey: [...queryKeys.conversations.statistics, currentOrganization?.id],
    queryFn: () => conversationsApi.statistics(),
    enabled: Boolean(currentOrganization?.id),
    refetchInterval: 60_000,
  });
}
