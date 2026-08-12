import { FormSkeleton } from '@/components/feedback/skeletons';
import { PageContainer } from '@/components/global/page-container';

export default function GuestLoading() {
  return (
    <PageContainer size="sm">
      <FormSkeleton fields={3} />
    </PageContainer>
  );
}
