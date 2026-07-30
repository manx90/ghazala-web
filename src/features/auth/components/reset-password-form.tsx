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
        <Link
          href={ROUTES.auth.login}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline"
        >
          العودة لتسجيل الدخول
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField id="email" label="البريد الإلكتروني" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="name@company.com"
            aria-invalid={Boolean(errors.email)}
            className="h-11"
            {...register('email')}
          />
        </FormField>

        <FormField id="otp" label="رمز OTP" error={errors.otp?.message}>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            dir="ltr"
            aria-invalid={Boolean(errors.otp)}
            className="h-11 text-center font-mono tracking-[0.5em]"
            {...register('otp')}
          />
        </FormField>

        <FormField id="password" label="كلمة المرور الجديدة" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            className="h-11"
            {...register('password')}
          />
        </FormField>

        <Button
          type="submit"
          variant="gradient"
          className="h-11 w-full text-sm font-semibold"
          disabled={resetPassword.isPending}
        >
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
