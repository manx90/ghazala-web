'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { useResetPassword } from '@/features/auth/hooks';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/schemas/auth.schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();
  const emailFromQuery = searchParams.get('email') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: emailFromQuery, otp: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    resetPassword.mutate(values, {
      onSuccess: () => {
        router.replace(ROUTES.auth.login);
      },
    });
  });

  return (
    <AuthCardLayout
      title="إعادة تعيين كلمة المرور"
      description="أدخل رمز OTP وكلمة المرور الجديدة"
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

        <FormField id="otp" label="رمز OTP" error={errors.otp?.message}>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            aria-invalid={Boolean(errors.otp)}
            {...register('otp')}
          />
        </FormField>

        <FormField id="password" label="كلمة المرور الجديدة" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
          {resetPassword.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              جاري التحديث...
            </>
          ) : (
            'تحديث كلمة المرور'
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
