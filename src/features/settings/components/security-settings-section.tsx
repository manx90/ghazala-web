'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
      <Card>
        <CardHeader>
          <CardTitle>تسجيل الخروج</CardTitle>
          <CardDescription>إنهاء الجلسة الحالية على هذا الجهاز</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => void handleLogout()} disabled={logout.isPending}>
            <LogOutIcon />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>استعادة كلمة المرور</CardTitle>
          <CardDescription>إذا نسيت كلمة المرور، يمكنك طلب إعادة تعيينها</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" render={<Link href={ROUTES.auth.forgotPassword} />}>
            <KeyRoundIcon />
            نسيت كلمة المرور
          </Button>
        </CardContent>
      </Card>

      <UnavailableFeatureAlert
        title="إدارة الجلسات غير متاحة"
        description="لا يمكن عرض أو إنهاء الجلسات النشطة حالياً."
        requiredEndpoints={['GET /auth/sessions', 'DELETE /auth/sessions/:id']}
      />

      <UnavailableFeatureAlert
        title="تغيير كلمة المرور غير متاح"
        description="لا يمكن تغيير كلمة المرور من الإعدادات حالياً."
        requiredEndpoints={['PATCH /auth/me/password']}
      />
    </div>
  );
}
