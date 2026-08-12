'use client';

import { useTranslations } from 'next-intl';
import { WifiOffIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const t = useTranslations('dialogs');

  if (isOnline) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 w-full">
      <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
        <WifiOffIcon />
        <AlertDescription>{t('offlineBanner')}</AlertDescription>
      </Alert>
    </div>
  );
}
