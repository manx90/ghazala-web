import { z } from 'zod';

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
