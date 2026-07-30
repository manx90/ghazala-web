import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoadingScreen } from '@/components/global/loading-screen';
import { LoginForm } from '@/features/auth/components/login-form';
import { LoginShell } from '@/features/auth/components/login-shell';
import { arabicFont } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
};

export default function LoginPage() {
  return (
    <div className={arabicFont.className}>
      <LoginShell>
        <Suspense fallback={<LoadingScreen label="جاري التحميل..." />}>
          <LoginForm />
        </Suspense>
      </LoginShell>
    </div>
  );
}
