'use client';

import { useQuery } from '@tanstack/react-query';
import {
  FileIcon,
  ImageIcon,
  Loader2Icon,
  PaperclipIcon,
  SendIcon,
  SmileIcon,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { queryKeys } from '@/config/query-keys';
import { useSendMessage } from '@/features/inbox/hooks/use-send-message';
import { templatesApi } from '@/features/templates/api/templates.api';
import { TemplateStatus } from '@/types/template.types';
import { ConversationStatus, type Conversation } from '@/types/conversation.types';

const COMMON_EMOJIS = [
  '😀', '😂', '😍', '😊', '🙏', '👍', '❤️', '🔥', '✅', '🎉',
  '😢', '😡', '🤔', '👋', '💯', '⭐', '📞', '📦', '🚚', '💬',
];

interface MessageComposerProps {
  conversation: Conversation;
  disabled?: boolean;
}

type AttachmentKind = 'image' | 'document';

export function MessageComposer({ conversation, disabled }: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState('');
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [attachmentKind, setAttachmentKind] = useState<AttachmentKind>('image');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentCaption, setAttachmentCaption] = useState('');
  const [attachmentFilename, setAttachmentFilename] = useState('');

  const { sendText, sendTemplate, sendImage, sendDocument, isSending } = useSendMessage();

  const templatesQuery = useQuery({
    queryKey: queryKeys.templates.list,
    queryFn: () => templatesApi.list(),
    enabled: !disabled,
  });

  const approvedTemplates =
    templatesQuery.data?.items.filter((item) => item.status === TemplateStatus.APPROVED) ?? [];

  const basePayload = {
    phoneNumberId: conversation.phoneNumberId,
    recipient: conversation.customerPhone,
    conversationId: conversation.id,
  };

  const insertEmoji = useCallback((emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart ?? body.length;
    const end = textarea.selectionEnd ?? body.length;
    const next = body.slice(0, start) + emoji + body.slice(end);
    setBody(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + emoji.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }, [body]);

  const handleSendText = async () => {
    const trimmed = body.trim();
    if (!trimmed || disabled || isSending) return;

    await sendText({ ...basePayload, body: trimmed });
    setBody('');
  };

  const handleSendTemplate = async (templateId: string) => {
    if (disabled || isSending) return;
    await sendTemplate({ ...basePayload, templateId });
  };

  const handleSendAttachment = async () => {
    const link = attachmentUrl.trim();
    if (!link || disabled || isSending) return;

    if (attachmentKind === 'image') {
      await sendImage({
        ...basePayload,
        link,
        caption: attachmentCaption.trim() || undefined,
      });
    } else {
      await sendDocument({
        ...basePayload,
        link,
        caption: attachmentCaption.trim() || undefined,
        filename: attachmentFilename.trim() || undefined,
      });
    }

    setAttachmentOpen(false);
    setAttachmentUrl('');
    setAttachmentCaption('');
    setAttachmentFilename('');
  };

  if (disabled) {
    return (
      <div className="border-t bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
        ليس لديك صلاحية إرسال الرسائل
      </div>
    );
  }

  if (conversation.status !== ConversationStatus.OPEN) {
    return (
      <div className="border-t bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
        المحادثة مغلقة — أعد فتحها لإرسال رسائل جديدة
      </div>
    );
  }

  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-end gap-2">
        <Popover>
          <PopoverTrigger
            render={
              <Button type="button" variant="ghost" size="icon-sm" aria-label="إدراج إيموجي">
                <SmileIcon />
              </Button>
            }
          />
          <PopoverContent align="start" className="w-64">
            <div className="grid grid-cols-5 gap-1">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="rounded-md p-2 text-lg hover:bg-muted"
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="ghost" size="icon-sm" aria-label="اختيار قالب">
                <FileIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 w-56">
            {templatesQuery.isLoading && (
              <DropdownMenuItem disabled>جاري التحميل...</DropdownMenuItem>
            )}
            {!templatesQuery.isLoading && !approvedTemplates.length && (
              <DropdownMenuItem disabled>لا توجد قوالب معتمدة</DropdownMenuItem>
            )}
            {approvedTemplates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => handleSendTemplate(template.id)}
              >
                {template.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="إرفاق ملف برابط"
          onClick={() => setAttachmentOpen(true)}
        >
          <PaperclipIcon />
        </Button>

        <Textarea
          ref={textareaRef}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="اكتب رسالتك..."
          rows={1}
          className="min-h-9 max-h-32 flex-1 resize-none"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSendText();
            }
          }}
        />

        <Button
          type="button"
          size="icon-sm"
          aria-label="إرسال"
          disabled={!body.trim() || isSending}
          onClick={() => void handleSendText()}
        >
          {isSending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        </Button>
      </div>

      <Dialog open={attachmentOpen} onOpenChange={setAttachmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إرفاق ملف برابط</DialogTitle>
            <DialogDescription>
              أدخل رابطًا عامًا للملف. رفع الملفات غير متاح حاليًا — نقطة API
              {' '}
              <code className="text-xs">POST /media/upload</code>
              {' '}
              غير موجودة بعد.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertDescription className="text-xs">
              يجب أن يكون الرابط متاحًا للوصول العام حتى يتمكن WhatsApp من جلب الملف.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={attachmentKind === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAttachmentKind('image')}
              >
                <ImageIcon />
                صورة
              </Button>
              <Button
                type="button"
                variant={attachmentKind === 'document' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAttachmentKind('document')}
              >
                <FileIcon />
                مستند
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="attachment-url">رابط الملف</Label>
              <Input
                id="attachment-url"
                value={attachmentUrl}
                onChange={(event) => setAttachmentUrl(event.target.value)}
                placeholder="https://example.com/file.jpg"
                dir="ltr"
              />
            </div>

            {attachmentKind === 'document' && (
              <div className="space-y-1.5">
                <Label htmlFor="attachment-filename">اسم الملف (اختياري)</Label>
                <Input
                  id="attachment-filename"
                  value={attachmentFilename}
                  onChange={(event) => setAttachmentFilename(event.target.value)}
                  placeholder="document.pdf"
                  dir="ltr"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="attachment-caption">تعليق (اختياري)</Label>
              <Input
                id="attachment-caption"
                value={attachmentCaption}
                onChange={(event) => setAttachmentCaption(event.target.value)}
                placeholder="وصف المرفق"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAttachmentOpen(false)}>
              إلغاء
            </Button>
            <Button
              type="button"
              disabled={!attachmentUrl.trim() || isSending}
              onClick={() => void handleSendAttachment()}
            >
              {isSending ? <Loader2Icon className="animate-spin" /> : 'إرسال'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
