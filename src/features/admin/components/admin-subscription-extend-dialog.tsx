'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ModalWrapper } from '@/components/global/modal-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExtendAdminSubscription } from '@/features/admin/hooks/use-admin-subscriptions';
import type { AdminSubscription } from '@/types/admin.types';

interface AdminSubscriptionExtendDialogProps {
  subscription: AdminSubscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminSubscriptionExtendDialog({
  subscription,
  open,
  onOpenChange,
}: AdminSubscriptionExtendDialogProps) {
  const t = useTranslations('admin.subscriptions.extendDialog');
  const tCommon = useTranslations('common');
  const tAdminCommon = useTranslations('admin.common');
  const [days, setDays] = useState('30');
  const extendMutation = useExtendAdminSubscription();

  const handleSubmit = async () => {
    if (!subscription) return;

    const parsedDays = Number(days);
    if (!Number.isInteger(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      return;
    }

    await extendMutation.mutateAsync({
      id: subscription.id,
      payload: { days: parsedDays },
    });
    onOpenChange(false);
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={
        subscription
          ? `${subscription.organization?.name ?? tAdminCommon('notAvailable')} — ${subscription.plan?.name ?? tAdminCommon('notAvailable')}`
          : undefined
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={extendMutation.isPending}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={extendMutation.isPending}>
            {extendMutation.isPending ? t('extending') : t('confirm')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="extend-days">{t('daysLabel')}</Label>
        <Input
          id="extend-days"
          type="number"
          min={1}
          max={365}
          dir="ltr"
          value={days}
          onChange={(event) => setDays(event.target.value)}
        />
      </div>
    </ModalWrapper>
  );
}
