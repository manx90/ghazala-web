import { z } from 'zod';

const optionalLimit = z
  .union([z.coerce.number().int().min(0), z.literal(''), z.null(), z.undefined()])
  .transform((value) => (value === '' || value === undefined ? null : value));

export const planFormSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').max(100),
  code: z
    .string()
    .min(1, 'الرمز مطلوب')
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'أحرف صغيرة وأرقام وشرطات فقط'),
  description: z.string().max(500).optional(),
  monthlyPrice: z.coerce.number().min(0, 'السعر يجب أن يكون موجباً'),
  yearlyPrice: z.coerce.number().min(0, 'السعر يجب أن يكون موجباً'),
  currency: z.string().length(3).optional(),
  isActive: z.boolean().optional(),
  maxMessagesMonthly: optionalLimit,
  maxContacts: optionalLimit,
  maxTeamMembers: optionalLimit,
  maxPhoneNumbers: optionalLimit,
  whopPlanIdMonthly: z.string().max(100).optional().nullable(),
  whopPlanIdYearly: z.string().max(100).optional().nullable(),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export const updatePlanFormSchema = planFormSchema
  .omit({ code: true })
  .partial()
  .extend({
    name: z.string().min(1).max(100).optional(),
    monthlyPrice: z.coerce.number().min(0).optional(),
    yearlyPrice: z.coerce.number().min(0).optional(),
  });

export type UpdatePlanFormValues = z.infer<typeof updatePlanFormSchema>;
