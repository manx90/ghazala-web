import {
  Building2Icon,
  CreditCardIcon,
  KeyIcon,
  ShieldIcon,
  SmartphoneIcon,
  UserIcon,
  UsersIcon,
  WebhookIcon,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';
import type { Permission } from '@/utils/permission';
import type { LucideIcon } from 'lucide-react';

export interface SettingsNavItem {
  id: string;
  labelKey: string;
  href: (orgSlug: string) => string;
  icon: LucideIcon;
  permission?: Permission;
}

export const SETTINGS_NAV_ITEMS: SettingsNavItem[] = [
  {
    id: 'organization',
    labelKey: 'organization',
    href: ROUTES.app.settings.organization,
    icon: Building2Icon,
    permission: 'org.manage',
  },
  {
    id: 'team',
    labelKey: 'team',
    href: ROUTES.app.settings.team,
    icon: UsersIcon,
    permission: 'team.manage',
  },
  {
    id: 'whatsapp',
    labelKey: 'whatsapp',
    href: ROUTES.app.settings.whatsapp,
    icon: SmartphoneIcon,
    permission: 'whatsapp.manage',
  },
  {
    id: 'meta',
    labelKey: 'meta',
    href: ROUTES.app.settings.meta,
    icon: ShieldIcon,
    permission: 'meta.manage',
  },
  {
    id: 'billing',
    labelKey: 'billing',
    href: ROUTES.app.settings.billing,
    icon: CreditCardIcon,
    permission: 'billing.manage',
  },
  {
    id: 'profile',
    labelKey: 'profile',
    href: ROUTES.app.settings.profile,
    icon: UserIcon,
    permission: 'org.read',
  },
  {
    id: 'security',
    labelKey: 'security',
    href: ROUTES.app.settings.security,
    icon: ShieldIcon,
    permission: 'org.read',
  },
  {
    id: 'webhooks',
    labelKey: 'webhooks',
    href: ROUTES.app.settings.webhooks,
    icon: WebhookIcon,
    permission: 'org.manage',
  },
  {
    id: 'api-keys',
    labelKey: 'api-keys',
    href: ROUTES.app.settings.apiKeys,
    icon: KeyIcon,
    permission: 'org.manage',
  },
];

export const SETTINGS_NAV_SECTIONS = [
  { id: 'management', labelKey: 'management', itemIds: ['organization', 'team', 'billing'] },
  { id: 'integrations', labelKey: 'integrations', itemIds: ['whatsapp', 'meta', 'webhooks', 'api-keys'] },
  { id: 'account', labelKey: 'account', itemIds: ['profile', 'security'] },
] as const;
