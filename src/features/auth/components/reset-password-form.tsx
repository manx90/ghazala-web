'use client';

import { useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { useResetPassword } from '@/features/auth/hooks';
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/create-auth-schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function ResetPasswordForm() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();
  const emailFromQuery = searchParams.get('email') ?? '';

  const schema = useMemo(() => createResetPasswordSchema((k) => tVal(k)), [tVal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
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
      title={t('resetPasswordTitle')}
      description={t('resetPasswordSubtitle')}
      footer={
        <Link
          href={ROUTES.auth.login}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline"
        >
          {t('backToLogin')}
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField id="email" label={t('email')} error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder={t('emailPlaceholder')}
            aria-invalid={Boolean(errors.email)}
            className="h-11"
            {...register('email')}
          />
        </FormField>

        <FormField id="otp" label={t('otp')} error={errors.otp?.message}>
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

        <FormField id="password" label={t('newPassword')} error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            placeholder={t('passwordPlaceholder')}
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
              {t('updating')}
            </>
          ) : (
            t('updatePassword')
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
