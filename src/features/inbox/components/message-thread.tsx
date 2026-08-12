'use client';

import { Fragment, useCallback, useEffect, useRef } from 'react';
import { Loader2Icon, MessageSquareTextIcon } from 'lucide-react';
import { format, isSameDay, isToday, isYesterday, parseISO } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { EmptyState } from '@/components/global/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageBubble } from '@/features/inbox/components/message-bubble';
import type { Message } from '@/types/message.types';
import { cn } from '@/lib/utils';

const SKELETON_BUBBLES = [
  'h-11 w-2/3 self-start',
  'h-14 w-1/2 self-end',
  'h-11 w-3/5 self-start',
  'h-16 w-1/2 self-start',
  'h-11 w-2/5 self-end',
  'h-12 w-3/5 self-start',
];

function DayDivider({ date }: { date: Date }) {
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const dateLocale = locale === 'ar' ? arSA : enUS;

  const label = isToday(date)
    ? tCommon('today')
    : isYesterday(date)
      ? tCommon('yesterday')
      : format(date, 'd MMMM yyyy', { locale: dateLocale });

  return (
    <div className="flex justify-center py-1.5">
      <span className="rounded-full border border-border/50 bg-muted px-3.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs">
        {label}
      </span>
    </div>
  );
}

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  isFetching: boolean;
  hasOlderMessages: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => void;
}

export function MessageThread({
  messages,
  isLoading,
  isFetching,
  hasOlderMessages,
  isLoadingOlder,
  onLoadOlder,
}: MessageThreadProps) {
  const t = useTranslations('inbox');
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const shouldStickRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const grewAtBottom =
      messages.length > prevCountRef.current &&
      (prevCountRef.current === 0 || shouldStickRef.current);

    if (grewAtBottom) {
      scrollToBottom(prevCountRef.current === 0 ? 'auto' : 'smooth');
    }

    prevCountRef.current = messages.length;
  }, [isLoading, messages.length, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    shouldStickRef.current = distanceFromBottom < 120;

    if (viewport.scrollTop < 80 && hasOlderMessages && !isLoadingOlder) {
      onLoadOlder();
    }
  }, [hasOlderMessages, isLoadingOlder, onLoadOlder]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-3 overflow-hidden bg-muted/30 bg-grid-pattern px-4 py-6">
        {SKELETON_BUBBLES.map((classes) => (
          <Skeleton key={classes} className={cn('rounded-2xl', classes)} />
        ))}
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/30 bg-grid-pattern p-6">
        <EmptyState
          icon={<MessageSquareTextIcon />}
          title={t('noMessages')}
          description={t('noMessagesDescription')}
        />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-muted/30 bg-grid-pattern px-4 py-4"
      onScroll={handleScroll}
    >
      {hasOlderMessages && (
        <div className="flex justify-center py-1.5">
          {isLoadingOlder ? (
            <Loader2Icon className="size-4 animate-spin text-primary" />
          ) : (
            <span className="rounded-full bg-muted px-3.5 py-1 text-[11px] text-muted-foreground shadow-2xs">
              {t('scrollForOlder')}
            </span>
          )}
        </div>
      )}

      {messages.map((message, index) => {
        const currentDate = parseISO(message.createdAt);
        const previousDate = index > 0 ? parseISO(messages[index - 1].createdAt) : null;
        const showDayDivider = !previousDate || !isSameDay(currentDate, previousDate);

        return (
          <Fragment key={message.id}>
            {showDayDivider && <DayDivider date={currentDate} />}
            <MessageBubble message={message} />
          </Fragment>
        );
      })}

      {isFetching && !isLoadingOlder && (
        <div className="flex justify-center py-1">
          <Loader2Icon className="size-4 animate-spin text-primary" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
