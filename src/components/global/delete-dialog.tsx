'use client';

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
  title = 'تأكيد الحذف',
  description = 'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmLabel = 'حذف',
  onConfirm,
  isLoading = false,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
    />
  );
}
