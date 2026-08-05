import type { PlanFormValues } from '@/features/admin/schemas/plan.schemas';
import type { CreatePlanPayload, UpdatePlanPayload } from '@/types/admin.types';

export function planFormToCreatePayload(values: PlanFormValues): CreatePlanPayload {
  return {
    name: values.name,
    code: values.code,
    description: values.description,
    monthlyPrice: values.monthlyPrice,
    yearlyPrice: values.yearlyPrice,
    currency: values.currency,
    isActive: values.isActive,
    maxMessagesMonthly: values.maxMessagesMonthly,
    maxContacts: values.maxContacts,
    maxTeamMembers: values.maxTeamMembers,
    maxPhoneNumbers: values.maxPhoneNumbers,
    whopPlanIdMonthly: values.whopPlanIdMonthly?.trim() || null,
    whopPlanIdYearly: values.whopPlanIdYearly?.trim() || null,
  };
}

export function planFormToUpdatePayload(values: PlanFormValues): UpdatePlanPayload {
  return {
    ...planFormToCreatePayload(values),
    description: values.description || null,
  };
}
