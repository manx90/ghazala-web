'use client';

import { CheckCheckIcon, CheckIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageDirection, MessageStatus, type Message } from '@/types/message.types';
import { MessageType } from '@/types/message.types';
import { formatTime } from '@/utils/date';
import { getMessageContent } from '@/features/inbox/utils/message-content';

interface MessageBubbleProps {
  message: Message;
}

function MessageStatusTicks({ status }: { status: MessageStatus }) {
  if (status === MessageStatus.FAILED) {
    return <AlertCircleIcon className="size-3.5 text-red-300" aria-label="فشل الإرسال" />;
  }

  if (status === MessageStatus.QUEUED || status === MessageStatus.SENDING) {
    return <ClockIcon className="size-3.5 opacity-70" aria-label="قيد الإرسال" />;
  }

  if (status === MessageStatus.SENT) {
    return <CheckIcon className="size-3.5 opacity-70" aria-label="مُرسلة" />;
  }

  if (status === MessageStatus.DELIVERED) {
    return <CheckCheckIcon className="size-3.5 opacity-70" aria-label="مُسلّمة" />;
  }

  if (status === MessageStatus.READ) {
    return <CheckCheckIcon className="size-3.5 text-sky-300" aria-label="مقروءة" />;
  }

  return null;
}

function MediaPreview({ url, type, caption, filename }: {
  url: string;
  type: MessageType;
  caption?: string;
  filename?: string;
}) {
  if (type === MessageType.IMAGE || type === MessageType.STICKER) {
    return (
      <div className="space-y-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={caption ?? 'صورة'}
          className="max-h-56 rounded-xl object-cover ring-1 ring-black/10"
        />
        {caption && <p className="text-sm whitespace-pre-wrap">{caption}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-black/10 px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-black/15"
      >
        {filename ?? 'فتح المرفق'}
      </a>
      {caption && <p className="text-sm whitespace-pre-wrap">{caption}</p>}
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.direction === MessageDirection.OUTBOUND;
  const content = getMessageContent(message);

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in-up',
        isOutbound ? 'justify-start' : 'justify-end',
      )}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
          isOutbound
            ? 'rounded-tr-sm bg-gradient-brand text-white shadow-md'
            : 'rounded-tl-sm border border-border/60 bg-card text-foreground shadow-2xs',
        )}
      >
        {message.messageType === MessageType.TEMPLATE && content.templateName && (
          <p className="mb-1.5 text-[11px] font-medium opacity-75">قالب: {content.templateName}</p>
        )}

        {content.mediaUrl ? (
          <MediaPreview
            url={content.mediaUrl}
            type={message.messageType}
            caption={content.caption}
            filename={content.filename}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words">{content.text ?? '—'}</p>
        )}

        <div
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-[10px]',
            isOutbound ? 'text-white/70' : 'text-muted-foreground/80',
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOutbound && <MessageStatusTicks status={message.status} />}
        </div>

        {message.status === MessageStatus.FAILED && message.errorMessage && (
          <p className="mt-1 text-xs text-red-200">{message.errorMessage}</p>
        )}
      </div>
    </div>
  );
}
