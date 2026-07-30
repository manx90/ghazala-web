'use client';

import { WebhookIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { PermissionGuard } from '@/components/guards/permission-guard';

export default function WebhooksSettingsPage() {
  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title="Webhooks" description="إدارة webhooks للأحداث" />
        <Card className="stagger-in">
          <CardHeader className="flex flex-row items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <WebhookIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>نقاط استقبال الأحداث</CardTitle>
              <CardDescription>استقبل إشعارات فورية عن الأحداث في أنظمتك</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <UnavailableFeatureAlert
              title="Webhooks غير متاح"
              description="لا يمكن إدارة webhooks حالياً لعدم توفر واجهات API."
              requiredEndpoints={[
                'GET /webhooks',
                'POST /webhooks',
                'PATCH /webhooks/:id',
                'DELETE /webhooks/:id',
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
