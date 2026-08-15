'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import type { CSSProperties } from 'react';
import {
  KeyRoundIcon,
  Loader2Icon,
  LogOutIcon,
  MonitorSmartphoneIcon,
  TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonLoader } from '@/components/global/skeleton-loader';
import { ROUTES } from '@/config/routes';
import { useChangePassword, useLogout } from '@/features/auth/hooks/use-auth';
import { useRevokeSession, useUserSessions } from '@/features/settings/hooks/use-settings-features';
import { formatDateTime } from '@/utils/date';

export function SecuritySettingsSection() {
  const t = useTranslations('settings.security');
  const router = useRouter();
  const logout = useLogout();
  const changePassword = useChangePassword();
  const sessions = useUserSessions();
  const revokeSession = useRevokeSession();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace(ROUTES.auth.login);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error(t('changePassword.required'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('changePassword.mismatch'));
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        // الخادم يلغي كل رموز الجلسة — إعادة تسجيل الدخول إجبارية
        onSuccess: () => {
          toast.success(t('changePassword.success'));
          void handleLogout();
        },
      },
    );
  };

  const handleRevoke = (sessionId: string) => {
    revokeSession.mutate(sessionId, {
      onSuccess: () => toast.success(t('sessions.revoked')),
      onError: () => toast.error(t('sessions.revokeError')),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="stagger-in border-destructive/30 bg-destructive/5">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <LogOutIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('logout.title')}</CardTitle>
              <CardDescription>{t('logout.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => void handleLogout()} disabled={logout.isPending}>
            <LogOutIcon />
            {t('logout.title')}
          </Button>
        </CardContent>
      </Card>

      <Card className="stagger-in" style={{ '--stagger-delay': '80ms' } as CSSProperties}>
        <CardHeader className="flex flex-row items-start gap-3">
          <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
            <KeyRoundIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{t('passwordReset.title')}</CardTitle>
            <CardDescription>{t('passwordReset.description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" render={<Link href={ROUTES.auth.forgotPassword} />}>
            <KeyRoundIcon />
            {t('passwordReset.button')}
          </Button>
        </CardContent>
      </Card>

      <Card className="stagger-in" style={{ '--stagger-delay': '160ms' } as CSSProperties}>
        <CardHeader className="flex flex-row items-start gap-3">
          <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
            <KeyRoundIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{t('changePassword.title')}</CardTitle>
            <CardDescription>{t('changePassword.description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">{t('changePassword.current')}</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={changePassword.isPending}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">{t('changePassword.new')}</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={changePassword.isPending}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">{t('changePassword.confirm')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={changePassword.isPending}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={changePassword.isPending}>
              {changePassword.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                t('changePassword.submit')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="stagger-in" style={{ '--stagger-delay': '240ms' } as CSSProperties}>
        <CardHeader className="flex flex-row items-start gap-3">
          <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
            <MonitorSmartphoneIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>{t('sessions.title')}</CardTitle>
            <CardDescription>{t('sessions.description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {sessions.isLoading ? (
            <SkeletonLoader rows={2} />
          ) : (sessions.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">{t('sessions.empty')}</p>
          ) : (
            sessions.data?.map((session) => (
              <div
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium" dir="ltr">
                      {session.userAgent ?? '—'}
                    </p>
                    {session.isCurrent ? (
                      <Badge variant="secondary">{t('sessions.currentSession')}</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span dir="ltr">{session.ipAddress ?? '—'}</span>
                    {' · '}
                    {formatDateTime(session.createdAt)}
                  </p>
                </div>
                {!session.isCurrent ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(session.id)}
                    disabled={revokeSession.isPending}
                  >
                    <TrashIcon />
                    {t('sessions.revoke')}
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
