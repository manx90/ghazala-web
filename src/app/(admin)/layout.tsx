'use client';

import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/guards/auth-guard';
import { RoleGuard } from '@/components/guards/role-guard';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <RoleGuard requireSuperAdmin>{children}</RoleGuard>
    </AuthGuard>
  );
}
