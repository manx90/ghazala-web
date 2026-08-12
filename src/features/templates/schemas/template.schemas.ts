import { z } from 'zod';
import { TemplateCategory } from '@/types/template.types';

type Translate = (key: string) => string;

export function createTemplateFormSchema(t: Translate) {
  return z.object({
    wabaId: z.string().optional(),
    name: z
      .string()
      .min(1, t('validation.nameRequired'))
      .regex(/^[a-z0-9_]+$/, t('validation.nameFormat')),
    category: z.nativeEnum(TemplateCategory, { message: t('validation.categoryRequired') }),
    language: z.string().min(2, t('validation.languageRequired')),
    bodyText: z.string().min(1, t('validation.bodyRequired')),
    headerText: z.string().optional(),
    footerText: z.string().optional(),
  });
}

export type TemplateFormValues = z.infer<ReturnType<typeof createTemplateFormSchema>>;
