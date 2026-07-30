'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';
import { KeyRoundIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { ROUTES } from '@/config/routes';
import { useLogout } from '@/features/auth/hooks/use-auth';

export function SecuritySettingsSection() {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace(ROUTES.auth.login);
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
              <CardTitle>تسجيل الخروج</CardTitle>
              <CardDescription>إنهاء الجلسة الحالية على هذا الجهاز</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => void handleLogout()} disabled={logout.isPending}>
            <LogOutIcon />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>

      <Card className="stagger-in" style={{ '--stagger-delay': '80ms' } as CSSProperties}>
        <CardHeader className="flex flex-row items-start gap-3">
          <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
            <KeyRoundIcon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>استعادة كلمة المرور</CardTitle>
            <CardDescription>إذا نسيت كلمة المرور، يمكنك طلب إعادة تعيينها</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" render={<Link href={ROUTES.auth.forgotPassword} />}>
            <KeyRoundIcon />
            نسيت كلمة المرور
          </Button>
        </CardContent>
      </Card>

      <div className="stagger-in" style={{ '--stagger-delay': '160ms' } as CSSProperties}>
        <UnavailableFeatureAlert
          title="إدارة الجلسات غير متاحة"
          description="لا يمكن عرض أو إنهاء الجلسات النشطة حالياً."
          requiredEndpoints={['GET /auth/sessions', 'DELETE /auth/sessions/:id']}
        />
      </div>

      <div className="stagger-in" style={{ '--stagger-delay': '240ms' } as CSSProperties}>
        <UnavailableFeatureAlert
          title="تغيير كلمة المرور غير متاح"
          description="لا يمكن تغيير كلمة المرور من الإعدادات حالياً."
          requiredEndpoints={['PATCH /auth/me/password']}
        />
      </div>
    </div>
  );
}
