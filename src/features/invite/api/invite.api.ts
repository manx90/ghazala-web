import { apiClient } from '@/services/api/client';
import type {
  AcceptInvitePayload,
  AcceptInviteResponse,
  InvitePublicInfo,
} from '@/types/invite.types';

export const inviteApi = {
  getByToken(token: string): Promise<InvitePublicInfo> {
    return apiClient.get<InvitePublicInfo>(`/invites/${token}`, undefined, {
      skipAuth: true,
      skipOrgHeader: true,
    });
  },

  accept(payload: AcceptInvitePayload): Promise<AcceptInviteResponse> {
    return apiClient.post<AcceptInviteResponse>('/invites/accept', payload, undefined, {
      skipOrgHeader: true,
    });
  },
};
