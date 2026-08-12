import { z } from 'zod';

type Translate = (key: string) => string;

export function createContactFormSchema(t: Translate) {
  return z.object({
    phone: z.string().min(1, t('validation.phoneRequired')),
    waId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileName: z.string().optional(),
    profilePhotoUrl: z.string().url(t('validation.photoUrlInvalid')).optional().or(z.literal('')),
    email: z.string().email(t('validation.emailInvalid')).optional().or(z.literal('')),
    notes: z.string().optional(),
    isBlocked: z.boolean().optional(),
  });
}

export function createMergeContactsSchema(t: Translate) {
  return z.object({
    primaryContactId: z.string().min(1, t('validation.primaryRequired')),
    duplicateContactId: z.string().min(1, t('validation.duplicateRequired')),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;
export type CreateContactFormValues = ContactFormValues;
export type UpdateContactFormValues = Omit<ContactFormValues, 'phone'>;
export type MergeContactsFormValues = z.infer<ReturnType<typeof createMergeContactsSchema>>;
