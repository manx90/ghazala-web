import { z } from 'zod';
import {
  textEndsWithVariable,
  textStartsWithVariable,
} from '@/features/templates/utils/template-meta-payload';
import { TemplateCategory } from '@/types/template.types';

type Translate = (key: string) => string;

export function createTemplateFormSchema(t: Translate) {
  return z
    .object({
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
    })
    .superRefine((values, ctx) => {
      const header = values.headerText?.trim();
      const body = values.bodyText.trim();

      if (header) {
        if (textStartsWithVariable(header)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.variableAtStartHeader'),
            path: ['headerText'],
          });
        }

        if (textEndsWithVariable(header)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.variableAtEndHeader'),
            path: ['headerText'],
          });
        }
      }

      if (textStartsWithVariable(body)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.variableAtStartBody'),
          path: ['bodyText'],
        });
      }

      if (textEndsWithVariable(body)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.variableAtEndBody'),
          path: ['bodyText'],
        });
      }
    });
}

export type TemplateFormValues = z.infer<ReturnType<typeof createTemplateFormSchema>>;
