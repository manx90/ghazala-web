import { z } from 'zod';

type ValidationTranslator = (key: string) => string;

const optionalLimit = z
  .union([z.coerce.number().int().min(0), z.literal(''), z.null(), z.undefined()])
  .transform((value) => (value === '' || value === undefined ? null : value));

export function createPlanSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(1, t('nameRequired')).max(100),
    code: z
      .string()
      .min(1, t('codeRequired'))
      .max(50)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('codeFormat')),
    description: z.string().max(500).optional(),
    monthlyPrice: z.coerce.number().min(0, t('pricePositive')),
    yearlyPrice: z.coerce.number().min(0, t('pricePositive')),
    currency: z.string().length(3).optional(),
    isActive: z.boolean().optional(),
    maxMessagesMonthly: optionalLimit,
    maxContacts: optionalLimit,
    maxTeamMembers: optionalLimit,
    maxPhoneNumbers: optionalLimit,
    whopPlanIdMonthly: z.string().max(100).optional().nullable(),
    whopPlanIdYearly: z.string().max(100).optional().nullable(),
  });
}

export type PlanFormInputValues = z.input<ReturnType<typeof createPlanSchema>>;
export type PlanFormValues = z.output<ReturnType<typeof createPlanSchema>>;

export function createUpdatePlanSchema(t: ValidationTranslator) {
  return createPlanSchema(t)
    .omit({ code: true })
    .partial()
    .extend({
      name: z.string().min(1).max(100).optional(),
      monthlyPrice: z.coerce.number().min(0).optional(),
      yearlyPrice: z.coerce.number().min(0).optional(),
    });
}

export type UpdatePlanFormInputValues = z.input<ReturnType<typeof createUpdatePlanSchema>>;
export type UpdatePlanFormValues = z.output<ReturnType<typeof createUpdatePlanSchema>>;
