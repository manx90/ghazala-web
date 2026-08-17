import { z } from 'zod';
import {
  textEndsWithVariable,
  textStartsWithVariable,
} from '@/features/templates/utils/template-meta-payload';
import { TemplateCategory } from '@/types/template.types';

type Translate = (key: string) => string;

export const TEMPLATE_BUTTON_TYPES = ['QUICK_REPLY', 'URL', 'PHONE_NUMBER'] as const;
export type TemplateButtonFormType = (typeof TEMPLATE_BUTTON_TYPES)[number];

const MAX_TEMPLATE_BUTTONS = 3;

export function createTemplateFormSchema(t: Translate) {
  const buttonSchema = z.object({
    type: z.enum(TEMPLATE_BUTTON_TYPES),
    text: z.string(),
    url: z.string().optional(),
    phone_number: z.string().optional(),
  });

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
      buttons: z.array(buttonSchema).max(MAX_TEMPLATE_BUTTONS, t('validation.buttonsMax')),
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

      const buttons = values.buttons ?? [];
      let urlCount = 0;
      let phoneCount = 0;

      buttons.forEach((button, index) => {
        const text = button.text.trim();
        const type = button.type;

        if (!text) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.buttonTextRequired'),
            path: ['buttons', index, 'text'],
          });
        } else if (text.length > 25) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.buttonTextMax'),
            path: ['buttons', index, 'text'],
          });
        }

        if (type === 'URL') {
          urlCount += 1;
          const url = button.url?.trim() ?? '';
          if (!url) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('validation.buttonUrlRequired'),
              path: ['buttons', index, 'url'],
            });
          } else if (!/^https?:\/\/.+/i.test(url)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('validation.buttonUrlFormat'),
              path: ['buttons', index, 'url'],
            });
          }
        }

        if (type === 'PHONE_NUMBER') {
          phoneCount += 1;
          const phone = button.phone_number?.trim() ?? '';
          if (!phone) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('validation.buttonPhoneRequired'),
              path: ['buttons', index, 'phone_number'],
            });
          }
        }
      });

      if (urlCount > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.buttonUrlMax'),
          path: ['buttons'],
        });
      }

      if (phoneCount > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.buttonPhoneMax'),
          path: ['buttons'],
        });
      }
    });
}

export type TemplateFormValues = z.infer<ReturnType<typeof createTemplateFormSchema>>;
