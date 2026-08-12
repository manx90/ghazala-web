'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  isLoading = false,
  variant = 'default',
  children,
}: ConfirmDialogProps) {
  const tCommon = useTranslations('common');

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel ?? tCommon('cancel')}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmLabel ?? tCommon('confirm')}
          </Button>
        </>
      }
    >
      {children}
    </ModalWrapper>
  );
}
