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
import { useResendVerification, useVerifyEmail } from '@/features/auth/hooks';
import {
  createVerifyEmailSchema,
  type VerifyEmailFormValues,
} from '@/features/auth/schemas/create-auth-schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function VerifyEmailForm() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const emailFromQuery = searchParams.get('email') ?? '';

  const schema = useMemo(() => createVerifyEmailSchema((k) => tVal(k)), [tVal]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromQuery, otp: '' },
  });

  const onSubmit = handleSubmit((values) => {
    verifyEmail.mutate(values, {
      onSuccess: () => {
        router.replace(ROUTES.onboarding.createOrganization);
      },
    });
  });

  const handleResend = () => {
    const email = getValues('email');
    if (!email) return;
    resendVerification.mutate({ email });
  };

  return (
    <AuthCardLayout
      title={t('verifyEmailTitle')}
      description={t('verifyEmailSubtitle')}
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

        <FormField id="otp" label={t('verificationCode')} error={errors.otp?.message}>
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

        <Button
          type="submit"
          variant="gradient"
          className="h-11 w-full text-sm font-semibold"
          disabled={verifyEmail.isPending}
        >
          {verifyEmail.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {t('verifying')}
            </>
          ) : (
            t('confirmEmail')
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full"
          disabled={resendVerification.isPending}
          onClick={handleResend}
        >
          {resendVerification.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {t('resending')}
            </>
          ) : (
            t('resendCode')
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
