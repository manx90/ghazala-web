'use client';

import { useParams } from 'next/navigation';
import { memo, type ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';

interface ClientShellProps {
  children: ReactNode;
}

function ClientShellComponent({ children }: ClientShellProps) {
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;

  return (
    <AppShell variant="client" orgSlug={orgSlug}>
      {children}
    </AppShell>
  );
}

export const ClientShell = memo(ClientShellComponent);
