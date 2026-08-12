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
import { useRegister } from '@/features/auth/hooks';
import { createRegisterSchema, type RegisterFormValues } from '@/features/auth/schemas/create-auth-schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function RegisterForm() {
  const t = useTranslations('auth');
  const tVal = useTranslations('validation');
  const router = useRouter();
  const registerMutation = useRegister();

  const schema = useMemo(() => createRegisterSchema((k) => tVal(k)), [tVal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    registerMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.user.emailVerified) {
          router.replace(ROUTES.onboarding.createOrganization);
          return;
        }
        router.replace(`${ROUTES.auth.verifyEmail}?email=${encodeURIComponent(values.email)}`);
      },
    });
  });

  return (
    <AuthCardLayout
      title={t('registerTitle')}
      description={t('registerSubtitle')}
      footer={
        <>
          {t('hasAccount')}{' '}
          <Link
            href={ROUTES.auth.login}
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline"
          >
            {t('login')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label={t('firstName')} error={errors.firstName?.message}>
            <Input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              className="h-11"
              {...register('firstName')}
            />
          </FormField>

          <FormField id="lastName" label={t('lastName')} error={errors.lastName?.message}>
            <Input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              className="h-11"
              {...register('lastName')}
            />
          </FormField>
        </div>

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

        <FormField id="password" label={t('password')} error={errors.password?.message}>
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              {t('creatingAccount')}
            </>
          ) : (
            t('registerTitle')
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
