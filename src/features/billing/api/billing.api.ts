import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type {
  ChangePlanPayload,
  Invoice,
  InvoiceListResponse,
  PlanListResponse,
  SubscribePayload,
  Subscription,
  SubscriptionStatusResponse,
  OrganizationUsage,
  CheckoutSessionResponse,
} from '@/types/billing.types';

export const billingApi = {
  listPlans(): Promise<PlanListResponse> {
    return apiClient.get<PlanListResponse>('/billing/plans', undefined, { skipOrgHeader: true });
  },

  getSubscription(): Promise<Subscription | null> {
    return apiClient
      .get<SubscriptionStatusResponse>('/billing/subscription')
      .then((response) => response.subscription);
  },

  subscribe(payload: SubscribePayload): Promise<CheckoutSessionResponse> {
    return apiClient.post<CheckoutSessionResponse>('/billing/subscription', payload);
  },

  changePlan(payload: ChangePlanPayload): Promise<CheckoutSessionResponse> {
    return apiClient.patch<CheckoutSessionResponse>('/billing/subscription/change-plan', payload);
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

  getUsage(): Promise<OrganizationUsage> {
    return apiClient.get<OrganizationUsage>('/billing/usage');
  },
};
