'use client';

import { useTranslations } from 'next-intl';
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

function getInitials(name?: string | null, phone?: string, fallback = '?'): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
  return phone?.slice(-2) ?? fallback;
}

export function ConversationItem({
  conversation,
  contactName,
  contactPhoto,
  isActive,
  onSelect,
}: ConversationItemProps) {
  const t = useTranslations('inbox');
  const displayName = contactName?.trim() || formatPhoneDisplay(conversation.customerPhone);

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'group relative flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-right transition-colors duration-200',
        'hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none',
        isActive && 'bg-gradient-brand-soft',
      )}
    >
      {/* شريط مؤشر المحادثة النشطة */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-3 start-0 w-1 rounded-e-full bg-gradient-brand transition-opacity duration-200',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />

      <Avatar size="default" className="mt-0.5 size-10 shadow-2xs">
        {contactPhoto ? <AvatarImage src={contactPhoto} alt={displayName} /> : null}
        <AvatarFallback className="bg-gradient-brand text-xs font-semibold text-white">
          {getInitials(contactName, conversation.customerPhone, t('initialsFallback'))}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{displayName}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground" dir="ltr">
            {formatPhoneDisplay(conversation.customerPhone)}
          </span>
          <StatusBadge status={conversation.status} className="text-[10px]" />
        </div>
      </div>
    </button>
  );
}
