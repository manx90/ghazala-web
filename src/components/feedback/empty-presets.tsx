'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  DatabaseIcon,
  InboxIcon,
  UsersIcon,
  FileTextIcon,
  Building2Icon,
  BellIcon,
  SearchXIcon,
  WifiOffIcon,
  PackageXIcon,
} from 'lucide-react';
import { EmptyState, EmptyStateAction } from '@/components/global/empty-state';

interface EmptyStatePresetProps {
  action?: ReactNode;
  className?: string;
}

export function NoDataEmpty({
  title,
  description,
  action,
}: EmptyStatePresetProps & { title?: string; description?: string }) {
  const tCommon = useTranslations('common');

  return (
    <EmptyState
      icon={<DatabaseIcon className="size-10" />}
      title={title ?? tCommon('noData')}
      description={description}
      action={action}
    />
  );
}

export function NoSearchResultsEmpty({ query, action }: EmptyStatePresetProps & { query?: string }) {
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors.search');

  return (
    <EmptyState
      icon={<SearchXIcon className="size-10" />}
      title={tCommon('noResults')}
      description={
        query ? tErrors('noResultsFor', { query }) : tErrors('noResultsHint')
      }
      action={action}
    />
  );
}

export function NoMessagesEmpty({ action }: EmptyStatePresetProps) {
  const t = useTranslations('errors.empty.messages');

  return (
    <EmptyState
      icon={<InboxIcon className="size-10" />}
      title={t('title')}
      description={t('description')}
      action={action}
    />
  );
}

export function NoContactsEmpty({ action }: EmptyStatePresetProps) {
  const t = useTranslations('errors.empty.contacts');

  return (
    <EmptyState
      icon={<UsersIcon className="size-10" />}
      title={t('title')}
      description={t('description')}
      action={action}
    />
  );
}

export function NoTemplatesEmpty({ action }: EmptyStatePresetProps) {
  const t = useTranslations('errors.empty.templates');

  return (
    <EmptyState
      icon={<FileTextIcon className="size-10" />}
      title={t('title')}
      description={t('description')}
      action={action}
    />
  );
}

export function NoOrganizationsEmpty({ action }: EmptyStatePresetProps) {
  const t = useTranslations('errors.empty.organizations');

  return (
    <EmptyState
      icon={<Building2Icon className="size-10" />}
      title={t('title')}
      description={t('description')}
      action={action}
    />
  );
}

export function NoNotificationsEmpty() {
  const t = useTranslations('errors.empty.notifications');

  return (
    <EmptyState
      icon={<BellIcon className="size-10" />}
      title={t('title')}
      description={t('description')}
    />
  );
}

export function OfflineEmpty({ action }: EmptyStatePresetProps) {
  const t = useTranslations('errors.empty.offline');

  return (
    <EmptyState
      icon={<WifiOffIcon className="size-10" />}
      title={t('title')}
      description={t('description')}
      action={action}
    />
  );
}

export function GenericEmpty({ action }: EmptyStatePresetProps) {
  const t = useTranslations('errors.empty.generic');

  return (
    <EmptyState
      icon={<PackageXIcon className="size-10" />}
      title={t('title')}
      action={action}
    />
  );
}

export { EmptyStateAction };
