'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/types/api.types';
import { getErrorMessage, getValidationMessages } from '@/utils/error';
import { useErrorLabels } from '@/hooks/use-error-labels';

export function useToastI18n() {
  const { toastLabels } = useErrorLabels();
  const tDialogs = useTranslations('dialogs');

  const toastSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const toastError = useCallback(
    (error: unknown, fallback?: string) => {
      toast.error(getErrorMessage(error, fallback ?? toastLabels.fallback));
    },
    [toastLabels.fallback],
  );

  const toastApiError = useCallback(
    (error: unknown) => {
      const parsed = error instanceof ApiError ? error : null;

      if (parsed?.isForbidden) {
        toast.error(parsed.message || toastLabels.forbidden);
        return;
      }

      if (parsed?.code === 'CONFLICT') {
        toast.error(parsed.message || toastLabels.conflict);
        return;
      }

      if (parsed?.isOffline) {
        toast.error(tDialogs('offline'));
        return;
      }

      toastError(error);
    },
    [toastLabels, tDialogs, toastError],
  );

  const toastValidationError = useCallback((error: unknown) => {
    getValidationMessages(error).forEach((message) => toast.error(message));
  }, []);

  return useMemo(
    () => ({
      toastSuccess,
      toastError,
      toastApiError,
      toastValidationError,
    }),
    [toastSuccess, toastError, toastApiError, toastValidationError],
  );
}
