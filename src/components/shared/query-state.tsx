'use client';

import type { ReactNode } from 'react';
import { EmptyState } from '@/components/global/empty-state';
import { ErrorScreen } from '@/components/global/error-screen';
import { SkeletonLoader } from '@/components/global/skeleton-loader';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRetry?: () => void;
  skeletonRows?: number;
  children: ReactNode;
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onRetry,
  skeletonRows = 5,
  children,
}: QueryStateProps) {
  if (isLoading) return <SkeletonLoader rows={skeletonRows} />;
  if (isError) return <ErrorScreen error={error} onRetry={onRetry} fullScreen={false} />;
  if (isEmpty) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
    );
  }
  return children;
}
