import { WebhookIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';
import { PermissionGuard } from '@/components/guards/permission-guard';

export default async function WebhooksSettingsPage() {
  const t = await getTranslations('settings.pages.webhooks');

  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title={t('title')} description={t('description')} />
        <Card className="stagger-in">
          <CardHeader className="flex flex-row items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <WebhookIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('cardTitle')}</CardTitle>
              <CardDescription>{t('cardDescription')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <UnavailableFeatureAlert
              title={t('unavailableTitle')}
              description={t('unavailableDescription')}
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
