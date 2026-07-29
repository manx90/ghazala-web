'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { useSession } from '@/features/auth/hooks/use-session';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { SkeletonLoader } from '@/components/global/skeleton-loader';
import { formatDateTime } from '@/utils/date';

export function ProfileSettingsSection() {
  const { user, isSessionLoading } = useSession();

  if (isSessionLoading) {
    return <SkeletonLoader rows={4} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>الملف الشخصي</CardTitle>
          <CardDescription>معلومات حسابك (للقراءة فقط)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الاسم الأول</p>
            <p className="font-medium">{user.firstName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">اسم العائلة</p>
            <p className="font-medium">{user.lastName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
            <p>{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الحالة</p>
            <StatusBadge status={user.status} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">البريد موثّق</p>
            <p>{user.emailVerified ? 'نعم' : 'لا'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">آخر تسجيل دخول</p>
            <p>{formatDateTime(user.lastLoginAt)}</p>
          </div>
        </CardContent>
      </Card>

      <UnavailableFeatureAlert
        title="تحديث الملف الشخصي غير متاح"
        description="لا يمكن تعديل بيانات الملف الشخصي حالياً لعدم توفر واجهة API."
        requiredEndpoints={['PATCH /auth/me']}
      />
    </div>
  );
}
