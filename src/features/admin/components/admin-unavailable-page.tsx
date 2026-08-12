'use client';

import { useTranslations } from 'next-intl';
import { ConstructionIcon } from 'lucide-react';
import { PageContainer } from '@/components/global/page-container';
import { UnavailableFeatureAlert } from '@/components/shared/unavailable-feature-alert';

interface AdminUnavailablePageProps {
  title: string;
  description: string;
  requiredEndpoints: string[];
}

export function AdminUnavailablePage({
  title,
  description,
  requiredEndpoints,
}: AdminUnavailablePageProps) {
  const t = useTranslations('admin.unavailable');

  return (
    <PageContainer size="md">
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <div className="animate-float flex size-14 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary ring-1 ring-primary/10">
          <ConstructionIcon className="size-6" aria-hidden="true" />
        </div>
        <div className="flex max-w-lg flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div className="w-full text-start">
          <UnavailableFeatureAlert
            title={t('apiTitle')}
            description={t('apiDescription')}
            requiredEndpoints={requiredEndpoints}
          />
        </div>
      </div>
    </PageContainer>
  );
}
