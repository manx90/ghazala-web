'use client';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { SocketProvider } from '@/providers/socket-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { OfflineBanner } from '@/components/global/offline-banner';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { useVisibilitySync } from '@/hooks/use-visibility-sync';
import type { ReactNode } from 'react';

function SyncEffects() {
  useNetworkAware();
  useVisibilitySync();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider delay={200}>
          <AuthProvider>
            <SocketProvider>
              <SyncEffects />
              <OfflineBanner />
              {children}
              <Toaster richColors closeButton position="top-center" />
            </SocketProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
