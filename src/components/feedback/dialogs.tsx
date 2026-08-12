'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangleIcon, CheckCircle2Icon } from 'lucide-react';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  children?: ReactNode;
}

export function WarningDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isLoading,
  children,
}: WarningDialogProps) {
  const tDialogs = useTranslations('dialogs');

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel ?? tDialogs('continue')}
      onConfirm={onConfirm}
      isLoading={isLoading}
      variant="destructive"
    >
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
        <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <span className="text-muted-foreground">{children ?? description}</span>
      </div>
    </ConfirmDialog>
  );
}

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel,
  onAction,
}: SuccessDialogProps) {
  const tDialogs = useTranslations('dialogs');

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <Button
          onClick={() => {
            onAction?.();
            onOpenChange(false);
          }}
        >
          {actionLabel ?? tDialogs('done')}
        </Button>
      }
    >
      <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
        <CheckCircle2Icon className="size-5 shrink-0 text-emerald-600" />
        <span className="text-muted-foreground">{description ?? title}</span>
      </div>
    </ModalWrapper>
  );
}

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg' };

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel,
  cancelLabel,
  onSubmit,
  isLoading = false,
  size = 'md',
}: FormDialogProps) {
  const tCommon = useTranslations('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClass[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {children}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {cancelLabel ?? tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? tCommon('saving') : (submitLabel ?? tCommon('save'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FullScreenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function FullScreenDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: FullScreenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-svh w-svw max-w-none translate-x-0 translate-y-0 top-0 left-0 rounded-none p-0 sm:max-w-none">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6 py-4">{children}</div>
        {footer && <div className="border-t bg-muted/50 px-6 py-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
