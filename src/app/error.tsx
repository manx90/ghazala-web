'use client';

import { ErrorScreen } from '@/components/global/error-screen';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <ErrorScreen
      title="حدث خطأ"
      message={error.message}
      onRetry={reset}
    />
  );
}
