'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/config/query-keys';
import { inviteApi } from '@/features/invite/api/invite.api';
import type { AcceptInvitePayload } from '@/types/invite.types';

export function useInviteInfo(token: string) {
  return useQuery({
    queryKey: queryKeys.invite.info(token),
    queryFn: () => inviteApi.getByToken(token),
    retry: false,
  });
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: (payload: AcceptInvitePayload) => inviteApi.accept(payload),
  });
}
