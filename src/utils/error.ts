import type { ApiErrorCode, ApiErrorResponse } from '@/types/api.types';
import { ApiError } from '@/types/api.types';
import { isAxiosError } from 'axios';

function normalizeMessages(message: string | string[]): string[] {
  return Array.isArray(message) ? message : [message];
}

function mapStatusToCode(status: number): ApiErrorCode {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422 || status === 400) return 'VALIDATION_ERROR';
  if (status === 408) return 'TIMEOUT';
  if (status === 429) return 'RATE_LIMITED';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

export function createNetworkError(isOffline = false): ApiError {
  return new ApiError({
    message: isOffline ? 'لا يوجد اتصال بالإنترنت' : 'فشل الاتصال بالخادم',
    statusCode: 0,
    code: isOffline ? 'NETWORK_ERROR' : 'NETWORK_ERROR',
    error: 'Network Error',
    isOffline,
  });
}

export function createTimeoutError(): ApiError {
  return new ApiError({
    message: 'انتهت مهلة الطلب',
    statusCode: 408,
    code: 'TIMEOUT',
    error: 'Request Timeout',
  });
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return createTimeoutError();
    }

    if (!error.response) {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      return createNetworkError(isOffline);
    }

    const data = error.response.data as Partial<ApiErrorResponse> | undefined;
    const status = error.response.status;
    const messages = normalizeMessages(data?.message ?? error.message);

    return new ApiError({
      message: messages[0] ?? 'حدث خطأ غير متوقع',
      statusCode: status,
      code: mapStatusToCode(status),
      error: data?.error ?? error.response.statusText,
      messages,
      path: data?.path,
      method: data?.method,
      requestId: data?.requestId,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      statusCode: 500,
      code: 'UNKNOWN',
      error: error.name,
    });
  }

  return new ApiError({
    message: 'حدث خطأ غير متوقع',
    statusCode: 500,
    code: 'UNKNOWN',
    error: 'Unknown Error',
  });
}

export function getErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  return parseApiError(error).message || fallback;
}

export function getValidationMessages(error: unknown): string[] {
  const parsed = parseApiError(error);
  return parsed.isValidationError ? parsed.messages : [parsed.message];
}
