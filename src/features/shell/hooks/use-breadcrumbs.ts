'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { BREADCRUMB_KEYS } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import type { BreadcrumbItem } from '@/types/navigation.types';
import { matchOrgSlugFromPath } from '@/utils/route';

const BREADCRUMB_KEY_SET = new Set<string>(BREADCRUMB_KEYS);

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const t = useTranslations('nav.breadcrumb');

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const orgSlug = matchOrgSlugFromPath(pathname);

    if (segments.length === 0) {
      return [{ label: t('home'), href: ROUTES.home }];
    }

    const items: BreadcrumbItem[] = [];
    let path = '';

    segments.forEach((segment, index) => {
      path += `/${segment}`;

      if (segment === orgSlug) {
        return;
      }

      const label = BREADCRUMB_KEY_SET.has(segment) ? t(segment) : segment;
      const isLast = index === segments.length - 1;

      items.push({
        label,
        href: isLast ? undefined : path,
      });
    });

    return items;
  }, [pathname, t]);
}
