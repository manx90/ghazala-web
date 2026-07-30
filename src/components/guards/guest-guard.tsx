'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/global/loading-screen';
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
    return <LoadingScreen label="جاري التحميل..." />;
  }

  if (isAuthenticated) {
    return <LoadingScreen label="جاري إعادة التوجيه..." />;
  }

  return children;
}
