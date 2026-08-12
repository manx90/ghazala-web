'use client';

import { PermissionGuard } from '@/components/guards/permission-guard';
import { InboxLayout } from '@/features/inbox/components/inbox-layout';
import { useSearchParams } from 'next/navigation';

function InboxPageContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('c') ?? undefined;

  return <InboxLayout conversationId={conversationId} />;
}

export default function InboxPage() {
  return (
    <PermissionGuard permission="messages.read">
      <InboxPageContent />
    </PermissionGuard>
  );
}
