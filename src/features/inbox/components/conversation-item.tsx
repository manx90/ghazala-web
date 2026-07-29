'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/conversation.types';
import { formatPhoneDisplay } from '@/utils/phone';
import { formatRelativeTime } from '@/utils/date';

interface ConversationItemProps {
  conversation: Conversation;
  contactName?: string | null;
  contactPhoto?: string | null;
  isActive?: boolean;
  onSelect: (conversationId: string) => void;
}

function getInitials(name?: string | null, phone?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
  return phone?.slice(-2) ?? '؟';
}

export function ConversationItem({
  conversation,
  contactName,
  contactPhoto,
  isActive,
  onSelect,
}: ConversationItemProps) {
  const displayName = contactName?.trim() || formatPhoneDisplay(conversation.customerPhone);

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'flex w-full items-start gap-3 border-b px-4 py-3 text-right transition-colors hover:bg-muted/60',
        isActive && 'bg-muted',
      )}
    >
      <Avatar size="default">
        {contactPhoto ? <AvatarImage src={contactPhoto} alt={displayName} /> : null}
        <AvatarFallback>{getInitials(contactName, conversation.customerPhone)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{displayName}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">
            {formatPhoneDisplay(conversation.customerPhone)}
          </span>
          <StatusBadge status={conversation.status} className="text-[10px]" />
        </div>
      </div>
    </button>
  );
}
