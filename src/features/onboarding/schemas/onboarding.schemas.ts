import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'اسم المنظمة مطلوب').max(200),
  slug: z
    .string()
    .min(3, 'المعرف يجب أن يكون 3 أحرف على الأقل')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'أحرف صغيرة وأرقام وشرطات فقط'),
  timezone: z.string().min(1, 'المنطقة الزمنية مطلوبة'),
  country: z.string().length(2, 'رمز الدولة غير صالح'),
});

export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Riyadh', label: 'الرياض (Asia/Riyadh)' },
  { value: 'Asia/Dubai', label: 'دبي (Asia/Dubai)' },
  { value: 'Asia/Kuwait', label: 'الكويت (Asia/Kuwait)' },
  { value: 'Asia/Qatar', label: 'قطر (Asia/Qatar)' },
  { value: 'Africa/Cairo', label: 'القاهرة (Africa/Cairo)' },
  { value: 'UTC', label: 'UTC' },
] as const;

export const COUNTRY_OPTIONS = [
  { value: 'SA', label: 'السعودية' },
  { value: 'AE', label: 'الإمارات' },
  { value: 'KW', label: 'الكويت' },
  { value: 'QA', label: 'قطر' },
  { value: 'BH', label: 'البحرين' },
  { value: 'OM', label: 'عُمان' },
  { value: 'EG', label: 'مصر' },
  { value: 'JO', label: 'الأردن' },
] as const;
