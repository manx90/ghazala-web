'use client';

import type { ReactNode } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';

interface AdminSectionLayoutProps {
  children: ReactNode;
}

export default function AdminSectionLayout({ children }: AdminSectionLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
