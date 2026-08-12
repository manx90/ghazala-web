'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  maxDisplay = 3,
}: MultiSelectProps) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const displayPlaceholder = placeholder ?? t('choose');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const selected = options.filter((o) => value.includes(o.value));

  const toggle = (val: string) => {
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn('h-auto min-h-8 w-full justify-start font-normal', className)}
          />
        }
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground">{displayPlaceholder}</span>
        ) : (
          <span className="flex flex-wrap items-center gap-1">
            {selected.slice(0, maxDisplay).map((o) => (
              <span key={o.value} className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                {o.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(o.value);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={t('forms.removeOption', { label: o.label })}
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            ))}
            {selected.length > maxDisplay && (
              <span className="text-xs text-muted-foreground">+{selected.length - maxDisplay}</span>
            )}
          </span>
        )}
        <ChevronDownIcon className="ms-auto size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <div className="border-b p-2">
          <div className="relative">
            <SearchIcon className="absolute start-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-7 ps-7 text-xs"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">{t('noResults')}</p>
          ) : (
            filtered.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span className={cn('flex size-4 items-center justify-center rounded border', checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input')}>
                    {checked && <CheckIcon className="size-3" />}
                  </span>
                  <span className="flex flex-1 flex-col text-start">
                    <span>{opt.label}</span>
                    {opt.description && <span className="text-xs text-muted-foreground">{opt.description}</span>}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface AsyncSelectProps<T> {
  fetchOptions: (search: string) => Promise<T[]>;
  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loadingMessage?: string;
  noOptionsMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function AsyncSelect<T>({
  fetchOptions,
  getOptionValue,
  getOptionLabel,
  value,
  onChange,
  placeholder,
  loadingMessage,
  noOptionsMessage,
  className,
  disabled,
}: AsyncSelectProps<T>) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [fetched, setFetched] = useState(false);
  const displayPlaceholder = placeholder ?? t('choose');
  const displayLoading = loadingMessage ?? t('loading');
  const displayEmpty = noOptionsMessage ?? t('noResults');

  const handleOpen = (next: boolean) => {
    setOpen(next);
    if (next && !fetched) {
      setLoading(true);
      fetchOptions('')
        .then((res) => setItems(res))
        .finally(() => {
          setLoading(false);
          setFetched(true);
        });
    }
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    setLoading(true);
    fetchOptions(q)
      .then((res) => setItems(res))
      .finally(() => setLoading(false));
  };

  const selected = items.find((i) => getOptionValue(i) === value);

  let content: ReactNode = null;
  if (loading) content = <p className="py-4 text-center text-xs text-muted-foreground">{displayLoading}</p>;
  else if (items.length === 0) content = <p className="py-4 text-center text-xs text-muted-foreground">{displayEmpty}</p>;
  else {
    content = items.map((item) => {
      const val = getOptionValue(item);
      return (
        <button
          key={val}
          type="button"
          onClick={() => {
            onChange(val);
            setOpen(false);
          }}
          className={cn('flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent', value === val && 'bg-accent')}
        >
          {getOptionLabel(item)}
        </button>
      );
    });
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn('h-8 w-full justify-start font-normal', className)}
          />
        }
      >
        <span className={cn(!selected && 'text-muted-foreground')}>{selected ? getOptionLabel(selected) : displayPlaceholder}</span>
        <ChevronDownIcon className="ms-auto size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <div className="border-b p-2">
          <div className="relative">
            <SearchIcon className="absolute start-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-7 ps-7 text-xs"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto p-1">{content}</div>
      </PopoverContent>
    </Popover>
  );
}
