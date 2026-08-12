'use client';

import { useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { useForgotPassword } from '@/features/auth/hooks';
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/create-auth-schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const schema = useMemo(() => createForgotPasswordSchema((k) => tVal(k)), [tVal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
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
      title={t('forgotPasswordTitle')}
      description={t('forgotPasswordSubtitle')}
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

        <Button
          type="submit"
          variant="gradient"
          className="h-11 w-full text-sm font-semibold"
          disabled={forgotPassword.isPending}
        >
          {forgotPassword.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {t('sending')}
            </>
          ) : (
            t('sendOtp')
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
