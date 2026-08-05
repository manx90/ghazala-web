import { apiClient } from '@/services/api/client';
import type {
  AdminWhopCheckoutResponse,
  AdminWhopMembershipActionResponse,
  AdminWhopMembershipsResponse,
  AdminWhopPaymentActionResponse,
  AdminWhopPaymentsResponse,
  AdminWhopPlansResponse,
  AdminWhopPromoCodeItem,
  AdminWhopPromoCodesResponse,
  AdminWhopRegisterWebhookResponse,
  AdminWhopStatus,
  AdminWhopSyncAllResponse,
  AdminWhopSyncPlanResponse,
  AdminWhopWebhookEventsResponse,
  AdminWhopWebhooksListResponse,
  CreateAdminWhopPromoCodePayload,
} from '@/types/admin.types';
import type { ApiMessageResponse } from '@/types/api.types';
import { toQueryString } from '@/utils/query';

const ADMIN_OPTS = { skipOrgHeader: true } as const;

export const adminWhopApi = {
  getStatus(): Promise<AdminWhopStatus> {
    return apiClient.get<AdminWhopStatus>('/admin/whop/status', undefined, ADMIN_OPTS);
  },

  getPlans(): Promise<AdminWhopPlansResponse> {
    return apiClient.get<AdminWhopPlansResponse>('/admin/whop/plans', undefined, ADMIN_OPTS);
  },

  syncPlan(planId: string): Promise<AdminWhopSyncPlanResponse> {
    return apiClient.post<AdminWhopSyncPlanResponse>(
      `/admin/whop/plans/sync/${planId}`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  syncAllPlans(): Promise<AdminWhopSyncAllResponse> {
    return apiClient.post<AdminWhopSyncAllResponse>(
      '/admin/whop/plans/sync-all',
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  getPayments(limit = 20): Promise<AdminWhopPaymentsResponse> {
    return apiClient.get<AdminWhopPaymentsResponse>(
      `/admin/whop/payments${toQueryString({ limit })}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  refundPayment(paymentId: string, partialAmount?: number | null): Promise<AdminWhopPaymentActionResponse> {
    return apiClient.post<AdminWhopPaymentActionResponse>(
      `/admin/whop/payments/${paymentId}/refund`,
      { partialAmount: partialAmount ?? null },
      undefined,
      ADMIN_OPTS,
    );
  },

  retryPayment(paymentId: string): Promise<AdminWhopPaymentActionResponse> {
    return apiClient.post<AdminWhopPaymentActionResponse>(
      `/admin/whop/payments/${paymentId}/retry`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  voidPayment(paymentId: string): Promise<AdminWhopPaymentActionResponse> {
    return apiClient.post<AdminWhopPaymentActionResponse>(
      `/admin/whop/payments/${paymentId}/void`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  createCheckout(whopPlanId: string, metadata?: Record<string, unknown>): Promise<AdminWhopCheckoutResponse> {
    return apiClient.post<AdminWhopCheckoutResponse>(
      '/admin/whop/checkout',
      { whopPlanId, metadata },
      undefined,
      ADMIN_OPTS,
    );
  },

  getMemberships(limit = 20): Promise<AdminWhopMembershipsResponse> {
    return apiClient.get<AdminWhopMembershipsResponse>(
      `/admin/whop/memberships${toQueryString({ limit })}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  cancelMembership(
    membershipId: string,
    mode: 'at_period_end' | 'immediate' = 'at_period_end',
  ): Promise<AdminWhopMembershipActionResponse> {
    return apiClient.post<AdminWhopMembershipActionResponse>(
      `/admin/whop/memberships/${membershipId}/cancel`,
      { mode },
      undefined,
      ADMIN_OPTS,
    );
  },

  pauseMembership(membershipId: string): Promise<AdminWhopMembershipActionResponse> {
    return apiClient.post<AdminWhopMembershipActionResponse>(
      `/admin/whop/memberships/${membershipId}/pause`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  resumeMembership(membershipId: string): Promise<AdminWhopMembershipActionResponse> {
    return apiClient.post<AdminWhopMembershipActionResponse>(
      `/admin/whop/memberships/${membershipId}/resume`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  uncancelMembership(membershipId: string): Promise<AdminWhopMembershipActionResponse> {
    return apiClient.post<AdminWhopMembershipActionResponse>(
      `/admin/whop/memberships/${membershipId}/uncancel`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  addFreeDays(membershipId: string, freeDays: number): Promise<AdminWhopMembershipActionResponse> {
    return apiClient.post<AdminWhopMembershipActionResponse>(
      `/admin/whop/memberships/${membershipId}/free-days`,
      { freeDays },
      undefined,
      ADMIN_OPTS,
    );
  },

  resyncMembershipAccess(membershipId: string): Promise<AdminWhopMembershipActionResponse> {
    return apiClient.post<AdminWhopMembershipActionResponse>(
      `/admin/whop/memberships/${membershipId}/resync-access`,
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  listPromoCodes(limit = 50): Promise<AdminWhopPromoCodesResponse> {
    return apiClient.get<AdminWhopPromoCodesResponse>(
      `/admin/whop/promo-codes${toQueryString({ limit })}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  createPromoCode(payload: CreateAdminWhopPromoCodePayload): Promise<AdminWhopPromoCodeItem> {
    return apiClient.post<AdminWhopPromoCodeItem>(
      '/admin/whop/promo-codes',
      payload,
      undefined,
      ADMIN_OPTS,
    );
  },

  deletePromoCode(promoId: string): Promise<ApiMessageResponse> {
    return apiClient.delete<ApiMessageResponse>(
      `/admin/whop/promo-codes/${promoId}`,
      undefined,
      ADMIN_OPTS,
    );
  },

  listWebhooks(): Promise<AdminWhopWebhooksListResponse> {
    return apiClient.get<AdminWhopWebhooksListResponse>('/admin/whop/webhooks', undefined, ADMIN_OPTS);
  },

  registerWebhook(): Promise<AdminWhopRegisterWebhookResponse> {
    return apiClient.post<AdminWhopRegisterWebhookResponse>(
      '/admin/whop/webhooks/register',
      {},
      undefined,
      ADMIN_OPTS,
    );
  },

  getWebhookEvents(limit = 20): Promise<AdminWhopWebhookEventsResponse> {
    return apiClient.get<AdminWhopWebhookEventsResponse>(
      `/admin/whop/webhook-events${toQueryString({ limit })}`,
      undefined,
      ADMIN_OPTS,
    );
  },
};
