import { ApiError } from '@/types/api.types';

/**
 * رفع الملفات — يتطلب endpoint backend: POST /media/upload
 * Endpoint غير متوفر حالياً في الـ backend.
 */
export interface UploadFileOptions {
  file: File;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export interface UploadFileResult {
  url: string;
  mimeType: string;
  filename: string;
  size: number;
}

export class UploadNotAvailableError extends ApiError {
  constructor() {
    super({
      message: 'رفع الملفات غير متاح — endpoint POST /media/upload غير موجود في الـ backend',
      statusCode: 501,
      code: 'UNKNOWN',
      error: 'Not Implemented',
    });
  }
}

export async function uploadFile(_options: UploadFileOptions): Promise<UploadFileResult> {
  throw new UploadNotAvailableError();
}

export function createFormData(
  data: Record<string, string | Blob | File | undefined | null>,
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
}
