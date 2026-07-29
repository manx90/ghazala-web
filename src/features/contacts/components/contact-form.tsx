'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  contactFormSchema,
  type ContactFormValues,
} from '@/features/contacts/schemas/contact.schemas';
import type { Contact } from '@/types/contact.types';

interface ContactFormProps {
  contact?: Contact;
  mode?: 'create' | 'edit';
  onSubmit: (values: ContactFormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

function toFormValues(contact?: Contact): ContactFormValues {
  return {
    phone: contact?.phone ?? '',
    waId: contact?.waId ?? '',
    firstName: contact?.firstName ?? '',
    lastName: contact?.lastName ?? '',
    profileName: contact?.profileName ?? '',
    profilePhotoUrl: contact?.profilePhotoUrl ?? '',
    email: contact?.email ?? '',
    notes: contact?.notes ?? '',
    isBlocked: contact?.isBlocked ?? false,
  };
}

export function ContactForm({
  contact,
  mode = 'create',
  onSubmit,
  isLoading = false,
  onCancel,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: toFormValues(contact),
  });

  const isBlocked = watch('isBlocked');

  useEffect(() => {
    reset(toFormValues(contact));
  }, [contact, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {mode === 'create' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">رقم الهاتف *</Label>
          <Input id="phone" dir="ltr" {...register('phone')} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input id="firstName" {...register('firstName')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">اسم العائلة</Label>
          <Input id="lastName" {...register('lastName')} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profileName">اسم الملف</Label>
          <Input id="profileName" {...register('profileName')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="waId">WhatsApp ID</Label>
          <Input id="waId" dir="ltr" {...register('waId')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profilePhotoUrl">رابط الصورة</Label>
          <Input
            id="profilePhotoUrl"
            dir="ltr"
            {...register('profilePhotoUrl')}
            aria-invalid={!!errors.profilePhotoUrl}
          />
          {errors.profilePhotoUrl && (
            <p className="text-xs text-destructive">{errors.profilePhotoUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea id="notes" rows={4} {...register('notes')} />
      </div>

      {mode === 'edit' && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="isBlocked">حظر جهة الاتصال</Label>
            <p className="text-xs text-muted-foreground">منع إرسال واستقبال الرسائل</p>
          </div>
          <Switch
            id="isBlocked"
            checked={isBlocked}
            onCheckedChange={(checked) => setValue('isBlocked', checked)}
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            إلغاء
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {mode === 'create' ? 'إضافة جهة اتصال' : 'حفظ التغييرات'}
        </Button>
      </div>
    </form>
  );
}
