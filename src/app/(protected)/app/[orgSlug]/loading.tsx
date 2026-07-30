import { PageSkeleton } from '@/components/feedback/skeletons';
import { PageContainer } from '@/components/global/page-container';

export default function AppLoading() {
  return (
    <PageContainer>
      <PageSkeleton />
    </PageContainer>
  );
}
