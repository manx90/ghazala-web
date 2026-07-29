'use client';

import { useCallback, useState } from 'react';
import { launchEmbeddedSignup } from '@/lib/meta/embedded-signup';
import type { EmbeddedSignupSession } from '@/types/meta.types';

export function useMetaEmbeddedSignup(
  onComplete: (payload: {
    authorizationCode: string;
    wabaId: string;
    metaBusinessId?: string;
  }) => Promise<void>,
) {
  const [isLaunching, setIsLaunching] = useState(false);

  const launch = useCallback(
    async (session: EmbeddedSignupSession) => {
      if (!session.embeddedSignupConfigId) {
        throw new Error('Meta Embedded Signup غير مهيأ. تواصل مع الدعم.');
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
      } finally {
        setIsLaunching(false);
      }
    },
    [onComplete],
  );

  return { launch, isLaunching };
}
