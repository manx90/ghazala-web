'use client';

import type { ReactNode } from 'react';
import { ClientShell } from '@/components/layout/client-shell';

interface OrgSlugLayoutProps {
  children: ReactNode;
}

export default function OrgSlugLayout({ children }: OrgSlugLayoutProps) {
  return <ClientShell>{children}</ClientShell>;
}
