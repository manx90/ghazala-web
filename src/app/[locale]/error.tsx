'use client';

import { useTranslations } from 'next-intl';
import { ErrorScreen } from '@/components/global/error-screen';
import { useSanitizeRuntimeError } from '@/hooks/use-error-labels';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('errors.page');
  const sanitizeRuntime = useSanitizeRuntimeError();

  return (
    <ErrorScreen
      title={t('title')}
      message={sanitizeRuntime(error)}
      onRetry={reset}
    />
  );
}
