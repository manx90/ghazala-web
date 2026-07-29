'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { BREADCRUMB_LABELS } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import type { BreadcrumbItem } from '@/types/navigation.types';
import { matchOrgSlugFromPath } from '@/utils/route';

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const orgSlug = matchOrgSlugFromPath(pathname);

    if (segments.length === 0) {
      return [{ label: 'الرئيسية', href: ROUTES.home }];
    }

    const items: BreadcrumbItem[] = [];
    let path = '';

    segments.forEach((segment, index) => {
      path += `/${segment}`;

      if (segment === orgSlug) {
        return;
      }

      const label = BREADCRUMB_LABELS[segment] ?? segment;
      const isLast = index === segments.length - 1;

      items.push({
        label,
        href: isLast ? undefined : path,
      });
    });

    return items;
  }, [pathname]);
}
