'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { useRegister } from '@/features/auth/hooks';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schemas';
import { AuthCardLayout } from './auth-card-layout';
import { FormField } from './form-field';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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
      title="إنشاء حساب"
      description="ابدأ بإنشاء حسابك في غزالة"
      footer={
        <>
          لديك حساب بالفعل؟{' '}
          <Link href={ROUTES.auth.login} className="font-medium text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label="الاسم الأول" error={errors.firstName?.message}>
            <Input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              {...register('firstName')}
            />
          </FormField>

          <FormField id="lastName" label="اسم العائلة" error={errors.lastName?.message}>
            <Input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              {...register('lastName')}
            />
          </FormField>
        </div>

        <FormField id="email" label="البريد الإلكتروني" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label="كلمة المرور" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              جاري إنشاء الحساب...
            </>
          ) : (
            'إنشاء حساب'
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
