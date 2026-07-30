'use client';

import { KeyIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { PermissionGuard } from '@/components/guards/permission-guard';

export default function ApiKeysSettingsPage() {
  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="مفاتيح API" description="إنشاء وإدارة مفاتيح الوصول" />
        <Card className="stagger-in">
          <CardHeader className="flex flex-row items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <KeyIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>مفاتيح الوصول</CardTitle>
              <CardDescription>أنشئ مفاتيح API لربط أنظمتك الخارجية بالمنصة</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <UnavailableFeatureAlert
              title="مفاتيح API غير متاحة"
              description="لا يمكن إدارة مفاتيح API حالياً لعدم توفر واجهات API."
              requiredEndpoints={[
                'GET /api-keys',
                'POST /api-keys',
                'DELETE /api-keys/:id',
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
