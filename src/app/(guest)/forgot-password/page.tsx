import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';
import { arabicFont } from '@/lib/fonts';

export default function ForgotPasswordPage() {
  return (
    <div className={arabicFont.className}>
      <ForgotPasswordForm />
    </div>
  );
}
