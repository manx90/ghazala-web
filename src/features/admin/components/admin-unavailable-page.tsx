import { PageContainer } from '@/components/global/page-container';
import { PageHeader } from '@/components/shared/page-header';
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
  return (
    <PageContainer size="md">
      <div className="flex flex-col gap-6">
        <PageHeader title={title} description={description} />
        <UnavailableFeatureAlert
          title="واجهة برمجة غير متوفرة"
          description="هذه الميزة تتطلب endpoints في الـ backend قبل تفعيلها."
          requiredEndpoints={requiredEndpoints}
        />
      </div>
    </PageContainer>
  );
}
