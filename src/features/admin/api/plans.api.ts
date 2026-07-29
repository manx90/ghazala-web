import { apiClient } from '@/services/api/client';
import type { ApiMessageResponse } from '@/types/api.types';
import type { CreatePlanPayload, UpdatePlanPayload } from '@/types/admin.types';
import type { Plan, PlanListResponse } from '@/types/billing.types';

const ADMIN_OPTS = { skipOrgHeader: true } as const;

export const adminPlansApi = {
  listPlans(): Promise<PlanListResponse> {
    return apiClient.get<PlanListResponse>('/billing/plans', undefined, ADMIN_OPTS);
  },

  createPlan(payload: CreatePlanPayload): Promise<Plan> {
    return apiClient.post<Plan>('/billing/plans', payload, undefined, ADMIN_OPTS);
  },

  updatePlan(id: string, payload: UpdatePlanPayload): Promise<Plan> {
    return apiClient.patch<Plan>(`/billing/plans/${id}`, payload, undefined, ADMIN_OPTS);
  },

  disablePlan(id: string): Promise<ApiMessageResponse> {
    return apiClient.delete<ApiMessageResponse>(`/billing/plans/${id}`, undefined, ADMIN_OPTS);
  },
};
