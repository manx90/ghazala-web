'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageContainer } from '@/components/global/page-container';
import { useErrorLabels, useSanitizeError } from '@/hooks/use-error-labels';
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
  title,
  error,
  message,
  onRetry,
  className,
  fullScreen = true,
}: ErrorScreenProps) {
  const t = useTranslations('errors.generic');
  const tCommon = useTranslations('common');
  const { fallback } = useErrorLabels();
  const sanitize = useSanitizeError();

  const resolvedMessage = message ?? (error ? sanitize(error) : fallback);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-background',
        fullScreen && 'min-h-svh',
        className,
      )}
      role="alert"
    >
      <PageContainer size="sm" className="animate-fade-in-up flex flex-col items-center gap-6 py-12">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
          <AlertTriangleIcon className="size-6" aria-hidden="true" />
        </div>
        <Alert variant="destructive" className="w-full rounded-xl shadow-xs">
          <AlertTitle>{title ?? t('title')}</AlertTitle>
          <AlertDescription>{resolvedMessage}</AlertDescription>
        </Alert>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCwIcon data-icon="inline-start" />
            {tCommon('retry')}
          </Button>
        )}
      </PageContainer>
    </div>
  );
}
