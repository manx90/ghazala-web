import { z } from 'zod';
import { BillingCycle } from '@/types/billing.types';
import { OrganizationMemberRole } from '@/types/organization.types';
import { isValidCountryCode, isValidTimezone } from '@/constants/geo.constants';

type ValidationTranslator = (key: string) => string;

export function createOrganizationSettingsSchema(t: ValidationTranslator) {
  return z.object({
    logo: z
      .string()
      .max(500, t('logoTooLong'))
      .optional()
      .refine((val) => !val || z.string().url().safeParse(val).success, t('logoInvalid')),
    timezone: z
      .string()
      .min(1, t('timezoneRequired'))
      .max(64)
      .refine(isValidTimezone, t('timezoneInvalid')),
    country: z
      .string()
      .length(2, t('countryLength'))
      .regex(/^[A-Z]{2}$/, t('countryInvalid'))
      .refine((code) => isValidCountryCode(code), t('countryInvalid')),
  });
}

export function createInviteTeamMemberSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().email(t('emailInvalid')),
    role: z.enum([OrganizationMemberRole.ADMIN, OrganizationMemberRole.MEMBER]),
  });
}

export function createConnectMetaSchema(t: ValidationTranslator) {
  return z.object({
    wabaId: z.string().min(1, t('wabaIdRequired')),
    metaBusinessId: z.string().optional(),
    authorizationCode: z.string().optional(),
    systemUserId: z.string().optional(),
    accessToken: z.string().optional(),
  });
}

export function createChangePlanSchema(t: ValidationTranslator) {
  return z.object({
    planId: z.string().uuid(t('planIdInvalid')),
    billingCycle: z.nativeEnum(BillingCycle),
  });
}

export type OrganizationSettingsFormValues = z.infer<
  ReturnType<typeof createOrganizationSettingsSchema>
>;
export type InviteMemberFormValues = z.infer<ReturnType<typeof createInviteTeamMemberSchema>>;
export type ConnectMetaFormValues = z.infer<ReturnType<typeof createConnectMetaSchema>>;
export type ChangePlanFormValues = z.infer<ReturnType<typeof createChangePlanSchema>>;
