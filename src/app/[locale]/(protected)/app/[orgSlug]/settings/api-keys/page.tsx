'use client';

import { useTranslations } from 'next-intl';
import { KeyIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { PermissionGuard } from '@/components/guards/permission-guard';
import { ApiKeysManager } from '@/features/settings/components/api-keys-manager';

export default function ApiKeysSettingsPage() {
  const t = useTranslations('settings.pages.apiKeys');

  return (
    <PermissionGuard permission="org.manage">
      <div className="flex flex-col gap-6">
        <PageHeader title={t('title')} description={t('description')} />
        <Card className="stagger-in">
          <CardHeader className="flex flex-row items-start gap-3">
            <span className="bg-gradient-brand-soft flex size-10 shrink-0 items-center justify-center rounded-xl text-primary ring-1 ring-primary/10">
              <KeyIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>{t('cardTitle')}</CardTitle>
              <CardDescription>{t('cardDescription')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ApiKeysManager />
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
