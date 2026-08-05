import { toast } from 'sonner';
import { ApiError } from '@/types/api.types';
import { getErrorMessage, getValidationMessages } from '@/utils/error';

export function toastSuccess(message: string): void {
  toast.success(message);
}

export function toastError(error: unknown, fallback = 'حدث خطأ غير متوقع'): void {
  toast.error(getErrorMessage(error, fallback));
}

export function toastValidationError(error: unknown): void {
  const messages = getValidationMessages(error);
  messages.forEach((message) => toast.error(message));
}

export function toastApiError(error: unknown): void {
  const parsed = error instanceof ApiError ? error : null;

  if (parsed?.isForbidden) {
    toast.error(parsed.message || 'ليس لديك صلاحية لتنفيذ هذا الإجراء');
    return;
  }

  if (parsed?.code === 'CONFLICT') {
    toast.error(parsed.message || 'تعارض في البيانات');
    return;
  }

  if (parsed?.isOffline) {
    toast.error('لا يوجد اتصال بالإنترنت');
    return;
  }

  toastError(error);
}

export function toastInfo(message: string): void {
  toast.info(message);
}

export function toastWarning(message: string): void {
  toast.warning(message);
}

export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  },
): Promise<T> {
  toast.promise(promise, messages);
  return promise;
}
