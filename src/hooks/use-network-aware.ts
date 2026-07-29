'use client';

import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/ui.store';

export interface NetworkState {
  isOnline: boolean;
  isSlow: boolean;
}

export function useNetworkAware(): NetworkState {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlow, setIsSlow] = useState(false);
  const setOffline = useUiStore((state) => state.setOffline);

  useEffect(() => {
    const updateOnline = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setOffline(!online);
    };

    const updateConnection = () => {
      const conn = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
      if (conn) {
        const slow = conn.effectiveType === '2g' || (conn.downlink && conn.downlink < 1);
        setIsSlow(Boolean(slow));
      }
    };

    updateOnline();
    updateConnection();

    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    (navigator as unknown as { connection?: EventTarget }).connection?.addEventListener?.('change', updateConnection);

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
      (navigator as unknown as { connection?: EventTarget }).connection?.removeEventListener?.(
        'change',
        updateConnection,
      );
    };
  }, [setOffline]);

  return { isOnline, isSlow };
}
