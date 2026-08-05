import { Suspense } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen label="جاري التحميل..." />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
