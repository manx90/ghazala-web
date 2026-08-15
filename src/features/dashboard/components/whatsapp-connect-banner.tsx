'use client';

import { MessageCircleIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

interface WhatsappConnectBannerProps {
  orgSlug: string;
  onDismiss?: () => void;
}

export function WhatsappConnectBanner({ orgSlug, onDismiss }: WhatsappConnectBannerProps) {
  const t = useTranslations('dashboard.whatsappBanner');

  return (
    <div className="animate-fade-in-up flex flex-col gap-4 rounded-xl border border-primary/20 bg-gradient-brand-soft p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="bg-gradient-brand flex size-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm">
          <MessageCircleIcon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium">{t('title')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="gradient" size="sm" render={<Link href={ROUTES.onboarding.connectWhatsapp} />}>
          {t('connectNow')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={ROUTES.app.settings.whatsapp(orgSlug)} />}
        >
          {t('settingsLink')}
        </Button>
        {onDismiss ? (
          <Button variant="ghost" size="icon-sm" onClick={onDismiss} aria-label={t('dismiss')}>
            <XIcon />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
