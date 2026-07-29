'use client';

import { PermissionGuard } from '@/components/guards/permission-guard';
import { InboxLayout } from '@/features/inbox/components/inbox-layout';
import { useParams } from 'next/navigation';

function InboxConversationPageContent() {
  const params = useParams<{ conversationId: string }>();
  return <InboxLayout conversationId={params.conversationId} />;
}

export default function InboxConversationPage() {
  return (
    <PermissionGuard permission="messages.read">
      <InboxConversationPageContent />
    </PermissionGuard>
  );
}
