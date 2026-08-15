'use client';

import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/guards/auth-guard';
import { EmailVerificationGate } from '@/features/auth/components/email-verification-gate';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <EmailVerificationGate>{children}</EmailVerificationGate>
    </AuthGuard>
  );
}
