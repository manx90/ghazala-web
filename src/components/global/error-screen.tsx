'use client';

import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageContainer } from '@/components/global/page-container';
import { getErrorMessage } from '@/utils/error';
import { cn } from '@/lib/utils';

interface ErrorScreenProps {
  title?: string;
  error?: unknown;
  message?: string;
  onRetry?: () => void;
  className?: string;
  fullScreen?: boolean;
}

export function ErrorScreen({
  title = 'حدث خطأ',
  error,
  message,
  onRetry,
  className,
  fullScreen = true,
}: ErrorScreenProps) {
  const resolvedMessage = message ?? (error ? getErrorMessage(error) : 'حدث خطأ غير متوقع');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-background',
        fullScreen && 'min-h-svh',
        className,
      )}
      role="alert"
    >
      <PageContainer size="sm" className="flex flex-col items-center gap-6 py-12">
        <Alert variant="destructive" className="w-full">
          <AlertTriangleIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{resolvedMessage}</AlertDescription>
        </Alert>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCwIcon data-icon="inline-start" />
            إعادة المحاولة
          </Button>
        )}
      </PageContainer>
    </div>
  );
}
