import { axiosInstance } from '@/services/api/client';
import { parseApiError } from '@/utils/error';
import { ApiError } from '@/types/api.types';

export interface UploadFileOptions {
  file: File;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  maxRetries?: number;
}

export interface UploadFileResult {
  url: string;
  mimeType: string;
  filename: string;
  size: number;
}

const UPLOAD_ENDPOINT = '/media/upload';
const DEFAULT_MAX_RETRIES = 2;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadFile(options: UploadFileOptions): Promise<UploadFileResult> {
  const { file, onProgress, signal, maxRetries = DEFAULT_MAX_RETRIES } = options;
  const formData = new FormData();
  formData.append('file', file);

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axiosInstance.post<UploadFileResult>(UPLOAD_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal,
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const parsed = parseApiError(error);

      if (parsed.statusCode === 404 || parsed.statusCode === 501) {
        throw parsed;
      }

      if (signal?.aborted) {
        throw new ApiError({
          message: 'تم إلغاء الرفع',
          statusCode: 0,
          code: 'UNKNOWN',
          error: 'Aborted',
        });
      }

      if (attempt < maxRetries && (parsed.statusCode >= 500 || parsed.statusCode === 0)) {
        await delay(300 * (attempt + 1) ** 2);
        continue;
      }

      throw parsed;
    }
  }

  throw parseApiError(lastError);
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
