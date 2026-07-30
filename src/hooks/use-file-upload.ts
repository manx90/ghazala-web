'use client';

import { useCallback, useRef, useState } from 'react';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { uploadFile } from '@/services/api/upload';
import { parseApiError } from '@/utils/error';

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
  maxRetries?: number;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = 'image/*,application/pdf,application/vnd.*,text/*';

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxSizeMB = MAX_SIZE_MB, acceptedTypes = ACCEPTED_TYPES, maxRetries = 2 } = options;
  const { isOnline } = useNetworkAware();
  const abortRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<FileUploadState>({
    file: null,
    progress: null,
    isUploading: false,
    error: null,
    success: false,
  });

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ file: null, progress: null, isUploading: false, error: null, success: false });
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState((prev) => ({ ...prev, isUploading: false, progress: null }));
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

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      isUploading: true,
      error: null,
      progress: { loaded: 0, total: state.file!.size, percentage: 0 },
    }));

    try {
      const result = await uploadFile({
        file: state.file,
        signal: controller.signal,
        maxRetries,
        onProgress: (percentage) => {
          setState((prev) => ({
            ...prev,
            progress: {
              loaded: Math.round((state.file!.size * percentage) / 100),
              total: state.file!.size,
              percentage,
            },
          }));
        },
      });

      setState((prev) => ({ ...prev, isUploading: false, progress: null, success: true }));
      options.onSuccess?.(result.url);
      return result.url;
    } catch (error) {
      const parsed = parseApiError(error);
      setState((prev) => ({
        ...prev,
        isUploading: false,
        progress: null,
        error: parsed,
        success: false,
      }));
      options.onError?.(parsed);
      return null;
    } finally {
      abortRef.current = null;
    }
  }, [state.file, maxRetries, options]);

  const uploadWithPreview = useCallback(async (): Promise<string | null> => {
    const file = state.file;
    if (!file) return null;

    setState((prev) => ({
      ...prev,
      isUploading: true,
      progress: { loaded: 0, total: file.size, percentage: 0 },
      error: null,
    }));

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

  return { ...state, selectFile, upload, uploadWithPreview, reset, cancel, validateFile };
}
