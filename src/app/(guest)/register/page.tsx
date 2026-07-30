import { RegisterForm } from '@/features/auth/components/register-form';
import { arabicFont } from '@/lib/fonts';

export default function RegisterPage() {
  return (
    <div className={arabicFont.className}>
      <RegisterForm />
    </div>
  );
}
