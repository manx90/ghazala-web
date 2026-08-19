'use client';

import {
  FileIcon,
  ImageIcon,
  Loader2Icon,
  PaperclipIcon,
  SendIcon,
  SmileIcon,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/forms/file-upload';
import { TemplatePickerDialog } from '@/features/templates/components/template-picker-dialog';
import { buildTemplateSendMeta } from '@/features/templates/utils/template-preview';
import { useSendMessage } from '@/features/inbox/hooks/use-send-message';
import { usePhoneNumbers } from '@/components/shared/phone-number-select';
import { useFileUpload } from '@/hooks/use-file-upload';
import { ConversationStatus, type Conversation } from '@/types/conversation.types';
import type { Template } from '@/types/template.types';
import type { SendTemplateMessagePayload } from '@/types/message.types';

const COMMON_EMOJIS = [
  '😀', '😂', '😍', '😊', '🙏', '👍', '❤️', '🔥', '✅', '🎉',
  '😢', '😡', '🤔', '👋', '💯', '⭐', '📞', '📦', '🚚', '💬',
];

const IMAGE_ACCEPT = 'image/*';
const DOCUMENT_ACCEPT =
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv';

interface MessageComposerProps {
  conversation: Conversation;
  disabled?: boolean;
}

type AttachmentKind = 'image' | 'document';

export function MessageComposer({ conversation, disabled }: MessageComposerProps) {
  const t = useTranslations('inbox');
  const tCommon = useTranslations('common');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState('');
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [attachmentKind, setAttachmentKind] = useState<AttachmentKind>('image');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentCaption, setAttachmentCaption] = useState('');
  const [attachmentFilename, setAttachmentFilename] = useState('');
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const fileUpload = useFileUpload({
    maxSizeMB: 10,
    acceptedTypes: attachmentKind === 'image' ? IMAGE_ACCEPT : DOCUMENT_ACCEPT,
    onSuccess: (url) => setAttachmentUrl(url),
  });

  const resetAttachmentForm = () => {
    setAttachmentUrl('');
    setAttachmentCaption('');
    setAttachmentFilename('');
    fileUpload.reset();
  };

  const handleAttachmentOpenChange = (open: boolean) => {
    setAttachmentOpen(open);
    if (!open) {
      resetAttachmentForm();
    }
  };

  const { sendText, sendTemplate, sendImage, sendDocument, isSending } = useSendMessage();
  const phoneNumbersQuery = usePhoneNumbers();

  const senderWabaId = phoneNumbersQuery.data?.items.find(
    (phone) => phone.phoneNumberId === conversation.phoneNumberId,
  )?.wabaId;

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

  const handleSendTemplate = async (
    template: Template,
    components?: SendTemplateMessagePayload['components'],
  ) => {
    if (disabled || isSending) return;
    await sendTemplate({
      ...basePayload,
      templateId: template.id,
      ...buildTemplateSendMeta(template),
      components,
    });
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      fileUpload.reset();
      setAttachmentUrl('');
      return;
    }

    setAttachmentUrl('');
    if (attachmentKind === 'document') {
      setAttachmentFilename(file.name);
    }

    const url = await fileUpload.upload(file);
    if (url && attachmentKind === 'document') {
      setAttachmentFilename((prev) => prev || file.name);
    }
  };

  const handleSendAttachment = async () => {
    const link = attachmentUrl.trim();
    if (!link || disabled || isSending || fileUpload.isUploading) return;

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
    resetAttachmentForm();
  };

  const canSendAttachment = Boolean(attachmentUrl.trim()) && !fileUpload.isUploading && !isSending;

  if (disabled) {
    return (
      <div className="border-t border-border/60 bg-muted/40 px-4 py-3.5 text-center text-sm text-muted-foreground">
        {t('noSendPermission')}
      </div>
    );
  }

  if (conversation.status !== ConversationStatus.OPEN) {
    return (
      <div className="border-t border-border/60 bg-muted/40 px-4 py-3.5 text-center text-sm text-muted-foreground">
        {t('conversationClosed')}
      </div>
    );
  }

  return (
    <div className="border-t border-border/60 bg-background p-3">
      <div className="flex items-end gap-1.5 rounded-2xl border border-border/60 bg-card p-2 shadow-xs transition-[border-color,box-shadow] duration-200 focus-within:border-primary/40 focus-within:ring-3 focus-within:ring-primary/15">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label={t('insertEmoji')}
              >
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
                  className="rounded-lg p-2 text-lg transition-colors hover:bg-muted"
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted-foreground hover:text-foreground"
          aria-label={t('pickTemplate')}
          onClick={() => setTemplatePickerOpen(true)}
        >
          <FileIcon />
        </Button>

        <TemplatePickerDialog
          open={templatePickerOpen}
          onOpenChange={setTemplatePickerOpen}
          wabaId={senderWabaId}
          onSelect={(template, components) => void handleSendTemplate(template, components)}
          isSending={isSending}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted-foreground hover:text-foreground"
          aria-label={t('attachFile')}
          onClick={() => setAttachmentOpen(true)}
        >
          <PaperclipIcon />
        </Button>

        <Textarea
          ref={textareaRef}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t('writeMessage')}
          rows={1}
          className="min-h-9 max-h-32 flex-1 resize-none border-0 bg-transparent px-2 shadow-none focus-visible:border-transparent focus-visible:ring-0"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSendText();
            }
          }}
        />

        <Button
          type="button"
          variant="gradient"
          size="icon-sm"
          className="rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label={t('send')}
          disabled={!body.trim() || isSending}
          onClick={() => void handleSendText()}
        >
          {isSending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        </Button>
      </div>

      <Dialog open={attachmentOpen} onOpenChange={handleAttachmentOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('attachDialog.title')}</DialogTitle>
            <DialogDescription>{t('attachDialog.description')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={attachmentKind === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setAttachmentKind('image');
                  resetAttachmentForm();
                }}
              >
                <ImageIcon />
                {t('attachDialog.image')}
              </Button>
              <Button
                type="button"
                variant={attachmentKind === 'document' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setAttachmentKind('document');
                  resetAttachmentForm();
                }}
              >
                <FileIcon />
                {t('attachDialog.document')}
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label>{t('attachDialog.uploadFile')}</Label>
              <FileUpload
                value={fileUpload.file}
                onChange={(file) => void handleFileChange(file)}
                accept={attachmentKind === 'image' ? IMAGE_ACCEPT : DOCUMENT_ACCEPT}
                maxSizeMB={10}
                label={t('attachDialog.chooseFile')}
              />
              {fileUpload.isUploading && fileUpload.progress && (
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-200"
                      style={{ width: `${fileUpload.progress.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('attachDialog.uploading', { progress: fileUpload.progress.percentage })}
                  </p>
                </div>
              )}
              {fileUpload.success && attachmentUrl && (
                <p className="text-xs text-emerald-600">{t('attachDialog.uploadSuccess')}</p>
              )}
              {fileUpload.error && (
                <p className="text-sm text-destructive">{fileUpload.error.message}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t('attachDialog.orManualUrl')}
                </span>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                {t('attachDialog.urlMustBePublic')}
              </AlertDescription>
            </Alert>

            <div className="space-y-1.5">
              <Label htmlFor="attachment-url">{t('attachDialog.fileUrl')}</Label>
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
                <Label htmlFor="attachment-filename">{t('attachDialog.filenameOptional')}</Label>
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
              <Label htmlFor="attachment-caption">{t('attachDialog.captionOptional')}</Label>
              <Input
                id="attachment-caption"
                value={attachmentCaption}
                onChange={(event) => setAttachmentCaption(event.target.value)}
                placeholder={t('attachDialog.captionPlaceholder')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAttachmentOpen(false)}>
              {tCommon('cancel')}
            </Button>
            <Button
              type="button"
              variant="gradient"
              disabled={!canSendAttachment}
              onClick={() => void handleSendAttachment()}
            >
              {isSending || fileUpload.isUploading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                t('send')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
