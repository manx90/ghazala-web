'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/features/auth/hooks/use-session';
import { getPostLoginRedirect } from '@/utils/route';

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isSessionLoading, user, currentOrganization } = useSession();

  useEffect(() => {
    if (isSessionLoading || !isAuthenticated || !user) return;

    router.replace(getPostLoginRedirect(user.role, currentOrganization?.slug));
  }, [isAuthenticated, isSessionLoading, user, currentOrganization?.slug, router]);

  if (isSessionLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}
