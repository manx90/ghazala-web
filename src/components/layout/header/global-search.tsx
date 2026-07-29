'use client';

import dynamic from 'next/dynamic';
import { SearchIcon } from 'lucide-react';
import { memo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/ui.store';

const GlobalSearchDialog = dynamic(
  () =>
    import('@/components/layout/header/global-search-dialog').then(
      (mod) => mod.GlobalSearchDialog,
    ),
  { ssr: false },
);

function GlobalSearchTriggerComponent() {
  const isOpen = useUiStore((state) => state.isCommandPaletteOpen);
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setOpen]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden w-56 justify-start gap-2 text-muted-foreground md:flex"
        onClick={() => setOpen(true)}
        aria-label="بحث عام"
      >
        <SearchIcon />
        <span className="flex-1 text-start">بحث...</span>
        <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium lg:inline-block">
          ⌘K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="بحث عام"
      >
        <SearchIcon />
      </Button>
      <GlobalSearchDialog open={isOpen} onOpenChange={setOpen} />
    </>
  );
}

export const GlobalSearch = memo(GlobalSearchTriggerComponent);
