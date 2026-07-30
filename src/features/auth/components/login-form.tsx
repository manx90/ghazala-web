'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
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
import { AuthCardLayout } from './auth-card-layout';
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
    <AuthCardLayout
      title="تسجيل الدخول"
      description="أدخل بيانات حسابك للمتابعة"
      footer={
        <>
          ليس لديك حساب؟{' '}
          <Link href={ROUTES.auth.register} className="font-medium text-primary hover:underline">
            إنشاء حساب
          </Link>
        </>
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

        <FormField id="password" label="كلمة المرور" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
        </FormField>

        <div className="flex justify-end">
          <Link
            href={ROUTES.auth.forgotPassword}
            className="text-sm text-primary hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
              جاري تسجيل الدخول...
            </>
          ) : (
            'تسجيل الدخول'
          )}
        </Button>
      </form>
    </AuthCardLayout>
  );
}
