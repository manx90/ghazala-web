'use client';

import {
  ContactIcon,
  FileTextIcon,
  InboxIcon,
  SearchIcon,
  UsersIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { SEARCH_CATEGORY_IDS } from '@/config/navigation';

const CATEGORY_ICONS = {
  contacts: ContactIcon,
  conversations: InboxIcon,
  templates: FileTextIcon,
  organizations: UsersIcon,
  users: UsersIcon,
} as const;

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function GlobalSearchDialogComponent({ open, onOpenChange }: GlobalSearchDialogProps) {
  const t = useTranslations('nav.search');

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title={t('title')} description={t('description')}>
      <CommandInput placeholder={t('placeholder')} aria-label={t('ariaLabel')} />
      <CommandList>
        <CommandEmpty>{t('empty')}</CommandEmpty>
        <CommandGroup heading={t('categoriesHeading')}>
          {SEARCH_CATEGORY_IDS.map((categoryId) => {
            const Icon = CATEGORY_ICONS[categoryId];
            return (
              <CommandItem
                key={categoryId}
                disabled
                className="flex flex-col items-start gap-1 py-3"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {t(`categories.${categoryId}.label`)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`categories.${categoryId}.description`)}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t('actionsHeading')}>
          <CommandItem disabled>
            <SearchIcon data-icon="inline-start" />
            {t('apiPending')}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export const GlobalSearchDialog = memo(GlobalSearchDialogComponent);
