'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { SETTINGS_NAV_ITEMS, SETTINGS_NAV_SECTIONS } from '@/features/settings/constants/settings-nav';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
  orgSlug: string;
}

function isActiveRoute(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SettingsSidebar({ orgSlug }: SettingsSidebarProps) {
  const pathname = usePathname();
  const { can } = usePermissions();
  const t = useTranslations('nav.settingsNav');

  const items = SETTINGS_NAV_ITEMS.filter(
    (item) => !item.permission || can(item.permission),
  );

  let itemIndex = 0;

  return (
    <nav aria-label={t('ariaLabel')} className="flex flex-col gap-5">
      {SETTINGS_NAV_SECTIONS.map((section) => {
        const sectionItems = section.itemIds
          .map((id) => items.find((item) => item.id === id))
          .filter((item) => item !== undefined);

        if (!sectionItems.length) return null;

        return (
          <div key={section.id} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {t(`sections.${section.labelKey}`)}
            </p>
            {sectionItems.map((item) => {
              const href = item.href(orgSlug);
              const active = isActiveRoute(pathname, href);
              const Icon = item.icon;
              const delay = itemIndex++ * 40;

              return (
                <Link
                  key={item.id}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  style={{ '--stagger-delay': `${delay}ms` } as CSSProperties}
                  className={cn(
                    'stagger-in group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    'text-muted-foreground hover:bg-accent hover:text-foreground',
                    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    active && 'bg-gradient-brand-soft text-primary shadow-2xs',
                  )}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="animate-scale-in bg-gradient-brand absolute start-0.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full"
                    />
                  )}
                  <Icon
                    className={cn('size-4 shrink-0 transition-colors duration-200', active && 'text-primary')}
                    aria-hidden="true"
                  />
                  <span className="truncate">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
