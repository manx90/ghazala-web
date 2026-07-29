import { z } from 'zod';
import { TemplateCategory } from '@/types/template.types';

export const templateFormSchema = z.object({
  wabaId: z.string().optional(),
  name: z
    .string()
    .min(1, 'اسم القالب مطلوب')
    .regex(/^[a-z0-9_]+$/, 'يجب أن يحتوي على أحرف صغيرة وأرقام وشرطة سفلية فقط'),
  category: z.nativeEnum(TemplateCategory, { message: 'التصنيف مطلوب' }),
  language: z.string().min(2, 'رمز اللغة مطلوب'),
  bodyText: z.string().min(1, 'نص القالب مطلوب'),
  headerText: z.string().optional(),
  footerText: z.string().optional(),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
