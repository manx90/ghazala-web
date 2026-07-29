'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const PRIORITY_QUERY_KEYS = ['conversations', 'messages', 'dashboard', 'admin', 'billing', 'meta'];

export function useVisibilitySync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        PRIORITY_QUERY_KEYS.forEach((prefix) => {
          void queryClient.invalidateQueries({ queryKey: [prefix] });
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [queryClient]);
}
