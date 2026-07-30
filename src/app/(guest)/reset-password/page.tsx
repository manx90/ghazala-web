import { Suspense } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { arabicFont } from '@/lib/fonts';

export default function ResetPasswordPage() {
  return (
    <div className={arabicFont.className}>
      <Suspense fallback={<LoadingScreen label="جاري التحميل..." />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
