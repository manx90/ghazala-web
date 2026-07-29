import { z } from 'zod';

export const contactFormSchema = z.object({
  phone: z.string().min(1, 'رقم الهاتف مطلوب'),
  waId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileName: z.string().optional(),
  profilePhotoUrl: z.string().url('رابط الصورة غير صالح').optional().or(z.literal('')),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  notes: z.string().optional(),
  isBlocked: z.boolean().optional(),
});

export const createContactSchema = contactFormSchema;
export const updateContactSchema = contactFormSchema.omit({ phone: true });

export const mergeContactsSchema = z.object({
  primaryContactId: z.string().min(1, 'جهة الاتصال الأساسية مطلوبة'),
  duplicateContactId: z.string().min(1, 'جهة الاتصال المكررة مطلوبة'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type CreateContactFormValues = z.infer<typeof createContactSchema>;
export type UpdateContactFormValues = z.infer<typeof updateContactSchema>;
export type MergeContactsFormValues = z.infer<typeof mergeContactsSchema>;
