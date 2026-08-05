import { Suspense } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingScreen label="جاري التحميل..." />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
