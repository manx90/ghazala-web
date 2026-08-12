'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { sanitizeErrorForDisplay, sanitizeRuntimeError as sanitizeRuntime } from '@/utils/sanitize-error';

export function useErrorLabels() {
  const t = useTranslations('errors');

  const codes = useMemo(
    () => ({
      UNAUTHORIZED: t('codes.UNAUTHORIZED'),
      FORBIDDEN: t('codes.FORBIDDEN'),
      NOT_FOUND: t('codes.NOT_FOUND'),
      VALIDATION_ERROR: t('codes.VALIDATION_ERROR'),
      NETWORK_ERROR: t('codes.NETWORK_ERROR'),
      TIMEOUT: t('codes.TIMEOUT'),
      RATE_LIMITED: t('codes.RATE_LIMITED'),
      SERVER_ERROR: t('codes.SERVER_ERROR'),
    }),
    [t],
  );

  const fallback = t('generic.fallback');
  const runtimeFallback = t('runtime.message');

  const sanitizeOptions = useMemo(
    () => ({ codes, fallback, runtimeFallback }),
    [codes, fallback, runtimeFallback],
  );

  const toastLabels = useMemo(
    () => ({
      fallback,
      forbidden: t('forbidden.actionDenied'),
      conflict: t('conflict.title'),
      offline: t('network.offline'),
    }),
    [t, fallback],
  );

  return { t, codes, fallback, runtimeFallback, sanitizeOptions, toastLabels };
}

export function useSanitizeError() {
  const { sanitizeOptions } = useErrorLabels();

  return useCallback(
    (error: unknown) =>
      sanitizeErrorForDisplay(error, sanitizeOptions.fallback, sanitizeOptions.codes),
    [sanitizeOptions],
  );
}

export function useSanitizeRuntimeError() {
  const { runtimeFallback } = useErrorLabels();
  return useCallback(
    (error: Error & { digest?: string }) => sanitizeRuntime(error, runtimeFallback),
    [runtimeFallback],
  );
}
