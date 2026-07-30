'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { UploadIcon, XIcon, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  { value, onChange, accept, maxSizeMB = 10, className, label = 'اختر ملفاً' },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`الحجم الأقصى ${maxSizeMB}MB`);
      return;
    }
    setError(null);
    onChange(file);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <input
        ref={ref ?? inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {value ? (
        <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
          <div className="flex items-center gap-2 text-sm">
            <FileIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">{value.name}</span>
            <span className="text-xs text-muted-foreground">({(value.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              handleFile(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="rounded p-1 text-muted-foreground hover:bg-muted"
            aria-label="إزالة الملف"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
        >
          <UploadIcon className="size-6" />
          <span>{label}</span>
        </button>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  preview?: string | null;
  className?: string;
  shape?: 'square' | 'circle';
  size?: number;
}

export function ImageUpload({ value, onChange, preview, className, shape = 'square', size = 96 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const objectUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const src = objectUrl ?? preview;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (file && file.size > 5 * 1024 * 1024) {
            setError('الحجم الأقصى 5MB');
            return;
          }
          setError(null);
          onChange(file);
        }}
      />
      <div
        className={cn('flex items-center justify-center overflow-hidden border bg-muted', shape === 'circle' ? 'rounded-full' : 'rounded-lg')}
        style={{ width: size, height: size }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="معاينة" className="h-full w-full object-cover" />
        ) : (
          <UploadIcon className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-primary hover:underline"
        >
          {value ? 'تغيير الصورة' : 'رفع صورة'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="text-sm text-muted-foreground hover:text-destructive"
          >
            إزالة
          </button>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
