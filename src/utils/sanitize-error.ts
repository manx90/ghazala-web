import { parseApiError } from '@/utils/error';

const SAFE_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.',
  FORBIDDEN: 'ليس لديك صلاحية لتنفيذ هذا الإجراء.',
  NOT_FOUND: 'المورد المطلوب غير موجود.',
  VALIDATION_ERROR: 'يرجى مراجعة البيانات المدخلة.',
  NETWORK_ERROR: 'تعذر الاتصال بالخادم. تحقق من اتصالك.',
  TIMEOUT: 'انتهت مهلة الطلب. حاول مرة أخرى.',
  RATE_LIMITED: 'طلبات كثيرة. انتظر قليلاً ثم أعد المحاولة.',
  SERVER_ERROR: 'حدث خطأ في الخادم. حاول لاحقاً.',
};

const SENSITIVE_PATTERNS = [
  /sql/i,
  /stack/i,
  /trace/i,
  /internal server/i,
  /exception/i,
  /at\s+\w+\./,
  /ECONNREFUSED/,
  /ENOTFOUND/,
];

function isSensitiveMessage(message: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(message));
}

export function sanitizeErrorForDisplay(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  const parsed = parseApiError(error);

  if (parsed.code in SAFE_MESSAGES) {
    const safe = SAFE_MESSAGES[parsed.code];
    if (parsed.isValidationError && parsed.message && !isSensitiveMessage(parsed.message)) {
      return parsed.message;
    }
    return safe ?? fallback;
  }

  if (process.env.NODE_ENV === 'development') {
    return parsed.message || fallback;
  }

  if (parsed.message && !isSensitiveMessage(parsed.message) && parsed.statusCode < 500) {
    return parsed.message;
  }

  return fallback;
}

export function sanitizeRuntimeError(error: Error & { digest?: string }): string {
  if (process.env.NODE_ENV === 'development') {
    return error.message || 'حدث خطأ غير متوقع';
  }
  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
}
