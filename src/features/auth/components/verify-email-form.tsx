'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { useResendVerification, useVerifyEmail } from '@/features/auth/hooks';
import { verifyEmailSchema, type VerifyEmailFormValues } from '@/features/auth/schemas/auth.schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const emailFromQuery = searchParams.get('email') ?? '';

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
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
      title="تأكيد البريد الإلكتروني"
      description="أدخل رمز التحقق المرسل إلى بريدك"
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

        <FormField id="otp" label="رمز التحقق" error={errors.otp?.message}>
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
              جاري التحقق...
            </>
          ) : (
            'تأكيد البريد'
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
              جاري إعادة الإرسال...
            </>
          ) : (
            'إعادة إرسال الرمز'
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
