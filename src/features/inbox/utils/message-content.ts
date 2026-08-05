import { MessageType, type Message } from '@/types/message.types';
import { readTemplatePreviewFromPayload } from '@/features/templates/utils/template-preview';

export interface MessageContent {
  text?: string;
  mediaUrl?: string;
  caption?: string;
  filename?: string;
  templateName?: string;
  templateLanguage?: string;
  templatePreview?: ReturnType<typeof readTemplatePreviewFromPayload>;
}

function readString(payload: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

export function getMessageContent(message: Message): MessageContent {
  const payload = message.payload ?? {};

  switch (message.messageType) {
    case MessageType.TEXT:
      return { text: readString(payload, 'body', 'text', 'message') };

    case MessageType.TEMPLATE: {
      const templatePreview = readTemplatePreviewFromPayload(payload);

      return {
        text: templatePreview?.body ?? readString(payload, 'body', 'text'),
        templateName: readString(payload, 'name', 'templateName'),
        templateLanguage: readString(payload, 'templateLanguage', 'language'),
        templatePreview,
      };
    }

    case MessageType.IMAGE:
    case MessageType.VIDEO:
    case MessageType.AUDIO:
    case MessageType.STICKER:
      return {
        mediaUrl: readString(payload, 'link', 'url'),
        caption: readString(payload, 'caption'),
      };

    case MessageType.DOCUMENT:
      return {
        mediaUrl: readString(payload, 'link', 'url'),
        caption: readString(payload, 'caption'),
        filename: readString(payload, 'filename', 'name'),
      };

    case MessageType.LOCATION:
      return {
        text: readString(payload, 'address', 'name') ?? 'موقع',
      };

    default:
      return {
        text: readString(payload, 'body', 'text', 'caption') ?? message.messageType,
      };
  }
}
