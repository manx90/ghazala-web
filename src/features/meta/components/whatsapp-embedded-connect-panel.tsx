'use client';

import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MetaEmbeddedSignupButton } from '@/features/meta/components/meta-embedded-signup-button';
import type { MetaOnboardingMode } from '@/types/meta-onboarding.types';
import type { EmbeddedSignupSession } from '@/types/meta.types';

interface WhatsappEmbeddedConnectPanelProps {
  session?: EmbeddedSignupSession | null;
  disabled?: boolean;
  onConnect: (payload: {
    authorizationCode: string;
    wabaId: string;
    metaBusinessId?: string;
    phoneNumberId?: string;
    onboardingMode: MetaOnboardingMode;
  }) => Promise<void>;
  isConnecting?: boolean;
}

export function WhatsappEmbeddedConnectPanel({
  session,
  disabled,
  onConnect,
  isConnecting,
}: WhatsappEmbeddedConnectPanelProps) {
  const t = useTranslations('onboarding.connectWhatsapp');

  if (!session) {
    return <p className="text-sm text-destructive">{t('embeddedNotConfigured')}</p>;
  }

  const isStandardConfigured = Boolean(
    session.standardSignupConfigured ??
      (session.appId && session.embeddedSignupConfigId),
  );
  const isCoexistenceConfigured = Boolean(
    session.coexistenceSignupConfigured ??
      (session.appId && session.coexistenceConfigId),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border/60 p-4">
        <p className="text-sm font-medium">{t('standardFlow.title')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('standardFlow.description')}</p>
        <div className="mt-4">
          {isStandardConfigured ? (
            <MetaEmbeddedSignupButton
              session={session}
              mode="standard"
              label={t('standardFlow.action')}
              disabled={disabled}
              onConnect={onConnect}
            />
          ) : (
            <p className="text-sm text-destructive">{t('embeddedNotConfigured')}</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/60 p-4">
        <p className="text-sm font-medium">{t('coexistenceFlow.title')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('coexistenceFlow.description')}</p>
        <div className="mt-4">
          {isCoexistenceConfigured ? (
            <MetaEmbeddedSignupButton
              session={session}
              mode="coexistence"
              label={t('coexistenceFlow.action')}
              disabled={disabled}
              onConnect={onConnect}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{t('coexistenceFlow.notConfigured')}</p>
          )}
        </div>
      </div>

      {isConnecting ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          {t('connecting')}
        </div>
      ) : null}
    </div>
  );
}
