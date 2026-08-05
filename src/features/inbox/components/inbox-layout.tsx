'use client';

import { useQueries } from '@tanstack/react-query';
import {
  ArrowRightIcon,
  Loader2Icon,
  LockIcon,
  LockOpenIcon,
  MessagesSquareIcon,
  PanelRightIcon,
  SearchXIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/global/empty-state';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StatusBadge } from '@/components/shared/status-badge';
import { ROUTES } from '@/config/routes';
import { queryKeys } from '@/config/query-keys';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { ConversationList } from '@/features/inbox/components/conversation-list';
import { CustomerPanel } from '@/features/inbox/components/customer-panel';
import { MessageComposer } from '@/features/inbox/components/message-composer';
import { MessageThread } from '@/features/inbox/components/message-thread';
import { SendTemplateComposeDialog } from '@/features/inbox/components/send-template-compose-dialog';
import { useInbox } from '@/features/inbox/hooks/use-inbox';
import { contactsApi } from '@/features/contacts/api/contacts.api';
import { ConversationStatus } from '@/types/conversation.types';
import { formatPhoneDisplay } from '@/utils/phone';
import { cn } from '@/lib/utils';

interface InboxLayoutProps {
  conversationId?: string;
}

function getInitials(name?: string | null, phone?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  }
  return phone?.slice(-2) ?? '؟';
}

export function InboxLayout({ conversationId }: InboxLayoutProps) {
  const router = useRouter();
  const params = useParams<{ orgSlug: string }>();
  const orgSlug = params.orgSlug;
  const { canSendMessages } = usePermissions();
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const {
    filters,
    updateFilters,
    conversations,
    conversationsQuery,
    conversation,
    conversationQuery,
    messages,
    messagesQuery,
    closeConversation,
    reopenConversation,
    isClosing,
    isReopening,
    loadOlderMessages,
    hasOlderMessages,
    isLoadingOlderMessages,
  } = useInbox(conversationId);

  const uniquePhones = useMemo(
    () => [...new Set(conversations.map((item) => item.customerPhone))],
    [conversations],
  );

  const contactQueries = useQueries({
    queries: uniquePhones.map((phone) => ({
      queryKey: [...queryKeys.contacts.list({ search: phone }), phone],
      queryFn: () => contactsApi.list({ search: phone, limit: 1 }),
      enabled: Boolean(phone),
      staleTime: 60_000,
    })),
  });

  const contactsByPhone = useMemo(() => {
    const map: Record<string, NonNullable<(typeof contactQueries)[number]['data']>['items'][number]> = {};
    uniquePhones.forEach((phone, index) => {
      const item = contactQueries[index]?.data?.items[0];
      if (item) map[phone] = item;
    });
    return map;
  }, [contactQueries, uniquePhones]);

  const handleSelectConversation = (id: string) => {
    router.push(ROUTES.app.inboxConversation(orgSlug, id));
  };

  const handleBackToList = () => {
    router.push(ROUTES.app.inbox(orgSlug));
  };

  const activeContact = conversation
    ? contactsByPhone[conversation.customerPhone]
    : undefined;

  const displayTitle =
    activeContact?.fullName?.trim() ||
    activeContact?.profileName?.trim() ||
    (conversation ? formatPhoneDisplay(conversation.customerPhone) : '');

  const toggleConversationStatus = () => {
    if (!conversation) return;
    if (conversation.status === ConversationStatus.OPEN) {
      closeConversation(conversation.id);
      return;
    }
    reopenConversation(conversation.id);
  };

  const handleTemplateSent = (id: string) => {
    router.push(ROUTES.app.inboxConversation(orgSlug, id));
  };

  const showMobileThread = Boolean(conversationId);

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] min-h-0 overflow-hidden bg-background">
      <div
        className={cn(
          'w-full shrink-0 md:w-80 lg:w-96',
          showMobileThread ? 'hidden md:flex md:flex-col' : 'flex flex-col',
        )}
      >
        <ConversationList
          conversations={conversations}
          selectedId={conversationId}
          filters={filters}
          contactsByPhone={contactsByPhone}
          isLoading={conversationsQuery.isLoading}
          isError={conversationsQuery.isError}
          error={conversationsQuery.error}
          onSelect={handleSelectConversation}
          onFiltersChange={updateFilters}
          onRetry={() => void conversationsQuery.refetch()}
          onNewTemplate={() => setComposeOpen(true)}
          canCompose={canSendMessages}
        />
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          !showMobileThread && 'hidden md:flex',
        )}
      >
        {!conversationId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/30 p-6">
            <EmptyState
              icon={<MessagesSquareIcon />}
              title="اختر محادثة"
              description="اختر محادثة من القائمة أو أرسل قالباً لبدء محادثة جديدة"
            />
            {canSendMessages ? (
              <Button variant="gradient" onClick={() => setComposeOpen(true)}>
                <MessagesSquareIcon data-icon="inline-start" />
                إرسال قالب لرقم
              </Button>
            ) : null}
          </div>
        ) : conversationQuery.isLoading ? (
          <div className="flex flex-1 items-center justify-center bg-muted/30">
            <Loader2Icon className="size-6 animate-spin text-primary" />
          </div>
        ) : conversation ? (
          <>
            <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border/60 bg-card px-3">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                onClick={handleBackToList}
                aria-label="العودة للقائمة"
              >
                <ArrowRightIcon />
              </Button>

              <Avatar size="default" className="size-9 shadow-2xs">
                {activeContact?.profilePhotoUrl ? (
                  <AvatarImage src={activeContact.profilePhotoUrl} alt={displayTitle} />
                ) : null}
                <AvatarFallback className="bg-gradient-brand text-[11px] font-semibold text-white">
                  {getInitials(displayTitle, conversation.customerPhone)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{displayTitle}</p>
                <p className="truncate text-[11px] text-muted-foreground" dir="ltr">
                  {formatPhoneDisplay(conversation.customerPhone)}
                </p>
              </div>

              <StatusBadge status={conversation.status} />

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isClosing || isReopening}
                onClick={toggleConversationStatus}
              >
                {conversation.status === ConversationStatus.OPEN ? (
                  <>
                    <LockIcon />
                    إغلاق
                  </>
                ) : (
                  <>
                    <LockOpenIcon />
                    إعادة فتح
                  </>
                )}
              </Button>

              <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="xl:hidden"
                      aria-label="بيانات العميل"
                    >
                      <UserIcon />
                    </Button>
                  }
                />
                <SheetContent side="left" className="w-full sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>بيانات العميل</SheetTitle>
                  </SheetHeader>
                  <CustomerPanel conversation={conversation} />
                </SheetContent>
              </Sheet>
            </div>

            <MessageThread
              messages={messages}
              isLoading={messagesQuery.isLoading}
              isFetching={messagesQuery.isFetching}
              hasOlderMessages={hasOlderMessages ?? false}
              isLoadingOlder={isLoadingOlderMessages}
              onLoadOlder={() => void loadOlderMessages()}
            />

            <MessageComposer conversation={conversation} disabled={!canSendMessages} />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-muted/30 p-6 text-center">
            <EmptyState
              icon={<SearchXIcon />}
              title="المحادثة غير موجودة"
              description="تعذّر العثور على هذه المحادثة"
              action={
                <Button render={<Link href={ROUTES.app.inbox(orgSlug)} />} variant="outline">
                  العودة لصندوق الوارد
                </Button>
              }
            />
          </div>
        )}
      </div>

      <aside className="hidden w-72 shrink-0 border-s border-border/60 xl:block 2xl:w-80">
        <CustomerPanel conversation={conversation} />
      </aside>

      {!conversationId && (
        <div className="hidden flex-1 items-center justify-center border-s border-border/60 bg-muted/30 md:flex xl:hidden">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary">
              <PanelRightIcon className="size-5" />
            </div>
            <p className="text-sm">اختر محادثة من القائمة</p>
          </div>
        </div>
      )}

      <SendTemplateComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onSent={handleTemplateSent}
      />
    </div>
  );
}
