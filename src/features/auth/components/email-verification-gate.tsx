'use client';

import type { ReactNode } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSession } from '@/features/auth/hooks/use-session';
import { UserRole } from '@/types/auth.types';
import { VerifyEmailForm } from './verify-email-form';

interface EmailVerificationGateProps {
  children: ReactNode;
}

export function EmailVerificationGate({ children }: EmailVerificationGateProps) {
  const { user, isSessionLoading } = useSession();

  const needsVerification =
    !isSessionLoading &&
    Boolean(user) &&
    user!.role !== UserRole.SUPER_ADMIN &&
    !user!.emailVerified;

  return (
    <>
      <div
        className={needsVerification ? 'pointer-events-none select-none' : undefined}
        aria-hidden={needsVerification || undefined}
      >
        {children}
      </div>

      <Dialog
        open={needsVerification}
        onOpenChange={(nextOpen) => {
          if (needsVerification && !nextOpen) return;
        }}
      >
        <DialogContent showCloseButton={false} className="pointer-events-auto z-[100] sm:max-w-md">
          {user ? <VerifyEmailForm variant="modal" email={user.email} /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
