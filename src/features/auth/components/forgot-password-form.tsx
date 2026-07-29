'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { useForgotPassword } from '@/features/auth/hooks';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/schemas/auth.schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => {
    forgotPassword.mutate(values, {
      onSuccess: () => {
        router.push(
          `${ROUTES.auth.resetPassword}?email=${encodeURIComponent(values.email)}`,
        );
      },
    });
  });

  return (
    <AuthCardLayout
      title="نسيت كلمة المرور"
      description="أدخل بريدك الإلكتروني لإرسال رمز إعادة التعيين"
      footer={
        <Link href={ROUTES.auth.login} className="font-medium text-primary hover:underline">
          العودة لتسجيل الدخول
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField id="email" label="البريد الإلكتروني" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            'إرسال رمز التحقق'
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
