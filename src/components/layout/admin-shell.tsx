'use client';

import { memo, type ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';

interface AdminShellProps {
  children: ReactNode;
}

function AdminShellComponent({ children }: AdminShellProps) {
  return <AppShell variant="admin">{children}</AppShell>;
}

export const AdminShell = memo(AdminShellComponent);
