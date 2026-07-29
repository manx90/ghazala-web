import { Suspense } from 'react';
import { LoadingScreen } from '@/components/global/loading-screen';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen label="جاري التحميل..." />}>
      <LoginForm />
    </Suspense>
  );
}
