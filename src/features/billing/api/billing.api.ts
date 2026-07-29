import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  ChangePlanPayload,
  Invoice,
  InvoiceListResponse,
  PlanListResponse,
  SubscribePayload,
  Subscription,
} from '@/types/billing.types';

export const billingApi = {
  listPlans(): Promise<PlanListResponse> {
    return apiClient.get<PlanListResponse>('/billing/plans', undefined, { skipOrgHeader: true });
  },

  getSubscription(): Promise<Subscription> {
    return apiClient.get<Subscription>('/billing/subscription');
  },

  subscribe(payload: SubscribePayload): Promise<Subscription> {
    return apiClient.post<Subscription>('/billing/subscription', payload);
  },

  changePlan(payload: ChangePlanPayload): Promise<Subscription> {
    return apiClient.patch<Subscription>('/billing/subscription/change-plan', payload);
  },

  cancelSubscription(): Promise<ApiMessageResponse> {
    return apiClient.patch<ApiMessageResponse>('/billing/subscription/cancel');
  },

  listInvoices(): Promise<InvoiceListResponse> {
    return apiClient.get<InvoiceListResponse>('/billing/invoices');
  },

  getInvoice(id: string): Promise<Invoice> {
    return apiClient.get<Invoice>(`/billing/invoices/${id}`);
  },
};
