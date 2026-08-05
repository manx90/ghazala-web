'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
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
  readOnly?: boolean;
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
  readOnly = false,
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
    <form onSubmit={readOnly ? (event) => event.preventDefault() : handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {mode === 'create' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">رقم الهاتف *</Label>
          <Input
            id="phone"
            dir="ltr"
            placeholder="9665XXXXXXXX"
            disabled={readOnly}
            {...register('phone')}
            aria-invalid={!!errors.phone}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">أدخل الرقم بالصيغة الدولية بدون +</p>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input id="firstName" disabled={readOnly} {...register('firstName')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">اسم العائلة</Label>
          <Input id="lastName" disabled={readOnly} {...register('lastName')} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profileName">اسم الملف</Label>
          <Input id="profileName" disabled={readOnly} {...register('profileName')} />
          <p className="text-xs text-muted-foreground">الاسم الظاهر في حساب WhatsApp</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" disabled={readOnly} {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="waId">WhatsApp ID</Label>
          <Input id="waId" dir="ltr" disabled={readOnly} {...register('waId')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profilePhotoUrl">رابط الصورة</Label>
          <Input
            id="profilePhotoUrl"
            dir="ltr"
            disabled={readOnly}
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
        <Textarea id="notes" rows={4} disabled={readOnly} {...register('notes')} />
      </div>

      {mode === 'edit' && (
        <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-3.5">
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="isBlocked">حظر جهة الاتصال</Label>
            <p className="text-xs text-muted-foreground">منع إرسال واستقبال الرسائل</p>
          </div>
          <Switch
            id="isBlocked"
            checked={isBlocked}
            disabled={readOnly}
            onCheckedChange={(checked) => setValue('isBlocked', checked)}
          />
        </div>
      )}

      {!readOnly ? (
        <div className="flex justify-end gap-2 border-t pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              إلغاء
            </Button>
          )}
          <Button type="submit" variant="gradient" disabled={isLoading}>
            {isLoading && <Loader2Icon data-icon="inline-start" className="animate-spin" />}
            {mode === 'create' ? 'إضافة جهة اتصال' : 'حفظ التغييرات'}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
