'use client';

import type { ReactNode } from 'react';
import { OnboardingCompleteGuard } from '@/components/guards/onboarding-complete-guard';
import { OrganizationGuard } from '@/components/guards/organization-guard';
import { ClientShell } from '@/components/layout/client-shell';

interface OrgSlugLayoutProps {
  children: ReactNode;
}

export default function OrgSlugLayout({ children }: OrgSlugLayoutProps) {
  return (
    <OrganizationGuard>
      <OnboardingCompleteGuard>
        <ClientShell>{children}</ClientShell>
      </OnboardingCompleteGuard>
    </OrganizationGuard>
  );
}
