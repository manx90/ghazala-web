import { Suspense } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';
import { arabicFont } from '@/lib/fonts';

export default function VerifyEmailPage() {
  return (
    <div className={arabicFont.className}>
      <Suspense fallback={<LoadingScreen label="جاري التحميل..." />}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
