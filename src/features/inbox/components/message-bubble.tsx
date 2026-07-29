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
    return <AlertCircleIcon className="size-3.5 text-destructive" aria-label="فشل الإرسال" />;
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
    return <CheckCheckIcon className="size-3.5 text-sky-500" aria-label="مقروءة" />;
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
      <div className="space-y-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={caption ?? 'صورة'} className="max-h-48 rounded-md object-cover" />
        {caption && <p className="text-sm whitespace-pre-wrap">{caption}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline underline-offset-2"
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
    <div className={cn('flex w-full', isOutbound ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm',
          isOutbound
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-foreground',
        )}
      >
        {message.messageType === MessageType.TEMPLATE && content.templateName && (
          <p className="mb-1 text-xs opacity-80">قالب: {content.templateName}</p>
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
            'mt-1 flex items-center gap-1 text-[10px]',
            isOutbound ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOutbound && <MessageStatusTicks status={message.status} />}
        </div>

        {message.status === MessageStatus.FAILED && message.errorMessage && (
          <p className="mt-1 text-xs text-destructive">{message.errorMessage}</p>
        )}
      </div>
    </div>
  );
}
