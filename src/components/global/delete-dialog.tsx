'use client';

import { useTranslations } from 'next-intl';
import { ConfirmDialog } from '@/components/global/confirm-dialog';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isLoading = false,
}: DeleteDialogProps) {
  const tDialogs = useTranslations('dialogs');
  const tCommon = useTranslations('common');

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title ?? tDialogs('confirmDelete')}
      description={description ?? tDialogs('confirmDeleteDescription')}
      confirmLabel={confirmLabel ?? tCommon('delete')}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
