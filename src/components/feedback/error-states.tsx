'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  AlertTriangleIcon,
  RefreshCwIcon,
  WifiOffIcon,
  LockIcon,
  ShieldAlertIcon,
  FileQuestionIcon,
  BugIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useErrorLabels, useSanitizeError } from '@/hooks/use-error-labels';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}

function ErrorLayout({
  icon,
  title,
  message,
  onRetry,
  action,
  className,
  variant = 'destructive',
}: ErrorStateProps & { icon: ReactNode; variant?: 'default' | 'destructive' }) {
  const tCommon = useTranslations('common');

  return (
    <div
      className={cn('animate-fade-in-up flex flex-col items-center justify-center gap-5 py-12 text-center', className)}
      role="alert"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20 [&_svg]:size-6">
        {icon}
      </div>
      <Alert variant={variant} className="max-w-md rounded-xl shadow-xs">
        <AlertTriangleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCwIcon data-icon="inline-start" />
            {tCommon('retry')}
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}

export function ApiErrorState({ error, onRetry, ...rest }: ErrorStateProps) {
  const t = useTranslations('errors.api');
  const sanitize = useSanitizeError();

  return (
    <ErrorLayout
      icon={<AlertTriangleIcon className="size-10" />}
      title={rest.title ?? t('title')}
      message={error ? sanitize(error) : t('fallbackMessage')}
      error={error}
      onRetry={onRetry}
      {...rest}
    />
  );
}

export function NetworkErrorState({ onRetry, ...rest }: ErrorStateProps) {
  const t = useTranslations('errors.network');

  return (
    <ErrorLayout
      icon={<WifiOffIcon className="size-10" />}
      title={rest.title ?? t('title')}
      message={rest.message ?? t('description')}
      onRetry={onRetry}
      {...rest}
    />
  );
}

export function ForbiddenState(props: ErrorStateProps) {
  const t = useTranslations('errors.forbidden');

  return (
    <ErrorLayout
      icon={<LockIcon className="size-10" />}
      title={props.title ?? t('inlineTitle')}
      message={props.message ?? t('inlineDescription')}
      {...props}
    />
  );
}

export function UnauthorizedState(props: ErrorStateProps) {
  const t = useTranslations('errors.unauthorized');

  return (
    <ErrorLayout
      icon={<ShieldAlertIcon className="size-10" />}
      title={props.title ?? t('title')}
      message={props.message ?? t('description')}
      {...props}
    />
  );
}

export function ValidationErrorState(props: ErrorStateProps) {
  const t = useTranslations('errors.validation');

  return (
    <ErrorLayout
      icon={<AlertTriangleIcon className="size-10" />}
      title={props.title ?? t('title')}
      message={props.message ?? t('description')}
      variant="default"
      {...props}
    />
  );
}

export function NotFoundState(props: ErrorStateProps) {
  const t = useTranslations('errors.notFound');

  return (
    <ErrorLayout
      icon={<FileQuestionIcon className="size-10" />}
      title={props.title ?? t('title')}
      message={props.message ?? t('description')}
      {...props}
    />
  );
}

export function UnexpectedErrorState(props: ErrorStateProps) {
  const t = useTranslations('errors.unexpected');

  return (
    <ErrorLayout
      icon={<BugIcon className="size-10" />}
      title={props.title ?? t('title')}
      message={props.message ?? t('description')}
      onRetry={props.onRetry}
      {...props}
    />
  );
}
