'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { organizationApi } from '@/features/auth/api/organization.api';
import { fetchOnboardingState } from '@/features/onboarding/services/onboarding.service';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schemas';
import { useOrganizationStore } from '@/store/organization.store';
import { UserRole } from '@/types/auth.types';
import { resolveOnboardingPath } from '@/utils/onboarding';
import { getPostLoginRedirect, sanitizeRedirectPath } from '@/utils/route';
import { organizationStorage } from '@/utils/storage';
import { FormField } from './form-field';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization);
  const setOrganizations = useOrganizationStore((state) => state.setOrganizations);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: async (response) => {
        const returnUrl = searchParams.get('returnUrl');

        if (!response.user.emailVerified) {
          router.replace(
            `${ROUTES.auth.verifyEmail}?email=${encodeURIComponent(response.user.email)}`,
          );
          return;
        }

        let orgSlug: string | null = null;

        if (response.user.role === UserRole.USER) {
          const orgList = await organizationApi.list();
          setOrganizations(orgList.items);
          const storedOrgId = organizationStorage.getId();
          const matchedOrg =
            orgList.items.find((org) => org.id === storedOrgId) ?? orgList.items[0] ?? null;
          if (matchedOrg) {
            organizationApi.selectOrganization(matchedOrg);
            setCurrentOrganization(matchedOrg);
            orgSlug = matchedOrg.slug;
          }
        }

        let fallback = getPostLoginRedirect(response.user.role, orgSlug);
        if (response.user.role === UserRole.USER && orgSlug) {
          const state = await fetchOnboardingState(orgSlug);
          fallback = resolveOnboardingPath(state);
        }

        router.replace(sanitizeRedirectPath(returnUrl, fallback));
      },
    });
  });

  return (
    <div>
      <Link
        href={ROUTES.home}
        className="mb-8 flex items-center justify-center gap-3 lg:hidden"
        aria-label="غزالة - الصفحة الرئيسية"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-md glow-brand">
          <MessageCircleIcon className="size-6" aria-hidden />
        </span>
        <span className="text-xl font-bold tracking-tight">غزالة</span>
      </Link>

      <div className="glass-strong rounded-2xl p-7 shadow-xl sm:p-9">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight">مرحباً بعودتك</h1>
          <p className="mt-2 text-sm text-muted-foreground">أدخل بيانات حسابك للمتابعة إلى لوحة التحكم</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <FormField id="email" label="البريد الإلكتروني" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              placeholder="name@company.com"
              aria-invalid={Boolean(errors.email)}
              className="h-11 transition-shadow focus-visible:shadow-md"
              {...register('email')}
            />
          </FormField>

          <FormField id="password" label="كلمة المرور" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              dir="ltr"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              className="h-11 transition-shadow focus-visible:shadow-md"
              {...register('password')}
            />
          </FormField>

          <div className="flex justify-end">
            <Link
              href={ROUTES.auth.forgotPassword}
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="h-11 w-full text-sm font-semibold"
            disabled={login.isPending}
          >
            {login.isPending ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{' '}
        <Link
          href={ROUTES.auth.register}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline"
        >
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
