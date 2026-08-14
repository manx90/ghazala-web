'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { launchEmbeddedSignup } from '@/lib/meta/embedded-signup';
import { isMetaSignupError } from '@/lib/meta/meta-signup-error';
import type { MetaOnboardingMode } from '@/types/meta-onboarding.types';
import type { EmbeddedSignupSession } from '@/types/meta.types';

export interface EmbeddedSignupCompletePayload {
  authorizationCode: string;
  wabaId: string;
  metaBusinessId?: string;
  phoneNumberId?: string;
  onboardingMode: MetaOnboardingMode;
}

function resolveConfigId(session: EmbeddedSignupSession, mode: MetaOnboardingMode): string | null {
  if (mode === 'coexistence') {
    return session.coexistenceConfigId ?? null;
  }

  return session.embeddedSignupConfigId ?? null;
}

export function useMetaEmbeddedSignup(
  onComplete: (payload: EmbeddedSignupCompletePayload) => Promise<void>,
) {
  const t = useTranslations('settings.meta.embeddedSignup');
  const [isLaunching, setIsLaunching] = useState(false);

  const launch = useCallback(
    async (session: EmbeddedSignupSession, mode: MetaOnboardingMode = 'standard') => {
      const configId = resolveConfigId(session, mode);

      if (!configId) {
        throw new Error(mode === 'coexistence' ? t('coexistenceNotConfigured') : t('notConfigured'));
      }

      setIsLaunching(true);

      try {
        const result = await launchEmbeddedSignup({
          appId: session.appId,
          graphApiVersion: session.graphApiVersion,
          embeddedSignupConfigId: configId,
          mode,
        });

        await onComplete({
          authorizationCode: result.authorizationCode,
          wabaId: result.session.wabaId,
          metaBusinessId: result.session.metaBusinessId,
          phoneNumberId: result.session.phoneNumberId,
          onboardingMode: result.onboardingMode,
        });
      } catch (error) {
        if (isMetaSignupError(error)) {
          throw new Error(t(error.code));
        }
        throw error;
      } finally {
        setIsLaunching(false);
      }
    },
    [onComplete, t],
  );

  return { launch, isLaunching };
}
