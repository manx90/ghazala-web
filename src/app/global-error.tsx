'use client';

import { ErrorScreen } from '@/components/global/error-screen';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ErrorScreen
          title="خطأ في النظام"
          message={error.message}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
