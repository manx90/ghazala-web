'use client';

import { ErrorScreen } from '@/components/global/error-screen';
import { sanitizeRuntimeError } from '@/utils/sanitize-error';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <ErrorScreen
      title="حدث خطأ"
      message={sanitizeRuntimeError(error)}
      onRetry={reset}
    />
  );
}
