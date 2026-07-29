import { MessageType, type Message } from '@/types/message.types';

export interface MessageContent {
  text?: string;
  mediaUrl?: string;
  caption?: string;
  filename?: string;
  templateName?: string;
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

    case MessageType.TEMPLATE:
      return {
        text: readString(payload, 'body', 'text'),
        templateName: readString(payload, 'name', 'templateName'),
      };

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
