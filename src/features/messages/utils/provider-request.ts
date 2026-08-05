export interface ProviderRequestSnapshot {
  endpoint: string;
  method: string;
  body: Record<string, unknown>;
  sentAt: string;
}

export interface ProviderResponseSnapshot {
  metaMessageId?: string;
  error?: {
    code?: string;
    message?: string;
    subcode?: string;
  };
  receivedAt: string;
}

export function readProviderRequest(
  payload: Record<string, unknown>,
): ProviderRequestSnapshot | undefined {
  const raw = payload.providerRequest;
  if (!raw || typeof raw !== 'object') return undefined;

  const request = raw as Record<string, unknown>;
  if (typeof request.endpoint !== 'string' || typeof request.method !== 'string') {
    return undefined;
  }

  return {
    endpoint: request.endpoint,
    method: request.method,
    body:
      request.body && typeof request.body === 'object'
        ? (request.body as Record<string, unknown>)
        : {},
    sentAt: typeof request.sentAt === 'string' ? request.sentAt : '',
  };
}

export function readProviderResponse(
  payload: Record<string, unknown>,
): ProviderResponseSnapshot | undefined {
  const raw = payload.providerResponse;
  if (!raw || typeof raw !== 'object') return undefined;

  const response = raw as Record<string, unknown>;
  const errorRaw = response.error;

  return {
    metaMessageId: typeof response.metaMessageId === 'string' ? response.metaMessageId : undefined,
    error:
      errorRaw && typeof errorRaw === 'object'
        ? {
            code: typeof (errorRaw as Record<string, unknown>).code === 'string'
              ? ((errorRaw as Record<string, unknown>).code as string)
              : undefined,
            message: typeof (errorRaw as Record<string, unknown>).message === 'string'
              ? ((errorRaw as Record<string, unknown>).message as string)
              : undefined,
            subcode: typeof (errorRaw as Record<string, unknown>).subcode === 'string'
              ? ((errorRaw as Record<string, unknown>).subcode as string)
              : undefined,
          }
        : undefined,
    receivedAt: typeof response.receivedAt === 'string' ? response.receivedAt : '',
  };
}
