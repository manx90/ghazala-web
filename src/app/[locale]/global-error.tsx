'use client';

import { useTranslations } from 'next-intl';
import { ErrorScreen } from '@/components/global/error-screen';
import { useSanitizeRuntimeError } from '@/hooks/use-error-labels';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  const t = useTranslations('errors.global');
  const sanitizeRuntime = useSanitizeRuntimeError();

  return (
    <html lang="ar" dir="rtl">
      <body>
        <ErrorScreen
          title={t('title')}
          message={sanitizeRuntime(error)}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
