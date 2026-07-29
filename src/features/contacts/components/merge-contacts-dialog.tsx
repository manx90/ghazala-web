'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mergeContactsSchema,
  type MergeContactsFormValues,
} from '@/features/contacts/schemas/contact.schemas';
import type { Contact } from '@/types/contact.types';

interface MergeContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: Contact[];
  preselectedIds?: string[];
  onConfirm: (values: MergeContactsFormValues) => void;
  isLoading?: boolean;
}

function getDisplayName(contact: Contact): string {
  return (
    contact.fullName ||
    [contact.firstName, contact.lastName].filter(Boolean).join(' ') ||
    contact.profileName ||
    contact.phone
  );
}

export function MergeContactsDialog({
  open,
  onOpenChange,
  contacts,
  preselectedIds = [],
  onConfirm,
  isLoading = false,
}: MergeContactsDialogProps) {
  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MergeContactsFormValues>({
    resolver: zodResolver(mergeContactsSchema),
    defaultValues: {
      primaryContactId: preselectedIds[0] ?? '',
      duplicateContactId: preselectedIds[1] ?? '',
    },
  });

  const primaryContactId = watch('primaryContactId');
  const duplicateContactId = watch('duplicateContactId');

  useEffect(() => {
    if (open) {
      reset({
        primaryContactId: preselectedIds[0] ?? '',
        duplicateContactId: preselectedIds[1] ?? '',
      });
    }
  }, [open, preselectedIds, reset]);

  const availableDuplicates = contacts.filter((c) => c.id !== primaryContactId);
  const availablePrimaries = contacts.filter((c) => c.id !== duplicateContactId);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="دمج جهات الاتصال"
      description="سيتم نقل المحادثات من الجهة المكررة إلى الجهة الأساسية ثم حذف المكررة."
      confirmLabel="دمج"
      onConfirm={handleSubmit(onConfirm)}
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-1.5">
          <Label>جهة الاتصال الأساسية (المحتفظ بها)</Label>
          <Select
            value={primaryContactId}
            onValueChange={(value) => setValue('primaryContactId', value ?? '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر جهة الاتصال الأساسية" />
            </SelectTrigger>
            <SelectContent>
              {availablePrimaries.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {getDisplayName(contact)} — {contact.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.primaryContactId && (
            <p className="text-xs text-destructive">{errors.primaryContactId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>جهة الاتصال المكررة (سيتم حذفها)</Label>
          <Select
            value={duplicateContactId}
            onValueChange={(value) => setValue('duplicateContactId', value ?? '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر جهة الاتصال المكررة" />
            </SelectTrigger>
            <SelectContent>
              {availableDuplicates.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {getDisplayName(contact)} — {contact.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.duplicateContactId && (
            <p className="text-xs text-destructive">{errors.duplicateContactId.message}</p>
          )}
        </div>
      </div>
    </ConfirmDialog>
  );
}
