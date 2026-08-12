'use client';

import { CheckCircle2Icon, Loader2Icon, UnplugIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConnectionStatusPill } from '@/features/meta/components/connection-status-pill';
import { formatDateTime } from '@/utils/date';
import type { MetaIntegration } from '@/types/meta.types';
import type { PhoneNumber, WhatsappBusinessAccount } from '@/types/whatsapp.types';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface MetaConnectionSummaryProps {
  integration: MetaIntegration;
  businessAccount: WhatsappBusinessAccount | null;
  phoneNumber: PhoneNumber | null;
  onSync: () => void;
  onDisconnect: () => Promise<void>;
  isSyncing: boolean;
  isDisconnecting: boolean;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-muted/40">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-left font-medium" dir="ltr">
        {value ?? '—'}
      </dd>
    </div>
  );
}

export function MetaConnectionSummary({
  integration,
  businessAccount,
  phoneNumber,
  onSync,
  onDisconnect,
  isSyncing,
  isDisconnecting,
}: MetaConnectionSummaryProps) {
  const t = useTranslations('settings.meta');
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-success/30 bg-success/5 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{t('connection.connectedTitle')}</p>
              <p className="text-xs text-muted-foreground">{t('connection.connectedDescription')}</p>
            </div>
          </div>
          <ConnectionStatusPill connected />
        </div>

        <dl className="divide-y divide-border overflow-hidden rounded-xl border bg-card">
          <DetailRow label={t('summary.businessName')} value={businessAccount?.name ?? integration.metaBusinessId} />
          <DetailRow
            label={t('summary.waba')}
            value={businessAccount?.name ?? businessAccount?.wabaId ?? integration.wabaId}
          />
          <DetailRow label={t('summary.connectedPhone')} value={phoneNumber?.displayPhoneNumber} />
          <DetailRow label={t('summary.displayName')} value={phoneNumber?.verifiedName} />
          <DetailRow
            label={t('summary.qualityRating')}
            value={phoneNumber?.qualityRating ? <StatusBadge status={phoneNumber.qualityRating} /> : '—'}
          />
          <DetailRow label={t('summary.verificationStatus')} value={phoneNumber?.codeVerificationStatus} />
          <DetailRow label={t('summary.lastSync')} value={formatDateTime(integration.lastSyncAt)} />
        </dl>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="flex-1" disabled={isSyncing} onClick={onSync}>
            {isSyncing ? <Loader2Icon className="animate-spin" /> : null}
            {t('connection.sync')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            disabled={isDisconnecting}
            onClick={() => setDisconnectOpen(true)}
          >
            <UnplugIcon />
            {t('connection.disconnect')}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title={t('disconnectDialog.title')}
        description={t('disconnectDialog.description')}
        confirmLabel={t('disconnectDialog.confirm')}
        variant="destructive"
        onConfirm={async () => {
          await onDisconnect();
          setDisconnectOpen(false);
        }}
        isLoading={isDisconnecting}
      />
    </>
  );
}
