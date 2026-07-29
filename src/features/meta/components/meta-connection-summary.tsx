'use client';

import { Loader2Icon, UnplugIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
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
    <div className="flex items-start justify-between gap-4 text-sm">
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
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">حالة الاتصال</p>
            <p className="text-xs text-muted-foreground">تم ربط WhatsApp Business بنجاح</p>
          </div>
          <StatusBadge status="CONNECTED" />
        </div>

        <dl className="space-y-3 rounded-lg border p-4">
          <DetailRow label="Business Name" value={businessAccount?.name ?? integration.metaBusinessId} />
          <DetailRow
            label="WhatsApp Business Account"
            value={businessAccount?.name ?? businessAccount?.wabaId ?? integration.wabaId}
          />
          <DetailRow
            label="Connected Phone Number"
            value={phoneNumber?.displayPhoneNumber}
          />
          <DetailRow label="Display Name" value={phoneNumber?.verifiedName} />
          <DetailRow
            label="Quality Rating"
            value={
              phoneNumber?.qualityRating ? (
                <StatusBadge status={phoneNumber.qualityRating} />
              ) : (
                '—'
              )
            }
          />
          <DetailRow
            label="Verification Status"
            value={phoneNumber?.codeVerificationStatus}
          />
          <DetailRow label="Last Sync" value={formatDateTime(integration.lastSyncAt)} />
        </dl>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isSyncing}
            onClick={onSync}
          >
            {isSyncing ? <Loader2Icon className="animate-spin" /> : null}
            Sync
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            disabled={isDisconnecting}
            onClick={() => setDisconnectOpen(true)}
          >
            <UnplugIcon />
            Disconnect
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title="فصل WhatsApp"
        description="هل تريد فصل تكامل Meta؟ لن تتمكن من إرسال رسائل WhatsApp حتى إعادة الربط."
        confirmLabel="Disconnect"
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
