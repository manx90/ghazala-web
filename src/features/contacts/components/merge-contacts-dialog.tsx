'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  createMergeContactsSchema,
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

function getInitials(contact: Contact): string {
  const name = getDisplayName(contact).trim();
  if (!name || name === contact.phone) return contact.phone.slice(-2);
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('');
}

interface ContactPickListProps {
  contacts: Contact[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function ContactPickList({ contacts, selectedId, onSelect }: ContactPickListProps) {
  return (
    <div className="max-h-44 divide-y overflow-y-auto rounded-xl border bg-card">
      {contacts.map((contact) => {
        const selected = contact.id === selectedId;
        return (
          <button
            key={contact.id}
            type="button"
            onClick={() => onSelect(contact.id)}
            aria-pressed={selected}
            className={cn(
              'flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-muted/60',
              selected && 'bg-primary/5 ring-2 ring-inset ring-primary',
            )}
          >
            <Avatar size="default">
              <AvatarFallback className="bg-gradient-brand-soft font-semibold text-primary">
                {getInitials(contact)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{getDisplayName(contact)}</span>
              <span dir="ltr" className="block text-start font-mono text-xs text-muted-foreground">
                {contact.phone}
              </span>
            </span>
            {selected && <CheckIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
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
  const t = useTranslations('contacts.merge');
  const tContacts = useTranslations('contacts');
  const schema = useMemo(() => createMergeContactsSchema(tContacts), [tContacts]);

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MergeContactsFormValues>({
    resolver: zodResolver(schema),
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
      title={t('title')}
      description={t('description')}
      confirmLabel={t('confirm')}
      onConfirm={handleSubmit(onConfirm)}
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="flex flex-col gap-1.5">
          <Label>{t('primaryLabel')}</Label>
          <ContactPickList
            contacts={availablePrimaries}
            selectedId={primaryContactId}
            onSelect={(id) => setValue('primaryContactId', id, { shouldValidate: true })}
          />
          {errors.primaryContactId && (
            <p className="text-xs text-destructive">{errors.primaryContactId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t('duplicateLabel')}</Label>
          <ContactPickList
            contacts={availableDuplicates}
            selectedId={duplicateContactId}
            onSelect={(id) => setValue('duplicateContactId', id, { shouldValidate: true })}
          />
          {errors.duplicateContactId && (
            <p className="text-xs text-destructive">{errors.duplicateContactId.message}</p>
          )}
        </div>
      </div>
    </ConfirmDialog>
  );
}
