'use client';

import { type ReactNode } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, onSubmit, placeholder = 'بحث...', className, autoFocus }: SearchBarProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="ps-9 pe-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onSubmit?.();
          }}
          className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
          aria-label="مسح البحث"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', className)}>
      {children}
    </div>
  );
}

interface BulkActionsBarProps {
  selectedCount: number;
  onClear?: () => void;
  children: ReactNode;
  className?: string;
}

export function BulkActionsBar({ selectedCount, onClear, children, className }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div className={cn('animate-fade-in-down flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-gradient-brand-soft px-3 py-2 shadow-2xs', className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{selectedCount} محدد</span>
        {onClear && (
          <button type="button" onClick={onClear} className="text-muted-foreground hover:text-foreground" aria-label="إلغاء التحديد">
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
