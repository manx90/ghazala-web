'use client';

import type { ReactNode } from 'react';
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
import { sanitizeErrorForDisplay } from '@/utils/sanitize-error';

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
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)} role="alert">
      <div className="text-muted-foreground">{icon}</div>
      <Alert variant={variant} className="max-w-md">
        <AlertTriangleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCwIcon data-icon="inline-start" />
            إعادة المحاولة
          </Button>
        )}
        {action}
      </div>
    </div>
  );
}

export function ApiErrorState({ error, onRetry, ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<AlertTriangleIcon className="size-10" />}
      title="تعذر تحميل البيانات"
      message={error ? sanitizeErrorForDisplay(error) : 'حدث خطأ في الاتصال بالخادم'}
      error={error}
      onRetry={onRetry}
      {...rest}
    />
  );
}

export function NetworkErrorState({ onRetry, ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<WifiOffIcon className="size-10" />}
      title="خطأ في الشبكة"
      message="تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت."
      onRetry={onRetry}
      {...rest}
    />
  );
}

export function ForbiddenState({ message = 'ليس لديك صلاحية للوصول إلى هذا المحتوى.', ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<LockIcon className="size-10" />}
      title="وصول مرفوض"
      message={message}
      {...rest}
    />
  );
}

export function UnauthorizedState({ message = 'يجب تسجيل الدخول للوصول إلى هذا المحتوى.', ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<ShieldAlertIcon className="size-10" />}
      title="غير مصرّح"
      message={message}
      {...rest}
    />
  );
}

export function ValidationErrorState({ message = 'يرجى مراجعة الحقول وإصلاح الأخطاء.', ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<AlertTriangleIcon className="size-10" />}
      title="خطأ في التحقق"
      message={message}
      variant="default"
      {...rest}
    />
  );
}

export function NotFoundState({ message = 'المورد المطلوب غير موجود.', ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<FileQuestionIcon className="size-10" />}
      title="غير موجود"
      message={message}
      {...rest}
    />
  );
}

export function UnexpectedErrorState({ message = 'حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً.', onRetry, ...rest }: ErrorStateProps) {
  return (
    <ErrorLayout
      icon={<BugIcon className="size-10" />}
      title="خطأ غير متوقع"
      message={message}
      onRetry={onRetry}
      {...rest}
    />
  );
}
