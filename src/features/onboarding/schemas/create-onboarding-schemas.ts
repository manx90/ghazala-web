import { z } from 'zod';

type ValidationTranslator = (key: string) => string;

export function createOrganizationSchema(t: ValidationTranslator) {
  return z.object({
    name: z.string().min(2, t('orgNameRequired')).max(200),
    slug: z
      .string()
      .min(3, t('slugMin'))
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('slugFormat')),
    timezone: z.string().min(1, t('timezoneRequired')),
    country: z.string().length(2, t('countryInvalid')),
  });
}

export type CreateOrganizationFormValues = z.infer<ReturnType<typeof createOrganizationSchema>>;

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Riyadh', labelKey: 'timezones.riyadh' },
  { value: 'Asia/Dubai', labelKey: 'timezones.dubai' },
  { value: 'Asia/Kuwait', labelKey: 'timezones.kuwait' },
  { value: 'Asia/Qatar', labelKey: 'timezones.qatar' },
  { value: 'Africa/Cairo', labelKey: 'timezones.cairo' },
  { value: 'UTC', labelKey: 'timezones.utc' },
] as const;

export const COUNTRY_OPTIONS = [
  { value: 'SA', labelKey: 'countries.SA' },
  { value: 'AE', labelKey: 'countries.AE' },
  { value: 'KW', labelKey: 'countries.KW' },
  { value: 'QA', labelKey: 'countries.QA' },
  { value: 'BH', labelKey: 'countries.BH' },
  { value: 'OM', labelKey: 'countries.OM' },
  { value: 'EG', labelKey: 'countries.EG' },
  { value: 'JO', labelKey: 'countries.JO' },
] as const;
