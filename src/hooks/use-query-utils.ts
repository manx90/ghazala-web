'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useQueryInvalidation() {
  const queryClient = useQueryClient();

  const invalidate = useCallback(
    (keys: readonly string[]) => {
      void queryClient.invalidateQueries({ queryKey: [...keys] });
    },
    [queryClient],
  );

  const invalidateAll = useCallback(
    (keys: readonly string[]) => {
      void queryClient.invalidateQueries({ queryKey: [...keys], refetchType: 'all' });
    },
    [queryClient],
  );

  const refetch = useCallback(
    (keys: readonly string[]) => {
      return queryClient.refetchQueries({ queryKey: [...keys] });
    },
    [queryClient],
  );

  return { invalidate, invalidateAll, refetch };
}

export function useOptimisticUpdate() {
  const queryClient = useQueryClient();

  const setQueryData = useCallback(
    <T>(queryKey: readonly string[], updater: (old: T | undefined) => T | undefined) => {
      queryClient.setQueryData<T>([...queryKey], updater);
    },
    [queryClient],
  );

  return { setQueryData, queryClient };
}

export function useBackgroundSync() {
  const queryClient = useQueryClient();

  const resume = useCallback(() => {
    void queryClient.refetchQueries({ type: 'active' });
  }, [queryClient]);

  return { resume };
}
