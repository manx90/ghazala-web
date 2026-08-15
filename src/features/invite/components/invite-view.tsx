'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2Icon, MailXIcon, UserPlusIcon } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingScreen } from '@/components/global/loading-screen';
import { ROUTES } from '@/config/routes';
import { organizationApi } from '@/features/auth/api/organization.api';
import { useAcceptInvite, useInviteInfo } from '@/features/invite/hooks/use-invite';
import { useAuthStore } from '@/store/auth.store';
import { useOrganizationStore } from '@/store/organization.store';
import { ApiError } from '@/types/api.types';
import { getErrorMessage } from '@/utils/error';

interface InviteViewProps {
  token: string;
}

export function InviteView({ token }: InviteViewProps) {
  const t = useTranslations('invite');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionLoading = useAuthStore((state) => state.isSessionLoading);
  const setOrganizations = useOrganizationStore((state) => state.setOrganizations);
  const setCurrentOrganization = useOrganizationStore((state) => state.setCurrentOrganization);

  const invite = useInviteInfo(token);
  const acceptInvite = useAcceptInvite();
  const acceptStarted = useRef(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const sessionReady = isHydrated && !isSessionLoading;

  useEffect(() => {
    if (!sessionReady || !isAuthenticated || !invite.data?.isValid || acceptStarted.current) {
      return;
    }

    acceptStarted.current = true;

    const run = async () => {
      try {
        const result = await acceptInvite.mutateAsync({ token });
        const orgList = await organizationApi.list();
        setOrganizations(orgList.items);
        const org = orgList.items.find((item) => item.slug === result.organizationSlug);
        if (org) {
          organizationApi.selectOrganization(org);
          setCurrentOrganization(org);
        }
        router.replace(ROUTES.app.dashboard(result.organizationSlug));
      } catch (error) {
        // دعوة مقبولة مسبقاً — نوجه المستخدم لمنظمته مباشرة
        if (error instanceof ApiError && error.statusCode === 409 && invite.data) {
          router.replace(ROUTES.app.dashboard(invite.data.organizationSlug));
          return;
        }
        acceptStarted.current = false;
        setAcceptError(getErrorMessage(error, t('acceptFailed')));
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionReady, isAuthenticated, invite.data?.isValid]);

  if (!sessionReady || invite.isLoading) {
    return <LoadingScreen label={tCommon('loading')} />;
  }

  if (invite.isError || !invite.data) {
    return (
      <InviteCard
        title={t('invalidTitle')}
        description={t('invalidDescription')}
        icon={<MailXIcon className="size-6 text-destructive" aria-hidden="true" />}
      >
        <Button variant="gradient" className="w-full" render={<Link href={ROUTES.home} />}>
          {t('backHome')}
        </Button>
      </InviteCard>
    );
  }

  if (!invite.data.isValid) {
    return (
      <InviteCard
        title={t('expiredTitle')}
        description={t('expiredDescription', { org: invite.data.organizationName })}
        icon={<MailXIcon className="size-6 text-destructive" aria-hidden="true" />}
      >
        <Button variant="gradient" className="w-full" render={<Link href={ROUTES.home} />}>
          {t('backHome')}
        </Button>
      </InviteCard>
    );
  }

  if (isAuthenticated) {
    return (
      <InviteCard
        title={t('acceptingTitle')}
        description={t('acceptingDescription', { org: invite.data.organizationName })}
        icon={<Loader2Icon className="size-6 animate-spin text-primary" aria-hidden="true" />}
      >
        {acceptError && (
          <>
            <p className="text-sm text-destructive" role="alert">
              {acceptError}
            </p>
            <Button variant="gradient" className="w-full" render={<Link href={ROUTES.app.root} />}>
              {t('goToApp')}
            </Button>
          </>
        )}
      </InviteCard>
    );
  }

  return (
    <InviteCard
      title={t('invitedTitle')}
      description={t('invitedDescription', {
        org: invite.data.organizationName,
        role: t(`roles.${invite.data.role.toLowerCase()}`),
      })}
      icon={<UserPlusIcon className="size-6 text-primary" aria-hidden="true" />}
    >
      <p className="text-center text-sm text-muted-foreground" dir="ltr">
        {invite.data.email}
      </p>
      <Button
        variant="gradient"
        className="w-full"
        render={
          <Link
            href={`${ROUTES.auth.register}?invite=${encodeURIComponent(token)}&email=${encodeURIComponent(invite.data.email)}`}
          />
        }
      >
        {t('createAccount')}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        render={<Link href={`${ROUTES.auth.login}?invite=${encodeURIComponent(token)}`} />}
      >
        {t('haveAccount')}
      </Button>
    </InviteCard>
  );
}

interface InviteCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function InviteCard({ title, description, icon, children }: InviteCardProps) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-muted/40 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-gradient-brand-soft ring-1 ring-primary/10">
            {icon}
          </span>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">{children}</CardContent>
      </Card>
    </main>
  );
}
