'use client';

import { Link } from '@/i18n/navigation';
import { MessageSquarePlusIcon, UserPlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/config/routes';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import type { ShellVariant } from '@/types/navigation.types';

interface QuickActionsProps {
  variant: ShellVariant;
  orgSlug?: string;
}

function QuickActionsComponent({ variant, orgSlug }: QuickActionsProps) {
  const { can } = usePermissions();
  const t = useTranslations('nav.quickActions');

  if (variant !== 'client' || !orgSlug) {
    return null;
  }

  const canSend = can('messages.send');
  const canManageContacts = can('contacts.manage');

  if (!canSend && !canManageContacts) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="default" size="sm" className="hidden sm:inline-flex" aria-label={t('ariaLabel')} />
        }
      >
        <MessageSquarePlusIcon data-icon="inline-start" />
        {t('button')}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('title')}</DropdownMenuLabel>
          {canSend && (
            <DropdownMenuItem render={<Link href={ROUTES.app.inbox(orgSlug)} />}>
              <MessageSquarePlusIcon data-icon="inline-start" />
              {t('sendMessage')}
            </DropdownMenuItem>
          )}
          {canManageContacts && (
            <DropdownMenuItem render={<Link href={ROUTES.app.contacts(orgSlug)} />}>
              <UserPlusIcon data-icon="inline-start" />
              {t('newContact')}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const QuickActions = memo(QuickActionsComponent);
