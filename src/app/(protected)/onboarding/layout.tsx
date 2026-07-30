'use client';

import type { ReactNode } from 'react';
import { AuthGuard } from '@/components/guards/auth-guard';
import { OnboardingStepGuard } from '@/components/guards/onboarding-step-guard';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <AuthGuard>
      <OnboardingStepGuard>{children}</OnboardingStepGuard>
    </AuthGuard>
  );
}
