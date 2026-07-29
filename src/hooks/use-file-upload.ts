'use client';

import { useCallback, useState } from 'react';
import { useNetworkAware } from '@/hooks/use-network-aware';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadState {
  file: File | null;
  progress: UploadProgress | null;
  isUploading: boolean;
  error: Error | null;
  success: boolean;
}

interface UseFileUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
  maxSizeMB?: number;
  acceptedTypes?: string;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = 'image/*,application/pdf,application/vnd.*,text/*';

/**
 * ⚠️ Backend endpoint مفقود: POST /media/upload
 * هذا الـ hook جاهز للتكامل فور توفر الـ endpoint.
 * حالياً يقوم بقراءة الملف محلياً ويعيد data URL كـ preview فقط.
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxSizeMB = MAX_SIZE_MB, acceptedTypes = ACCEPTED_TYPES } = options;
  const { isOnline } = useNetworkAware();
  const [state, setState] = useState<FileUploadState>({
    file: null,
    progress: null,
    isUploading: false,
    error: null,
    success: false,
  });

  const reset = useCallback(() => {
    setState({ file: null, progress: null, isUploading: false, error: null, success: false });
  }, []);

  const validateFile = useCallback(
    (file: File): Error | null => {
      if (!isOnline) return new Error('لا يوجد اتصال بالإنترنت');
      if (file.size > maxSizeMB * 1024 * 1024) {
        return new Error(`الحجم الأقصى ${maxSizeMB}MB`);
      }
      if (acceptedTypes !== '*') {
        const accepted = acceptedTypes.split(',').some((type) => {
          const trimmed = type.trim();
          if (trimmed.endsWith('/*')) return file.type.startsWith(trimmed.slice(0, -1));
          return file.type === trimmed;
        });
        if (!accepted) return new Error('نوع الملف غير مدعوم');
      }
      return null;
    },
    [isOnline, maxSizeMB, acceptedTypes],
  );

  const selectFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setState((prev) => ({ ...prev, file, error, success: false }));
        options.onError?.(error);
        return;
      }
      setState({ file, progress: null, isUploading: false, error: null, success: false });
    },
    [validateFile, options],
  );

  const upload = useCallback(async (): Promise<string | null> => {
    if (!state.file) return null;

    const missingEndpoint = new Error(
      'Endpoint رفع الملفات غير متوفر في الـ backend. المطلوب: POST /media/upload',
    );
    setState((prev) => ({ ...prev, isUploading: false, error: missingEndpoint, success: false }));
    options.onError?.(missingEndpoint);
    return null;
  }, [state.file, options]);

  const uploadWithPreview = useCallback(async (): Promise<string | null> => {
    const file = state.file;
    if (!file) return null;

    setState((prev) => ({ ...prev, isUploading: true, progress: { loaded: 0, total: file.size, percentage: 0 }, error: null }));

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          setState((prev) => ({
            ...prev,
            progress: {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            },
          }));
        }
      };
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setState((prev) => ({ ...prev, isUploading: false, progress: null, success: true }));
        options.onSuccess?.(dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = () => {
        const error = new Error('فشل قراءة الملف');
        setState((prev) => ({ ...prev, isUploading: false, error, success: false }));
        options.onError?.(error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }, [state.file, options]);

  return { ...state, selectFile, upload, uploadWithPreview, reset, validateFile };
}
