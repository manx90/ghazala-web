'use client';

import { useQueries } from '@tanstack/react-query';
import { queryConfig } from '@/config/query';
import { queryKeys } from '@/config/query-keys';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { conversationsApi } from '@/features/shell/api/conversations.api';
import { metaApi } from '@/features/meta/api/meta.api';
import { templatesApi } from '@/features/templates/api/templates.api';
import { whatsappApi } from '@/features/whatsapp/api/whatsapp.api';
import { useOrganizationStore } from '@/store/organization.store';

const RECENT_CONVERSATIONS_LIMIT = 5;

export function useDashboard() {
  const orgId = useOrganizationStore((state) => state.currentOrganization?.id);
  const { isOnline } = useNetworkAware();
  const enabled = Boolean(orgId) && isOnline;

  const [stats, meta, phones, templates, recentConversations] = useQueries({
    queries: [
      {
        queryKey: queryKeys.conversations.statistics,
        queryFn: () => conversationsApi.statistics(),
        enabled,
        ...queryConfig.dashboard,
      },
      {
        queryKey: queryKeys.meta.status,
        queryFn: () => metaApi.status(),
        enabled,
        ...queryConfig.fast,
      },
      {
        queryKey: queryKeys.whatsapp.phoneNumbers,
        queryFn: () => whatsappApi.listPhoneNumbers(),
        enabled,
        ...queryConfig.static,
      },
      {
        queryKey: queryKeys.templates.list(),
        queryFn: () => templatesApi.list(),
        enabled,
        ...queryConfig.static,
      },
      {
        queryKey: queryKeys.conversations.list({ limit: RECENT_CONVERSATIONS_LIMIT, page: 1 }),
        queryFn: () => conversationsApi.list({ limit: RECENT_CONVERSATIONS_LIMIT, page: 1 }),
        enabled,
        ...queryConfig.dashboard,
      },
    ],
  });

  const queries = [stats, meta, phones, templates, recentConversations];

  return {
    stats,
    meta,
    phones,
    templates,
    recentConversations,
    isLoading: queries.some((query) => query.isLoading),
    isFetching: queries.some((query) => query.isFetching),
    refetchAll: () => queries.forEach((query) => void query.refetch()),
  };
}
