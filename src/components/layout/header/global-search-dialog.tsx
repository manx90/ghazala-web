'use client';

import {
  ContactIcon,
  FileTextIcon,
  InboxIcon,
  SearchIcon,
  UsersIcon,
} from 'lucide-react';
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
import { SEARCH_CATEGORIES } from '@/config/navigation';

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
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="بحث عام" description="بحث في المنصة">
      <CommandInput placeholder="ابحث..." aria-label="بحث عام" />
      <CommandList>
        <CommandEmpty>لا توجد نتائج — البحث غير مفعّل بعد</CommandEmpty>
        <CommandGroup heading="فئات البحث (قريباً)">
          {SEARCH_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <CommandItem
                key={category.id}
                disabled
                className="flex flex-col items-start gap-1 py-3"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {category.label}
                </span>
                <span className="text-xs text-muted-foreground">{category.description}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="إجراءات">
          <CommandItem disabled>
            <SearchIcon data-icon="inline-start" />
            سيتم تفعيل البحث عند ربط واجهات API
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export const GlobalSearchDialog = memo(GlobalSearchDialogComponent);
