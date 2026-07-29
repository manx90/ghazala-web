'use client';

import type { ReactNode } from 'react';
import { OrganizationGuard } from '@/components/guards/organization-guard';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <OrganizationGuard>{children}</OrganizationGuard>;
}
