import { z } from 'zod';
import { isValidCountryCode, isValidTimezone } from '@/constants/geo.constants';

type ValidationTranslator = (key: string) => string;

export function createOrganizationSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(2, t('orgNameRequired')).max(200),
    slug: z
      .string()
      .min(3, t('slugMin'))
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('slugFormat')),
    timezone: z
      .string()
      .min(1, t('timezoneRequired'))
      .refine(isValidTimezone, t('timezoneInvalid')),
    country: z
      .string()
      .length(2, t('countryInvalid'))
      .refine((code) => isValidCountryCode(code), t('countryInvalid')),
  });
}

export type CreateOrganizationFormValues = z.infer<ReturnType<typeof createOrganizationSchema>>;