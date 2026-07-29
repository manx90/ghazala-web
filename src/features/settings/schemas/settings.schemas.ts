import { z } from 'zod';
import { BillingCycle } from '@/types/billing.types';
import { OrganizationMemberRole } from '@/types/organization.types';

export const organizationSettingsSchema = z.object({
  logo: z
    .string()
    .max(500, 'رابط الشعار طويل جداً')
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'رابط الشعار غير صالح'),
  timezone: z.string().min(1, 'المنطقة الزمنية مطلوبة').max(64),
  country: z
    .string()
    .length(2, 'رمز الدولة يجب أن يكون حرفين')
    .regex(/^[A-Z]{2}$/, 'رمز الدولة غير صالح'),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid('معرف المستخدم غير صالح'),
  role: z.nativeEnum(OrganizationMemberRole).optional(),
});

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(OrganizationMemberRole),
});

export const connectMetaSchema = z.object({
  wabaId: z.string().min(1, 'معرف WABA مطلوب'),
  authorizationCode: z.string().optional(),
  metaBusinessId: z.string().optional(),
  systemUserId: z.string().optional(),
  accessToken: z.string().optional(),
});

export const changePlanSchema = z.object({
  planId: z.string().uuid('معرف الخطة غير صالح'),
  billingCycle: z.nativeEnum(BillingCycle),
});

export type OrganizationSettingsFormValues = z.infer<typeof organizationSettingsSchema>;
export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleFormValues = z.infer<typeof updateMemberRoleSchema>;
export type ConnectMetaFormValues = z.infer<typeof connectMetaSchema>;
export type ChangePlanFormValues = z.infer<typeof changePlanSchema>;
