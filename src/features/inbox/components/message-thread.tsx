'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Loader2Icon } from 'lucide-react';
import { EmptyState } from '@/components/global/empty-state';
import { SkeletonLoader } from '@/components/global/skeleton-loader';
import { MessageBubble } from '@/features/inbox/components/message-bubble';
import type { Message } from '@/types/message.types';

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
      <div className="flex flex-1 items-center justify-center p-6">
        <SkeletonLoader rows={6} />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          title="لا توجد رسائل"
          description="ابدأ المحادثة بإرسال رسالة للعميل"
        />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      onScroll={handleScroll}
    >
      {hasOlderMessages && (
        <div className="flex justify-center py-2">
          {isLoadingOlder ? (
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-xs text-muted-foreground">مرّر للأعلى لتحميل رسائل أقدم</span>
          )}
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isFetching && !isLoadingOlder && (
        <div className="flex justify-center py-1">
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
