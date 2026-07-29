'use client';

import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/ui.store';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);
  const setOffline = useUiStore((state) => state.setOffline);

  useEffect(() => {
    const updateStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setOffline(!online);
    };

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, [setOffline]);

  return isOnline;
}
