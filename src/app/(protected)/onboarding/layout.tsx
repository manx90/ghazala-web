'use client';

import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/guards/auth-guard';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return <AuthGuard>{children}</AuthGuard>;
}
