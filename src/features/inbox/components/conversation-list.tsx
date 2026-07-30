'use client';

import { SearchIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { QueryState } from '@/components/shared/query-state';
import { PhoneNumberSelect } from '@/components/shared/phone-number-select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConversationItem } from '@/features/inbox/components/conversation-item';
import type { InboxFilters, InboxStatusFilter } from '@/features/inbox/hooks/use-inbox';
import { ConversationStatus, type Conversation } from '@/types/conversation.types';
import type { Contact } from '@/types/contact.types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  filters: InboxFilters;
  contactsByPhone: Record<string, Contact>;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onSelect: (conversationId: string) => void;
  onFiltersChange: (patch: Partial<InboxFilters>) => void;
  onRetry?: () => void;
}

const STATUS_TABS: { value: InboxStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'الكل' },
  { value: ConversationStatus.OPEN, label: 'مفتوحة' },
  { value: ConversationStatus.CLOSED, label: 'مغلقة' },
  { value: ConversationStatus.EXPIRED, label: 'منتهية' },
];

export function ConversationList({
  conversations,
  selectedId,
  filters,
  contactsByPhone,
  isLoading,
  isError,
  error,
  onSelect,
  onFiltersChange,
  onRetry,
}: ConversationListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col border-e border-border/60 bg-card">
      <div className="flex h-14 shrink-0 items-center border-b border-border/60 px-4">
        <h2 className="text-sm font-semibold">الرسائل الواردة</h2>
      </div>

      <div className="space-y-2.5 border-b border-border/60 p-3">
        <Tabs
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value as InboxStatusFilter })}
        >
          <TabsList className="w-full">
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            value={filters.customerPhone ?? ''}
            onChange={(event) => onFiltersChange({ customerPhone: event.target.value })}
            placeholder="بحث برقم العميل..."
            className="rounded-xl bg-muted/50 pr-9 shadow-none"
            dir="ltr"
          />
        </div>

        <PhoneNumberSelect
          value={filters.phoneNumberId}
          onChange={(phoneNumberId) => onFiltersChange({ phoneNumberId })}
          className="w-full"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!conversations.length}
          emptyTitle="لا توجد محادثات"
          emptyDescription="ستظهر المحادثات هنا عند استلام رسائل جديدة"
          onRetry={onRetry}
          skeletonRows={8}
        >
          {conversations.map((conversation, index) => {
            const contact = contactsByPhone[conversation.customerPhone];
            return (
              <div
                key={conversation.id}
                className="stagger-in"
                style={{ '--stagger-delay': `${Math.min(index * 40, 400)}ms` } as CSSProperties}
              >
                <ConversationItem
                  conversation={conversation}
                  contactName={contact?.fullName ?? contact?.profileName}
                  contactPhoto={contact?.profilePhotoUrl}
                  isActive={conversation.id === selectedId}
                  onSelect={onSelect}
                />
              </div>
            );
          })}
        </QueryState>
      </div>
    </div>
  );
}
