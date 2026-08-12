'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { launchEmbeddedSignup } from '@/lib/meta/embedded-signup';
import { isMetaSignupError } from '@/lib/meta/meta-signup-error';
import type { EmbeddedSignupSession } from '@/types/meta.types';

export function useMetaEmbeddedSignup(
  onComplete: (payload: {
    authorizationCode: string;
    wabaId: string;
    metaBusinessId?: string;
  }) => Promise<void>,
) {
  const t = useTranslations('settings.meta.embeddedSignup');
  const [isLaunching, setIsLaunching] = useState(false);

  const launch = useCallback(
    async (session: EmbeddedSignupSession) => {
      if (!session.embeddedSignupConfigId) {
        throw new Error(t('notConfigured'));
      }

      setIsLaunching(true);

      try {
        const result = await launchEmbeddedSignup({
          appId: session.appId,
          graphApiVersion: session.graphApiVersion,
          embeddedSignupConfigId: session.embeddedSignupConfigId,
        });

        await onComplete({
          authorizationCode: result.authorizationCode,
          wabaId: result.session.wabaId,
          metaBusinessId: result.session.metaBusinessId,
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
