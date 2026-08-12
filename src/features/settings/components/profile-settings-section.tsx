'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Loader2Icon, MailCheckIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/config/routes';
import { useResendVerification } from '@/features/auth/hooks';
import { useSession } from '@/features/auth/hooks/use-session';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { SkeletonLoader } from '@/components/global/skeleton-loader';
import { formatDateTime } from '@/utils/date';

export function ProfileSettingsSection() {
  const t = useTranslations('settings.profile');
  const tCommon = useTranslations('common');
  const { user, isSessionLoading } = useSession();
  const resendVerification = useResendVerification();

  if (isSessionLoading) {
    return <SkeletonLoader rows={4} />;
  }

  if (!user) {
    return null;
  }

  const handleResend = () => {
    resendVerification.mutate({ email: user.email });
  };

  return (
    <div className="flex flex-col gap-6">
      {!user.emailVerified ? (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="flex flex-row items-start gap-3 pb-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
              <MailCheckIcon className="size-5" />
            </span>
            <div className="flex-1">
              <CardTitle className="text-base">{t('verifyEmail.title')}</CardTitle>
              <CardDescription>{t('verifyEmail.description')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="gradient"
              render={
                <Link
                  href={`${ROUTES.auth.verifyEmail}?email=${encodeURIComponent(user.email)}`}
                />
              }
            >
              {t('verifyEmail.enterCode')}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={resendVerification.isPending}
              onClick={handleResend}
            >
              {resendVerification.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                t('verifyEmail.resendCode')
              )}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="stagger-in">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar size="lg" className="size-14 text-lg">
            <AvatarFallback>
              {user.firstName?.[0] ?? ''}
              {user.lastName?.[0] ?? ''}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('fields.firstName')}</p>
            <p className="font-medium">{user.firstName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('fields.lastName')}</p>
            <p className="font-medium">{user.lastName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('fields.email')}</p>
            <p dir="ltr">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('fields.status')}</p>
            <StatusBadge status={user.status} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('fields.emailVerified')}</p>
            <p>{user.emailVerified ? tCommon('yes') : tCommon('no')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{t('fields.lastLogin')}</p>
            <p>{formatDateTime(user.lastLoginAt)}</p>
          </div>
        </CardContent>
      </Card>

      <UnavailableFeatureAlert
        title={t('unavailable.title')}
        description={t('unavailable.description')}
        requiredEndpoints={['PATCH /auth/me']}
      />
    </div>
  );
}
